import { describe, expect, it } from "vitest";
import { gradeCard, newSrsState, snapInterval, type SrsState } from "@/lib/srs";

const NOW = new Date("2026-06-11T12:00:00Z");

function state(partial: Partial<SrsState>): SrsState {
  return { ...newSrsState(NOW), ...partial };
}

describe("snapInterval", () => {
  it("snaps to the canonical ladder until past 90", () => {
    expect(snapInterval(0)).toBe(1);
    expect(snapInterval(2.3)).toBe(3);
    expect(snapInterval(6.9)).toBe(7);
    expect(snapInterval(16.1)).toBe(14);
    expect(snapInterval(80)).toBe(90);
    expect(snapInterval(120.4)).toBe(120);
  });
});

describe("gradeCard — acceptance sequence", () => {
  it("good on a new card comes due in ~1 day, next good ~3", () => {
    const first = gradeCard(newSrsState(NOW), "good", "term", NOW);
    expect(first.interval_days).toBe(1);
    expect(first.due_at).toBe("2026-06-12T12:00:00.000Z");

    const second = gradeCard(first, "good", "term", NOW);
    expect(second.interval_days).toBe(3);

    const third = gradeCard(second, "good", "term", NOW);
    expect(third.interval_days).toBe(7);
  });
});

describe("gradeCard — grade effects", () => {
  it("again resets to 1 day, drops ease by 0.2 (floor 1.5), zeroes streak", () => {
    const next = gradeCard(
      state({ interval_days: 14, ease: 1.6, streak: 4, state: "learned" }),
      "again",
      "term",
      NOW,
    );
    expect(next.interval_days).toBe(1);
    expect(next.ease).toBe(1.5);
    expect(next.streak).toBe(0);
    expect(next.state).toBe("learning");
  });

  it("hard multiplies by 1.2 and drops ease 0.05", () => {
    const next = gradeCard(
      state({ interval_days: 7, ease: 2.3 }),
      "hard",
      "term",
      NOW,
    );
    expect(next.interval_days).toBe(7); // 8.4 snaps back to 7
    expect(next.ease).toBe(2.25);
  });

  it("easy multiplies by ease×1.3 and bumps ease (cap 2.5)", () => {
    const next = gradeCard(
      state({ interval_days: 7, ease: 2.5 }),
      "easy",
      "term",
      NOW,
    );
    expect(next.interval_days).toBe(30); // 22.75 → nearest 30? 22.75-14=8.75, 30-22.75=7.25 → 30
    expect(next.ease).toBe(2.5);
  });

  it("crosses state thresholds: learned at ≥14, mature at ≥30", () => {
    const learned = gradeCard(state({ interval_days: 7, ease: 2.0 }), "good", "term", NOW);
    expect(learned.interval_days).toBe(14);
    expect(learned.state).toBe("learned");

    const mature = gradeCard(learned, "good", "term", NOW);
    expect(mature.interval_days).toBe(30);
    expect(mature.state).toBe("mature");
  });
});

describe("gradeCard — scripture mode ladder", () => {
  it("advances read → first_letter when interval reaches 7", () => {
    const s = state({ interval_days: 3, mode: "read" });
    const next = gradeCard(s, "good", "scripture", NOW); // 3×2.3=6.9 → 7
    expect(next.interval_days).toBe(7);
    expect(next.mode).toBe("first_letter");
  });

  it("does not advance below interval 7", () => {
    const next = gradeCard(state({ interval_days: 1, mode: "read" }), "good", "scripture", NOW);
    expect(next.interval_days).toBe(3);
    expect(next.mode).toBe("read");
  });

  it("regresses one step on again", () => {
    const next = gradeCard(
      state({ interval_days: 14, mode: "cloze" }),
      "again",
      "scripture",
      NOW,
    );
    expect(next.mode).toBe("first_letter");
  });

  it("caps at typed and floors at read", () => {
    const top = gradeCard(state({ interval_days: 14, mode: "typed" }), "good", "scripture", NOW);
    expect(top.mode).toBe("typed");
    const bottom = gradeCard(state({ interval_days: 1, mode: "read" }), "again", "scripture", NOW);
    expect(bottom.mode).toBe("read");
  });

  it("term cards never change mode", () => {
    const next = gradeCard(state({ interval_days: 14, mode: "read" }), "good", "term", NOW);
    expect(next.mode).toBe("read");
  });
});
