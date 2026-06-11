"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MCQuestion } from "@/components/quiz/mc-question";
import { TFQQuestion } from "@/components/quiz/tfq-question";
import { ClozeQuestion } from "@/components/quiz/cloze-question";
import { QuizResult, type AttemptResult } from "@/components/quiz/quiz-result";
import { cn } from "@/lib/utils";

export type ClientQuestion = {
  id: string;
  type: "mc" | "tfq" | "cloze";
  prompt: string;
  options: string[] | null;
};

export function QuizRunner({
  quizId,
  questions,
}: {
  quizId: string;
  questions: ClientQuestion[];
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number | string>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState(false);

  const question = questions[index];
  const value = answers.get(question?.id ?? "") ?? null;
  const answered = value !== null && value !== "";
  const isLast = index === questions.length - 1;

  function setAnswer(v: number | string) {
    setAnswers(new Map(answers).set(question.id, v));
  }

  async function submit() {
    setSubmitting(true);
    setError(false);
    const res = await fetch(`/api/quiz/${quizId}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: [...answers.entries()].map(([questionId, value]) => ({
          questionId,
          value,
        })),
      }),
    });
    if (!res.ok) {
      setError(true);
      setSubmitting(false);
      return;
    }
    setResult(await res.json());
    setSubmitting(false);
  }

  if (result) {
    return (
      <QuizResult
        result={result}
        prompts={new Map(questions.map((q) => [q.id, q.prompt]))}
        onRetry={() => {
          setResult(null);
          setAnswers(new Map());
          setIndex(0);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center gap-1.5">
        {questions.map((q, i) => (
          <span
            key={q.id}
            className={cn(
              "h-1.5 w-6 rounded-full transition-colors duration-150",
              i === index
                ? "bg-accent"
                : answers.has(q.id)
                  ? "bg-accent/40"
                  : "bg-foreground/15",
            )}
          />
        ))}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-fg">
          Question {index + 1} of {questions.length}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold leading-snug">
          {question.prompt}
        </h2>
      </div>

      {question.type === "mc" && (
        <MCQuestion
          options={question.options ?? []}
          value={typeof value === "number" ? value : null}
          onChange={setAnswer}
        />
      )}
      {question.type === "tfq" && (
        <TFQQuestion
          options={question.options ?? []}
          value={typeof value === "string" ? value : null}
          onChange={setAnswer}
        />
      )}
      {question.type === "cloze" && (
        <ClozeQuestion
          value={typeof value === "string" ? value : ""}
          onChange={setAnswer}
        />
      )}

      {error && (
        <p className="text-sm text-accent">Submission failed — try again.</p>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setIndex(index - 1)}
          disabled={index === 0}
        >
          Back
        </Button>
        {isLast ? (
          <Button
            onClick={submit}
            disabled={submitting || answers.size < questions.length}
          >
            {submitting ? "Grading…" : "Submit all"}
          </Button>
        ) : (
          <Button onClick={() => setIndex(index + 1)} disabled={!answered}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
