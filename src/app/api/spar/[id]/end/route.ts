import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateStructured } from "@/lib/ai/client";
import { CoachReviewSchema, rubricAverage, type CoachReview } from "@/lib/ai/schemas";
import { buildCoachPrompt } from "@/lib/ai/prompts/coach";
import { awardXp, scaleXp } from "@/lib/xp";
import { AI_TEMPERATURE, MODELS, XP } from "@/lib/config";

const MODEL_ANSWER_BLOCK_ID = "50000000-0000-0000-0000-000000000016";
const LESSON_ID = "40000000-0000-0000-0000-000000000001";

/** End the spar: Sonnet coach critique → simulation_reviews. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: simulationId } = await params;
  if (!z.string().uuid().safeParse(simulationId).success) {
    return NextResponse.json({ error: "Invalid simulation" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const { data: simulation } = await service
    .from("simulations")
    .select("id, status, personas(scenario_card, difficulty)")
    .eq("id", simulationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!simulation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Idempotent: if the review already exists, we're done
  const { data: existingReview } = await service
    .from("simulation_reviews")
    .select("id")
    .eq("simulation_id", simulationId)
    .maybeSingle();
  if (existingReview) return NextResponse.json({ ok: true });

  const [{ data: messages }, { data: rubricRow }, { data: modelAnswerBlock }, { data: sources }] =
    await Promise.all([
      service
        .from("simulation_messages")
        .select("role, content")
        .eq("simulation_id", simulationId)
        .order("ts", { ascending: true }),
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

  if (!messages || messages.length < 2 || !rubricRow) {
    return NextResponse.json(
      { error: "Not enough conversation to review" },
      { status: 400 },
    );
  }

  const persona = simulation.personas as unknown as {
    scenario_card: string;
    difficulty: string;
  };
  const modelAnswerContent = (modelAnswerBlock?.content ?? {}) as {
    points?: string[];
    notes?: string;
  };
  const modelAnswer = [
    ...(modelAnswerContent.points ?? []),
    modelAnswerContent.notes ?? "",
  ].join("\n");

  const validSourceIds = new Set((sources ?? []).map((s) => s.id));

  async function runCoach(retryNote?: string): Promise<CoachReview> {
    const { system, prompt } = buildCoachPrompt({
      rubricPrompt: rubricRow!.prompt_text,
      scenario: persona.scenario_card,
      transcript: messages!,
      modelAnswer,
      sources: sources ?? [],
      retryNote,
    });
    return generateStructured(service, {
      userId: user!.id,
      feature: "spar_coach",
      model: MODELS.coach,
      system,
      prompt,
      schema: CoachReviewSchema,
      temperature: AI_TEMPERATURE.scoring,
    });
  }

  let review: CoachReview;
  let flagged = false;
  try {
    review = await runCoach();

    // Citation-or-silence: invalid source id → retry once → null + flag
    const hasInvalidCitation = (r: CoachReview) =>
      r.suggestions.some(
        (s) => s.citation_source_id !== null && !validSourceIds.has(s.citation_source_id),
      );

    if (hasInvalidCitation(review)) {
      review = await runCoach(
        "Your previous review cited a source id that does not exist. Cite ONLY ids from the provided source list, or set citation_source_id to null.",
      );
      if (hasInvalidCitation(review)) {
        flagged = true;
        review.suggestions = review.suggestions.map((s) => ({
          ...s,
          citation_source_id:
            s.citation_source_id && validSourceIds.has(s.citation_source_id)
              ? s.citation_source_id
              : null,
        }));
      }
    }
  } catch {
    return NextResponse.json({ error: "Coach unavailable" }, { status: 502 });
  }

  // Soft audit: quoted moments must actually appear in the transcript
  const transcriptText = messages.map((m) => m.content).join("\n");
  for (const moment of [review.best_moment, review.weak_moment, review.missed_opportunity]) {
    if (moment.quote && !transcriptText.includes(moment.quote)) flagged = true;
  }

  // Keep only known lesson ids
  review.remediation_lesson_ids = review.remediation_lesson_ids.filter(
    (id) => id === LESSON_ID,
  );

  await service.from("simulation_reviews").insert({
    simulation_id: simulationId,
    rubric_scores: review.rubric,
    best_moment: review.best_moment,
    weak_moment: review.weak_moment,
    missed_opportunity: review.missed_opportunity,
    suggestions: review.suggestions,
    remediation_lesson_ids: review.remediation_lesson_ids,
    flagged,
  });

  await service
    .from("simulations")
    .update({ status: "reviewed", ended_at: new Date().toISOString() })
    .eq("id", simulationId);

  const xpAwarded = scaleXp(
    XP.simulationMin,
    XP.simulationMax,
    rubricAverage(review.rubric),
  );
  await awardXp(service, user.id, xpAwarded, "simulation_complete", simulationId);

  return NextResponse.json({ ok: true, xpAwarded });
}
