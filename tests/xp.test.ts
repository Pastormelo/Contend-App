import { describe, expect, it } from "vitest";
import { scaleXp, updateStreak } from "@/lib/xp";

describe("updateStreak", () => {
  it("starts a streak on first activity", () => {
    const next = updateStreak(
      { current: 0, longest: 0, grace_days: 0, last_active: null },
      "2026-06-11",
    );
    expect(next.current).toBe(1);
    expect(next.longest).toBe(1);
    expect(next.last_active).toBe("2026-06-11");
  });

  it("increments when active yesterday", () => {
    const next = updateStreak(
      { current: 3, longest: 5, grace_days: 0, last_active: "2026-06-10" },
      "2026-06-11",
    );
    expect(next.current).toBe(4);
    expect(next.longest).toBe(5);
  });

  it("is idempotent within the same day", () => {
    const state = { current: 4, longest: 5, grace_days: 0, last_active: "2026-06-11" };
    expect(updateStreak(state, "2026-06-11")).toEqual(state);
  });

  it("resets after a missed day and tracks longest", () => {
    const next = updateStreak(
      { current: 9, longest: 9, grace_days: 0, last_active: "2026-06-08" },
      "2026-06-11",
    );
    expect(next.current).toBe(1);
    expect(next.longest).toBe(9);
  });
});

describe("scaleXp", () => {
  it("maps rubric 1→min and 5→max linearly", () => {
    expect(scaleXp(20, 100, 1)).toBe(20);
    expect(scaleXp(20, 100, 5)).toBe(100);
    expect(scaleXp(20, 100, 3)).toBe(60);
    expect(scaleXp(50, 250, 4)).toBe(200);
  });

  it("clamps out-of-range averages", () => {
    expect(scaleXp(20, 100, 0)).toBe(20);
    expect(scaleXp(20, 100, 9)).toBe(100);
  });
});
