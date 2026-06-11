"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RubricBars } from "@/components/spar/rubric-bars";
import type { Rubric } from "@/lib/ai/schemas";

const DRILL_SECONDS = 90;

type ScoreResponse = {
  rubric: Rubric;
  feedback: string;
  strongerAnswer: string;
  xpAwarded: number;
};

export function ObjectionCard({ objection }: { objection: string }) {
  return (
    <div className="rounded-card border border-line-strong bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg">
        Someone says:
      </p>
      <p className="mt-3 font-display text-xl font-semibold leading-snug">
        “{objection}”
      </p>
    </div>
  );
}

export function ResponseTimer({
  running,
  onExpire,
}: {
  running: boolean;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(DRILL_SECONDS);
  const expired = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1 && !expired.current) {
          expired.current = true;
          clearInterval(id);
          onExpire();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onExpire]);

  return (
    <div className="flex items-center gap-3">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear"
          style={{ width: `${(remaining / DRILL_SECONDS) * 100}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-fg">{remaining}s</span>
    </div>
  );
}

export function RubricResultPanel({ result }: { result: ScoreResponse }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="font-display text-2xl font-semibold">Scored.</p>
        <p className="mt-2 inline-block rounded-full bg-accent/15 px-4 py-1 text-sm font-semibold text-accent">
          +{result.xpAwarded} XP
        </p>
      </div>
      <RubricBars rubric={result.rubric} />
      <div className="rounded-card border border-line-soft bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg">
          Coach feedback
        </p>
        <p className="mt-2 text-sm leading-relaxed">{result.feedback}</p>
      </div>
      <div className="rounded-card border border-gold/40 bg-gold/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          A stronger answer
        </p>
        <p className="mt-2 text-sm leading-relaxed">{result.strongerAnswer}</p>
      </div>
      <Button onClick={() => window.location.reload()} variant="outline">
        Drill again
      </Button>
    </div>
  );
}

export function RespondDrill({ objection }: { objection: string }) {
  const [text, setText] = useState("");
  const [timerOn, setTimerOn] = useState(true);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (text.trim().length < 20) {
      setError("Give it a real answer — at least a few sentences.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/respond/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objection, responseText: text }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Scoring failed — try again.");
      return;
    }
    setResult(await res.json());
  }

  if (result) return <RubricResultPanel result={result} />;

  return (
    <div className="flex flex-col gap-6">
      <ObjectionCard objection={objection} />

      <label className="flex items-center gap-2 text-xs text-muted-fg">
        <input
          type="checkbox"
          checked={timerOn}
          onChange={(e) => setTimerOn(e.target.checked)}
          disabled={started}
          className="accent-[#7a2e2e]"
        />
        90-second pressure timer
      </label>

      {started && timerOn && (
        <ResponseTimer running={!submitting && !result} onExpire={submit} />
      )}

      <Textarea
        rows={7}
        placeholder="You have one shot. Answer like they're standing in front of you…"
        value={text}
        onChange={(e) => {
          if (!started) setStarted(true);
          setText(e.target.value);
        }}
        onFocus={() => setStarted(true)}
      />

      {error && <p className="text-sm text-accent">{error}</p>}

      <Button size="lg" onClick={submit} disabled={submitting}>
        {submitting ? "Coach is scoring…" : "Submit response"}
      </Button>
    </div>
  );
}
