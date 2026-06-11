"use client";

import type { ReviewGrade } from "@/lib/srs";
import { cn } from "@/lib/utils";

const GRADES: { grade: ReviewGrade; label: string; hint: string }[] = [
  { grade: "again", label: "Again", hint: "1d" },
  { grade: "hard", label: "Hard", hint: "×1.2" },
  { grade: "good", label: "Good", hint: "×ease" },
  { grade: "easy", label: "Easy", hint: "×1.3" },
];

export function GradeBar({
  onGrade,
  disabled,
}: {
  onGrade: (g: ReviewGrade) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {GRADES.map(({ grade, label, hint }) => (
        <button
          key={grade}
          type="button"
          disabled={disabled}
          onClick={() => onGrade(grade)}
          className={cn(
            "flex flex-col items-center rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-50",
            grade === "again"
              ? "border-accent/50 text-accent hover:bg-accent/10"
              : "border-line-strong hover:bg-foreground/5",
          )}
        >
          {label}
          <span className="text-[0.65rem] font-normal text-muted-fg">{hint}</span>
        </button>
      ))}
    </div>
  );
}
