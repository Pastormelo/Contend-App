import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { gradeQuiz, type Question } from "@/lib/scoring";
import { awardXp } from "@/lib/xp";
import { QUIZ_PASS_THRESHOLD, XP } from "@/lib/config";

const bodySchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        value: z.union([z.number().int().min(0).max(20), z.string().max(200)]),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: quizId } = await params;
  if (!z.string().uuid().safeParse(quizId).success) {
    return NextResponse.json({ error: "Invalid quiz" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const service = createServiceClient();
  const [{ data: quiz }, { data: questions }] = await Promise.all([
    service.from("quizzes").select("id, lesson_id, config").eq("id", quizId).maybeSingle(),
    service
      .from("question_bank")
      .select("id, type, answer, source_block_id")
      .eq("quiz_id", quizId)
      .eq("status", "published")
      .order("sort"),
  ]);

  if (!quiz || !questions?.length) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const responses = new Map<string, unknown>(
    parsed.data.answers.map((a) => [a.questionId, a.value]),
  );
  const { score, results } = gradeQuiz(questions as Question[], responses);

  const threshold =
    ((quiz.config as { pass_threshold?: number }) ?? {}).pass_threshold ??
    QUIZ_PASS_THRESHOLD;
  const passed = score >= threshold;

  // XP only on the FIRST pass
  let xpAwarded = 0;
  if (passed) {
    const { data: priorPass } = await service
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("quiz_id", quizId)
      .eq("passed", true)
      .limit(1);
    if (!priorPass?.length) {
      xpAwarded = XP.checkpointPass;
      await awardXp(service, user.id, xpAwarded, "checkpoint_pass", quizId);
    }
  }

  await service.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_id: quizId,
    score,
    passed,
    answers: parsed.data.answers,
    finished_at: new Date().toISOString(),
  });

  return NextResponse.json({
    score,
    passed,
    xpAwarded,
    lessonId: quiz.lesson_id,
    results: results.map((r) => ({
      questionId: r.questionId,
      correct: r.correct,
      note: r.note ?? null,
      sourceBlockId: r.sourceBlockId,
    })),
  });
}
