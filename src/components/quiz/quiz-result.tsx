"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AttemptResult = {
  score: number;
  passed: boolean;
  xpAwarded: number;
  lessonId: string | null;
  results: {
    questionId: string;
    correct: boolean;
    note: string | null;
    sourceBlockId: string | null;
  }[];
};

export function QuizResult({
  result,
  prompts,
  onRetry,
}: {
  result: AttemptResult;
  prompts: Map<string, string>;
  onRetry: () => void;
}) {
  const pct = Math.round(result.score * 100);
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p
          className={cn(
            "font-display text-6xl font-semibold",
            result.passed ? "text-accent" : "text-muted-fg",
          )}
        >
          {pct}%
        </p>
        <p className="mt-2 text-sm text-muted-fg">
          {result.passed
            ? "Checkpoint passed. The case is becoming yours."
            : "Below 70% — review the lesson and try again. Unlimited retries."}
        </p>
        {result.xpAwarded > 0 && (
          <p className="mt-3 inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent">
            +{result.xpAwarded} XP
          </p>
        )}
      </div>

      <ol className="flex flex-col gap-3">
        {result.results.map((r, i) => (
          <li
            key={r.questionId}
            className={cn(
              "rounded-card border p-4 text-sm",
              r.correct ? "border-line-soft" : "border-accent/40 bg-accent/5",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                  r.correct ? "bg-foreground/30" : "bg-accent",
                )}
              >
                {r.correct ? "✓" : "✗"}
              </span>
              <div className="flex-1">
                <p className="font-medium">
                  {i + 1}. {prompts.get(r.questionId)}
                </p>
                {!r.correct && r.note && (
                  <p className="mt-1.5 leading-relaxed text-muted-fg">{r.note}</p>
                )}
                {!r.correct && r.sourceBlockId && result.lessonId && (
                  <Link
                    href={`/learn/${result.lessonId}#block-${r.sourceBlockId}`}
                    className="mt-2 inline-block text-xs font-medium text-accent hover:text-accent-deep"
                  >
                    Review this →
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {!result.passed && (
          <Button onClick={onRetry} variant="outline">
            Try again
          </Button>
        )}
        <Link href={result.passed ? "/review" : `/learn/${result.lessonId}`}>
          <Button className="w-full">
            {result.passed ? "Start your review queue" : "Back to the lesson"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
