export function buildCoachPrompt({
  rubricPrompt,
  scenario,
  transcript,
  modelAnswer,
  sources,
  retryNote,
}: {
  rubricPrompt: string;
  scenario: string;
  transcript: { role: string; content: string }[];
  modelAnswer: string;
  sources: { id: string; title: string }[];
  retryNote?: string;
}): { system: string; prompt: string } {
  const system = `${rubricPrompt}

You are reviewing a full sparring transcript. The USER is the Christian
being trained; the OPPONENT is a simulated interlocutor. Evaluate ONLY the
user's performance.

For best_moment, weak_moment, and missed_opportunity: the "quote" field
must be an EXACT, verbatim quote of something the USER actually wrote in
the transcript — copy it character for character. Keep each note to 1-2
sentences.

For remediation_lesson_ids, include only IDs from the provided lesson list,
or leave the array empty.

SCORING DISCIPLINE — this is a training tool, not an encouragement tool:
score only what the user actually said. If the user dodged, gave
non-answers, or contributed almost nothing, score 1s — no participation
credit. Reserve 4-5 for performances that would hold up against a sharp,
real interlocutor. Be direct in every note: name the failure plainly,
honest but never insulting.${retryNote ? `\n\nIMPORTANT: ${retryNote}` : ""}`;

  const lines = transcript
    .map((m) => `${m.role === "user" ? "USER" : "OPPONENT"}: ${m.content}`)
    .join("\n\n");

  const prompt = `SCENARIO:
${scenario}

TRANSCRIPT:
${lines}

GROUNDING — MODEL ANSWER (the approved formulation for this topic):
${modelAnswer}

AVAILABLE SOURCES (id — title):
${sources.map((s) => `${s.id} — ${s.title}`).join("\n")}

AVAILABLE LESSONS (id — title):
40000000-0000-0000-0000-000000000001 — The Trinity: One God, Three Persons`;

  return { system, prompt };
}
