// SM-2 variant (CLAUDE.md §10, build-plan §12). Pure and unit-tested —
// never touched casually.

export type ReviewGrade = "again" | "hard" | "good" | "easy";
export type ReviewMode = "read" | "first_letter" | "cloze" | "typed";
export type CardState = "new" | "learning" | "learned" | "mature";
export type CardType = "scripture" | "term" | "argument";

export type SrsState = {
  ease: number; // 1.5–2.5, start 2.3
  interval_days: number;
  due_at: string; // ISO timestamp
  mode: ReviewMode;
  state: CardState;
  streak: number;
};

export const EASE_MIN = 1.5;
export const EASE_MAX = 2.5;
export const EASE_START = 2.3;
export const SNAP_INTERVALS = [1, 3, 7, 14, 30, 90];

const MODE_LADDER: ReviewMode[] = ["read", "first_letter", "cloze", "typed"];

/** Snap to the nearest canonical interval until past 90 days. */
export function snapInterval(raw: number): number {
  if (raw > 90) return Math.round(raw);
  let nearest = SNAP_INTERVALS[0];
  for (const s of SNAP_INTERVALS) {
    if (Math.abs(s - raw) < Math.abs(nearest - raw)) nearest = s;
  }
  return nearest;
}

function stateFor(intervalDays: number): CardState {
  if (intervalDays >= 30) return "mature";
  if (intervalDays >= 14) return "learned";
  return "learning";
}

function regressMode(mode: ReviewMode): ReviewMode {
  const i = MODE_LADDER.indexOf(mode);
  return MODE_LADDER[Math.max(0, i - 1)];
}

function advanceMode(mode: ReviewMode): ReviewMode {
  const i = MODE_LADDER.indexOf(mode);
  return MODE_LADDER[Math.min(MODE_LADDER.length - 1, i + 1)];
}

export function gradeCard(
  prev: SrsState,
  grade: ReviewGrade,
  cardType: CardType,
  now: Date = new Date(),
): SrsState {
  let ease = prev.ease;
  let interval: number;
  let mode = prev.mode;
  let streak = prev.streak;

  switch (grade) {
    case "again":
      interval = 1;
      ease = Math.max(EASE_MIN, ease - 0.2);
      if (cardType === "scripture") mode = regressMode(mode);
      streak = 0;
      break;
    case "hard":
      interval = snapInterval(prev.interval_days * 1.2);
      ease = Math.max(EASE_MIN, ease - 0.05);
      streak += 1;
      break;
    case "good":
      interval = snapInterval(prev.interval_days * ease);
      streak += 1;
      break;
    case "easy":
      interval = snapInterval(prev.interval_days * ease * 1.3);
      ease = Math.min(EASE_MAX, ease + 0.05);
      streak += 1;
      break;
  }

  // Scripture mode ladder advances once the card holds interval ≥ 7
  if (cardType === "scripture" && grade !== "again" && interval >= 7) {
    mode = advanceMode(prev.mode);
  }

  const due = new Date(now);
  due.setUTCDate(due.getUTCDate() + interval);

  return {
    ease: Number(ease.toFixed(2)),
    interval_days: interval,
    due_at: due.toISOString(),
    mode,
    state: stateFor(interval),
    streak,
  };
}

export function newSrsState(now: Date = new Date()): SrsState {
  return {
    ease: EASE_START,
    interval_days: 0,
    due_at: now.toISOString(),
    mode: "read",
    state: "new",
    streak: 0,
  };
}
