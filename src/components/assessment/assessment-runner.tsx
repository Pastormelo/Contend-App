"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  domain: string;
  prompt: string;
  options: string[];
};

type Result = {
  tier: string;
  tierBlurb: string;
  totalPct: number;
  domains: { domain: string; label: string; pct: number }[];
  startNow: { slug: string; number: number; title: string };
  focus: { slug: string; number: number; title: string };
  rationale: string;
};

export function AssessmentRunner() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [phase, setPhase] = useState<"intro" | "quiz" | "scoring" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/assessment")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { questions: Question[] }) => setQuestions(d.questions))
      .catch(() => setError(true));
  }, []);

  async function submit(final: Record<string, number>) {
    setPhase("scoring");
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: final }),
      });
      if (!res.ok) throw new Error();
      const d = (await res.json()) as { result: Result };
      setResult(d.result);
      setPhase("result");
    } catch {
      setError(true);
    }
  }

  function choose(qid: string, optIndex: number) {
    const next = { ...answers, [qid]: optIndex };
    setAnswers(next);
    if (questions && index + 1 >= questions.length) {
      submit(next);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (error) {
    return <p className="text-center text-sm text-accent">Something went wrong loading the assessment. Refresh to try again.</p>;
  }
  if (!questions) {
    return <p className="text-center text-sm text-muted-fg">Preparing your assessment…</p>;
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="w-full rounded-card border border-line-soft bg-surface p-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Placement assessment
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-fg">
            {questions.length} questions across five areas — the existence of
            God, the reliability of Scripture, the Trinity, the deity of
            Christ, and engaging other worldviews. Some are easy; some are
            genuinely hard. Answer honestly — there&apos;s no penalty for not
            knowing, and the point is an accurate read on where you should
            start.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-fg">
            It takes about five minutes. At the end you&apos;ll get a tier, a
            breakdown by area, and a recommended starting point on the path.
          </p>
        </div>
        <Button size="lg" onClick={() => setPhase("quiz")}>
          Begin the assessment
        </Button>
      </div>
    );
  }

  if (phase === "scoring") {
    return <p className="text-center text-sm text-muted-fg">Scoring your answers…</p>;
  }

  if (phase === "result" && result) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Your placement
          </p>
          <p className="mt-3 font-display text-4xl font-semibold tracking-tight">
            {result.tier}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-fg">
            {result.tierBlurb}
          </p>
        </div>

        <div className="rounded-card border border-line-soft bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-fg">
            How you scored
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {result.domains.map((d) => (
              <div key={d.domain}>
                <div className="flex items-center justify-between text-sm">
                  <span>{d.label}</span>
                  <span className="tabular-nums text-muted-fg">{Math.round(d.pct * 100)}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-line-soft">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      d.pct >= 0.7 ? "bg-gold" : d.pct >= 0.4 ? "bg-accent" : "bg-accent/60",
                    )}
                    style={{ width: `${Math.max(4, d.pct * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-accent/30 bg-accent/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Where to start
          </p>
          <p className="mt-3 text-sm leading-relaxed">{result.rationale}</p>
          <Link href={`/tracks/${result.startNow.slug}`} className="mt-5 inline-block">
            <Button size="lg">
              Start Course {String(result.startNow.number).padStart(2, "0")}: {result.startNow.title}
            </Button>
          </Link>
        </div>

        <Link href="/tracks" className="self-center text-sm font-medium text-muted-fg hover:text-foreground">
          See the whole path →
        </Link>
      </div>
    );
  }

  // quiz
  const q = questions[index];
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="h-1.5 overflow-hidden rounded-full bg-line-soft">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-fg">
        Question {index + 1} of {questions.length}
      </p>
      <div key={q.id} className="animate-pop">
        <p className="text-lg font-medium leading-relaxed">{q.prompt}</p>
        <div className="mt-5 flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => choose(q.id, i)}
              className="rounded-lg border border-line-strong px-4 py-3 text-left text-sm font-medium transition-all duration-150 hover:border-accent/50 hover:bg-foreground/5 active:scale-[0.99]"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => choose(q.id, -1)}
        className="self-center text-xs font-medium text-muted-fg underline-offset-2 hover:text-foreground hover:underline"
      >
        I&apos;m not sure — skip
      </button>
    </div>
  );
}
