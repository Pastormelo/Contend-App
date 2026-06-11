import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateStructured } from "@/lib/ai/client";
import { RespondScoreSchema, rubricAverage } from "@/lib/ai/schemas";
import { buildRespondPrompt } from "@/lib/ai/prompts/respond";
import { awardXp, scaleXp } from "@/lib/xp";
import { AI_TEMPERATURE, MODELS, XP } from "@/lib/config";

const bodySchema = z.object({
  objection: z.string().min(10).max(500),
  responseText: z.string().min(20).max(4000),
});

const MODEL_ANSWER_BLOCK_ID = "50000000-0000-0000-0000-000000000016";

export async function POST(request: Request) {
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
  const [{ data: rubricRow }, { data: modelAnswerBlock }, { data: sources }] =
    await Promise.all([
      service
        .from("rubric_prompts")
        .select("prompt_text")
        .eq("active", true)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle(),
      service
        .from("lesson_blocks")
        .select("content")
        .eq("id", MODEL_ANSWER_BLOCK_ID)
        .maybeSingle(),
      service.from("sources").select("id, title"),
    ]);

  if (!rubricRow) {
    return NextResponse.json({ error: "Scoring unavailable" }, { status: 503 });
  }

  const modelAnswerContent = (modelAnswerBlock?.content ?? {}) as {
    points?: string[];
    notes?: string;
  };
  const modelAnswer = [
    ...(modelAnswerContent.points ?? []),
    modelAnswerContent.notes ?? "",
  ].join("\n");

  const { system, prompt } = buildRespondPrompt({
    rubricPrompt: rubricRow.prompt_text,
    objection: parsed.data.objection,
    responseText: parsed.data.responseText,
    modelAnswer,
    sources: sources ?? [],
  });

  let score;
  try {
    score = await generateStructured(service, {
      userId: user.id,
      feature: "respond_score",
      model: MODELS.coach,
      system,
      prompt,
      schema: RespondScoreSchema,
      temperature: AI_TEMPERATURE.scoring,
    });
  } catch {
    return NextResponse.json(
      { error: "Scoring failed — your response was not lost. Try again." },
      { status: 502 },
    );
  }

  const avg = rubricAverage(score.rubric);
  const xpAwarded = scaleXp(XP.respondMin, XP.respondMax, avg);

  await service.from("written_responses").insert({
    user_id: user.id,
    source: "drill",
    response_text: parsed.data.responseText,
    rubric_scores: score.rubric,
    ai_feedback: score.feedback,
    stronger_answer: score.stronger_answer,
  });

  await awardXp(service, user.id, xpAwarded, "respond_drill");

  return NextResponse.json({
    rubric: score.rubric,
    feedback: score.feedback,
    strongerAnswer: score.stronger_answer,
    xpAwarded,
  });
}
