// Behavior constants — content and tunable thresholds live in the database
// (docs/build-plan.md §16: behavior is code; content is rows).

export const MODELS = {
  /** Opponent persona turns — fast, cheap, in-character */
  opponent: "claude-haiku-4-5",
  /** Coach critique + rubric scoring — quality matters */
  coach: "claude-sonnet-4-6",
} as const;

export const AI_TEMPERATURE = {
  scoring: 0.2,
  persona: 0.8,
} as const;

export const XP = {
  lessonComplete: 50,
  checkpointPass: 25,
  queueComplete: 15,
  respondMin: 0,
  respondMax: 100,
  gameComplete: 15,
  simulationMin: 0,
  simulationMax: 250,
} as const;

export const QUIZ_PASS_THRESHOLD = 0.7;
export const REVIEW_QUEUE_CAP = 30;

export const ESV_TRANSLATION = "ESV";

/** Approximate cost per million tokens (USD) for usage_log estimates */
export const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5": { input: 1, output: 5 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
};

export const RUBRIC_CATEGORIES = [
  "biblical_accuracy",
  "logic_structure",
  "steelman_integrity",
  "persuasive_clarity",
  "tone_in_context",
] as const;

export const RUBRIC_LABELS: Record<(typeof RUBRIC_CATEGORIES)[number], string> = {
  biblical_accuracy: "Biblical accuracy",
  logic_structure: "Logic & structure",
  steelman_integrity: "Steelman integrity",
  persuasive_clarity: "Persuasive clarity",
  tone_in_context: "Tone in context",
};
