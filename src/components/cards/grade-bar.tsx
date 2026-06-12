"use client";

import type { ReviewGrade } from "@/lib/srs";
import { cn } from "@/lib/utils";

const GRADES: { grade: ReviewGrade; label: string; hint: string }[] = [
  { grade: "again", label: "Again", hint: "Didn't know it" },
  { grade: "hard", label: "Hard", hint: "Barely got it" },
  { grade: "good", label: "Good", hint: "Knew it" },
  { grade: "easy", label: "Easy", hint: "Knew it cold" },
];

export function GradeBar({
  onGrade,
  disabled,
}: {
  onGrade: (g: ReviewGrade) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-xs text-muted-fg">
        How well did you know it? Be honest — your answer decides when this
        card comes back.
      </p>
      <div className="grid grid-cols-4 gap-2">
        {GRADES.map(({ grade, label, hint }) => (
          <button
            key={grade}
            type="button"
            disabled={disabled}
            onClick={() => onGrade(grade)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-50",
              grade === "again"
                ? "border-accent/50 text-accent hover:bg-accent/10"
                : "border-line-strong hover:bg-foreground/5",
            )}
          >
            {label}
            <span className="text-[0.65rem] font-normal leading-tight text-muted-fg">
              {hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
