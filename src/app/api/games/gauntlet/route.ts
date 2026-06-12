import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  gradeMc,
  gradeTfq,
  type McAnswer,
  type TfqAnswer,
} from "@/lib/scoring";

const QUIZ_ID = "70000000-0000-0000-0000-000000000001";

/** GET — shuffled gauntlet questions, answers stay server-side. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const { data: questions } = await service
    .from("question_bank")
    .select("id, type, prompt, options")
    .eq("quiz_id", QUIZ_ID)
    .in("type", ["mc", "tfq"]);

  const shuffled = (questions ?? [])
    .map((q) => ({ q, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ q }) => q);

  return NextResponse.json({ questions: shuffled });
}

const answerSchema = z.object({
  questionId: z.string().uuid(),
  // mc sends an option index; tfq sends the option string; null = timeout
  answer: z.union([z.number(), z.string(), z.null()]),
});

/** POST — grade one answer. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = answerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const service = createServiceClient();
  const { data: question } = await service
    .from("question_bank")
    .select("type, answer")
    .eq("id", parsed.data.questionId)
    .eq("quiz_id", QUIZ_ID)
    .maybeSingle();

  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let correct = false;
  let note: string | undefined;
  if (parsed.data.answer !== null) {
    if (question.type === "mc") {
      correct = gradeMc(question.answer as McAnswer, parsed.data.answer);
    } else if (question.type === "tfq") {
      const answer = question.answer as TfqAnswer;
      correct = gradeTfq(answer, parsed.data.answer);
      note = answer.note;
    }
  } else if (question.type === "tfq") {
    note = (question.answer as TfqAnswer).note;
  }

  return NextResponse.json({ correct, note: note ?? null });
}
