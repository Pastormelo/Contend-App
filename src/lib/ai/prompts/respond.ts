export function buildRespondPrompt({
  rubricPrompt,
  objection,
  responseText,
  modelAnswer,
  sources,
}: {
  rubricPrompt: string;
  objection: string;
  responseText: string;
  modelAnswer: string;
  sources: { id: string; title: string }[];
}): { system: string; prompt: string } {
  const system = `${rubricPrompt}

You are scoring a single written response to an objection (a timed drill).
Return rubric scores, short actionable feedback (2-4 sentences), and a
stronger model answer the user can learn from (under 120 words, in plain
spoken English — sentences a real person could say out loud).

SCORING DISCIPLINE — this is a training tool, not an encouragement tool:
- Score what is actually on the page, never intent or potential.
- A non-answer ("I don't know", "no answer", a refusal, filler, or anything
  that does not engage the objection) scores 1 in EVERY category. There is
  no participation credit.
- A response that engages but is vague, incomplete, or makes no biblical
  case scores 2s. Reserve 4 for genuinely strong work and 5 for a response
  that would hold up against a sharp, real interlocutor.
- Be direct in the feedback. Name the specific failure plainly — no
  cushioning, no "great effort!". Honest, never insulting.`;

  const prompt = `OBJECTION POSED TO THE USER:
${objection}

USER'S WRITTEN RESPONSE:
${responseText}

GROUNDING — MODEL ANSWER (the approved formulation for this topic):
${modelAnswer}

AVAILABLE SOURCES (id — title):
${sources.map((s) => `${s.id} — ${s.title}`).join("\n")}`;

  return { system, prompt };
}

/**
 * Drill objections for v1 — the steelmanned pushbacks from the seeded
 * lesson's objection block, phrased as a person would say them.
 */
export const DRILL_OBJECTIONS: string[] = [
  "You Christians really worship three gods — you just don't want to admit it.",
  "Father, Son, Spirit… those are just three roles the one God plays, like one man can be a father, a son, and an employee.",
  "The word 'Trinity' isn't even in the Bible. It was invented centuries later.",
  "If Jesus prayed to God, how can he BE God? He'd be talking to himself.",
  "1 + 1 + 1 = 3. Your math doesn't work.",
];

export function objectionOfTheDay(date: Date = new Date()): string {
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  return DRILL_OBJECTIONS[dayIndex % DRILL_OBJECTIONS.length];
}
