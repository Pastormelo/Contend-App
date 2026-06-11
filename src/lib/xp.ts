import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type StreakState = {
  current: number;
  longest: number;
  grace_days: number;
  last_active: string | null; // ISO date (YYYY-MM-DD)
};

/**
 * Pure streak math (unit-tested). Any XP event today marks the day.
 * Grace days are stubbed to 0 for v1 (build-plan §13 banking comes later).
 */
export function updateStreak(prev: StreakState, today: string): StreakState {
  if (prev.last_active === today) return prev;

  const yesterday = (() => {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  })();

  const current = prev.last_active === yesterday ? prev.current + 1 : 1;
  return {
    current,
    longest: Math.max(prev.longest, current),
    grace_days: prev.grace_days,
    last_active: today,
  };
}

/** Scale a 1–5 rubric average onto an XP range (used by respond + spar). */
export function scaleXp(min: number, max: number, rubricAvg: number): number {
  const clamped = Math.min(5, Math.max(1, rubricAvg));
  return Math.round(min + ((clamped - 1) / 4) * (max - min));
}

/**
 * The single XP choke-point: append to the ledger and credit the streak.
 * Always called with the service client from server routes.
 */
export async function awardXp(
  supabase: SupabaseClient<Database>,
  userId: string,
  amount: number,
  reason: string,
  refId?: string | null,
): Promise<void> {
  await supabase.from("xp_events").insert({
    user_id: userId,
    amount,
    reason,
    ref_id: refId ?? null,
  });

  const today = new Date().toISOString().slice(0, 10);
  const { data: streak } = await supabase
    .from("streaks")
    .select("current, longest, grace_days, last_active")
    .eq("user_id", userId)
    .maybeSingle();

  const next = updateStreak(
    streak ?? { current: 0, longest: 0, grace_days: 0, last_active: null },
    today,
  );

  await supabase.from("streaks").upsert({
    user_id: userId,
    current: next.current,
    longest: next.longest,
    grace_days: next.grace_days,
    last_active: next.last_active,
  });
}

/** Total XP from the append-only ledger. */
export async function totalXp(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<number> {
  const { data } = await supabase
    .from("xp_events")
    .select("amount")
    .eq("user_id", userId);
  return (data ?? []).reduce((sum, r) => sum + r.amount, 0);
}
