import { z } from "zod";

const categorySchema = z.object({
  score: z.number().min(1).max(5),
  rationale: z.string(),
});

export const RubricSchema = z.object({
  biblical_accuracy: categorySchema,
  logic_structure: categorySchema,
  steelman_integrity: categorySchema,
  persuasive_clarity: categorySchema,
  tone_in_context: categorySchema,
});

export type Rubric = z.infer<typeof RubricSchema>;

export const RespondScoreSchema = z.object({
  rubric: RubricSchema,
  feedback: z.string(),
  stronger_answer: z.string(),
});

export type RespondScore = z.infer<typeof RespondScoreSchema>;

export const CoachReviewSchema = z.object({
  rubric: RubricSchema,
  best_moment: z.object({ quote: z.string(), note: z.string() }),
  weak_moment: z.object({ quote: z.string(), note: z.string() }),
  missed_opportunity: z.object({ quote: z.string(), note: z.string() }),
  suggestions: z.array(
    z.object({
      point: z.string(),
      citation_source_id: z.string().nullable(),
    }),
  ),
  remediation_lesson_ids: z.array(z.string()),
});

export type CoachReview = z.infer<typeof CoachReviewSchema>;

export function rubricAverage(rubric: Rubric): number {
  const scores = Object.values(rubric).map((c) => c.score);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
