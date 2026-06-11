// Pure server-side grading (CLAUDE.md §9, build-plan §11).
// Answers never ship to the client; this module runs only in route handlers.

export type McAnswer = { correct: number };
export type TfqAnswer = { correct: string; note?: string };
export type ClozeAnswer = { accepted: string[] };

export type Question = {
  id: string;
  type: "mc" | "tfq" | "cloze";
  answer: McAnswer | TfqAnswer | ClozeAnswer;
  source_block_id: string | null;
};

export type QuestionResult = {
  questionId: string;
  correct: boolean;
  note?: string;
  sourceBlockId: string | null;
};

/** Case/punctuation-insensitive normalization for cloze grading. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function gradeMc(answer: McAnswer, response: unknown): boolean {
  return typeof response === "number" && response === answer.correct;
}

export function gradeTfq(answer: TfqAnswer, response: unknown): boolean {
  return typeof response === "string" && response === answer.correct;
}

export function gradeCloze(answer: ClozeAnswer, response: unknown): boolean {
  if (typeof response !== "string") return false;
  const normalized = normalize(response);
  return answer.accepted.some((a) => normalize(a) === normalized);
}

export function gradeQuestion(q: Question, response: unknown): QuestionResult {
  let correct = false;
  let note: string | undefined;
  switch (q.type) {
    case "mc":
      correct = gradeMc(q.answer as McAnswer, response);
      break;
    case "tfq": {
      const a = q.answer as TfqAnswer;
      correct = gradeTfq(a, response);
      note = a.note;
      break;
    }
    case "cloze":
      correct = gradeCloze(q.answer as ClozeAnswer, response);
      break;
  }
  return { questionId: q.id, correct, note, sourceBlockId: q.source_block_id };
}

export function gradeQuiz(
  questions: Question[],
  responses: Map<string, unknown>,
): { score: number; results: QuestionResult[] } {
  const results = questions.map((q) =>
    gradeQuestion(q, responses.get(q.id)),
  );
  const score =
    questions.length === 0
      ? 0
      : results.filter((r) => r.correct).length / questions.length;
  return { score, results };
}
