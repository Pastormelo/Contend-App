"use client";

import { RUBRIC_CATEGORIES, RUBRIC_LABELS } from "@/lib/config";
import type { Rubric } from "@/lib/ai/schemas";

export function RubricBars({ rubric }: { rubric: Rubric }) {
  return (
    <dl className="flex flex-col gap-4">
      {RUBRIC_CATEGORIES.map((key) => {
        const { score, rationale } = rubric[key];
        return (
          <div key={key}>
            <div className="flex items-baseline justify-between">
              <dt className="text-sm font-medium">{RUBRIC_LABELS[key]}</dt>
              <span className="font-display text-sm font-semibold tabular-nums">
                {score}/5
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-accent transition-all duration-200 ease-out"
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>
            <dd className="mt-1.5 text-xs leading-relaxed text-muted-fg">
              {rationale}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
