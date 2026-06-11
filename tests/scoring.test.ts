import { describe, expect, it } from "vitest";
import {
  gradeCloze,
  gradeMc,
  gradeQuiz,
  gradeTfq,
  normalize,
  type Question,
} from "@/lib/scoring";

describe("normalize", () => {
  it("lowercases, strips punctuation and collapses whitespace", () => {
    expect(normalize("  Sense!  ")).toBe("sense");
    expect(normalize("RE-SPECT,")).toBe("respect");
    expect(normalize("two   words")).toBe("two words");
  });
});

describe("gradeMc", () => {
  it("matches the correct index only", () => {
    expect(gradeMc({ correct: 1 }, 1)).toBe(true);
    expect(gradeMc({ correct: 1 }, 0)).toBe(false);
    expect(gradeMc({ correct: 1 }, "1")).toBe(false);
  });
});

describe("gradeTfq", () => {
  it("requires the exact option, including needs_qualification", () => {
    const a = { correct: "needs_qualification", note: "Precision matters." };
    expect(gradeTfq(a, "needs_qualification")).toBe(true);
    expect(gradeTfq(a, "true")).toBe(false);
  });
});

describe("gradeCloze", () => {
  const answer = { accepted: ["sense", "respect"] };
  it("accepts any normalized accepted alternate", () => {
    expect(gradeCloze(answer, "Sense")).toBe(true);
    expect(gradeCloze(answer, " respect. ")).toBe(true);
    expect(gradeCloze(answer, "way")).toBe(false);
    expect(gradeCloze(answer, 3)).toBe(false);
  });
});

describe("gradeQuiz", () => {
  const questions: Question[] = [
    { id: "q1", type: "mc", answer: { correct: 1 }, source_block_id: "b2" },
    { id: "q2", type: "tfq", answer: { correct: "false", note: "modalism" }, source_block_id: "b14" },
    { id: "q3", type: "cloze", answer: { accepted: ["sense"] }, source_block_id: "b13" },
    { id: "q4", type: "mc", answer: { correct: 0 }, source_block_id: null },
  ];

  it("scores as a fraction and reports per-question results", () => {
    const responses = new Map<string, unknown>([
      ["q1", 1],
      ["q2", "true"],
      ["q3", "SENSE!"],
      ["q4", 2],
    ]);
    const { score, results } = gradeQuiz(questions, responses);
    expect(score).toBe(0.5);
    expect(results[0].correct).toBe(true);
    expect(results[1].correct).toBe(false);
    expect(results[1].note).toBe("modalism");
    expect(results[1].sourceBlockId).toBe("b14");
    expect(results[2].correct).toBe(true);
    expect(results[3].correct).toBe(false);
  });

  it("treats missing responses as wrong", () => {
    const { score } = gradeQuiz(questions, new Map());
    expect(score).toBe(0);
  });
});
