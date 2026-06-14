import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  QUESTIONS,
  gradeAssessment,
  sanitizedQuestions,
} from "@/lib/assessment";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ questions: sanitizedQuestions() });
}

const bodySchema = z.object({
  answers: z.record(z.string(), z.number().int().min(0).max(9)),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Only keep answers for known question ids
  const known = new Set(QUESTIONS.map((q) => q.id));
  const answers: Record<string, number> = {};
  for (const [id, idx] of Object.entries(parsed.data.answers)) {
    if (known.has(id)) answers[id] = idx;
  }

  const result = gradeAssessment(answers);

  const service = createServiceClient();
  await service.from("intake_attempts").insert({
    user_id: user.id,
    answers,
    placements: {
      startNow: result.startNow.slug,
      focus: result.focus.slug,
      tier: result.tier,
      totalPct: result.totalPct,
      domains: result.domains,
    },
    rationale: result.rationale,
  });

  return NextResponse.json({ result });
}
