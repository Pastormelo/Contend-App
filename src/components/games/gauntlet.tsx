"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GauntletQuestion = {
  id: string;
  type: "mc" | "tfq";
  prompt: string;
  options: string[];
};

const TFQ_LABELS: Record<string, string> = {
  true: "True",
  false: "False",
  needs_qualification: "Needs qualification",
};

const START_SECONDS = 20;
const MIN_SECONDS = 8;

export function Gauntlet() {
  const [questions, setQuestions] = useState<GauntletQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const [phase, setPhase] = useState<"intro" | "play" | "feedback" | "over" | "won">("intro");
  const [lastResult, setLastResult] = useState<{ correct: boolean; note: string | null } | null>(null);
  const [picked, setPicked] = useState<number | string | null>(null);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/games/gauntlet")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { questions: GauntletQuestion[] }) => setQuestions(d.questions))
      .catch(() => setError(true));
  }, []);

  const roundSeconds = Math.max(MIN_SECONDS, START_SECONDS - index * 2);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const submit = useCallback(
    async (q: GauntletQuestion, answer: number | string | null) => {
      stopTimer();
      setPicked(answer);
      setPhase("feedback");
      try {
        const res = await fetch("/api/games/gauntlet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: q.id, answer }),
        });
        if (!res.ok) throw new Error();
        const result = (await res.json()) as { correct: boolean; note: string | null };
        setLastResult(result);
        if (result.correct) {
          const nextStreak = streak + 1;
          setStreak(nextStreak);
          setBest((b) => Math.max(b, nextStreak));
          setScore((s) => s + 100 * Math.min(5, nextStreak));
        } else {
          setStreak(0);
          setLives((l) => l - 1);
        }
      } catch {
        setError(true);
      }
    },
    [stopTimer, streak],
  );

  const startRound = useCallback(
    (i: number) => {
      setIndex(i);
      setPicked(null);
      setLastResult(null);
      setPhase("play");
      const total = Math.max(MIN_SECONDS, START_SECONDS - i * 2);
      setSecondsLeft(total);
      stopTimer();
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    },
    [stopTimer],
  );

  // Timeout = wrong
  useEffect(() => {
    if (phase === "play" && secondsLeft <= 0 && questions) {
      submit(questions[index], null);
    }
  }, [secondsLeft, phase, questions, index, submit]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  async function finish(won: boolean) {
    setPhase(won ? "won" : "over");
    if (won) {
      try {
        const res = await fetch("/api/games/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game: "gauntlet" }),
        });
        if (res.ok) {
          const d = (await res.json()) as { xpAwarded: number };
          setXpAwarded(d.xpAwarded);
        }
      } catch {
        /* XP is a bonus; the win screen still shows */
      }
    }
  }

  function next() {
    if (!questions) return;
    if (lives <= 0) {
      finish(false);
      return;
    }
    if (index + 1 >= questions.length) {
      finish(true);
      return;
    }
    startRound(index + 1);
  }

  if (error) {
    return <p className="text-center text-sm text-accent">Couldn&apos;t load the gauntlet. Refresh to try again.</p>;
  }
  if (!questions) {
    return <p className="text-center text-sm text-muted-fg">Sharpening the questions…</p>;
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="w-full rounded-card border border-line-soft bg-surface p-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The rules
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed">
            <li>• {questions.length} questions stand between you and the end.</li>
            <li>• You have <strong>3 lives</strong>. A wrong answer — or running out of time — costs one.</li>
            <li>• The clock starts at {START_SECONDS} seconds and gets shorter every round.</li>
            <li>• Consecutive correct answers multiply your score, up to 5×.</li>
            <li>• Survive to the end and the win pays XP (once a day).</li>
          </ul>
        </div>
        <Button size="lg" onClick={() => startRound(0)}>
          Enter the gauntlet
        </Button>
      </div>
    );
  }

  if (phase === "over" || phase === "won") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {phase === "won" ? "Gauntlet survived" : "The gauntlet wins this one"}
        </p>
        <p className="font-display text-6xl font-semibold tabular-nums">
          {score.toLocaleString()}
        </p>
        <div className="flex gap-8 text-sm text-muted-fg">
          <span>Best streak: <strong className="text-foreground">{best}</strong></span>
          <span>Round reached: <strong className="text-foreground">{index + 1}/{questions.length}</strong></span>
        </div>
        {phase === "won" && xpAwarded !== null && (
          <p className="text-sm font-medium text-gold">
            {xpAwarded > 0 ? `+${xpAwarded} XP` : "Already earned today — back tomorrow for more XP"}
          </p>
        )}
        {phase === "over" && (
          <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
            Every question you missed lives in the lesson. Re-read it, then
            come take your revenge.
          </p>
        )}
        <div className="flex gap-3">
          <Button size="lg" onClick={() => { setLives(3); setScore(0); setStreak(0); setBest(0); setXpAwarded(null); startRound(0); }}>
            Run it again
          </Button>
          <Link href="/games">
            <Button size="lg" variant="outline">All games</Button>
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const timerPct = phase === "play" ? (secondsLeft / roundSeconds) * 100 : 0;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Status bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="flex gap-1" aria-label={`${lives} lives left`}>
          {[0, 1, 2].map((i) => (
            <svg key={i} viewBox="0 0 24 24" className={cn("h-5 w-5 transition-all duration-300", i < lives ? "text-accent" : "scale-90 text-line-strong")} fill="currentColor" aria-hidden>
              <path d="M12 21S4 13.9 4 8.9C4 6.2 6.2 4 8.9 4c1.2 0 2.3.5 3.1 1.3C12.8 4.5 13.9 4 15.1 4 17.8 4 20 6.2 20 8.9c0 5-8 12.1-8 12.1Z" />
            </svg>
          ))}
        </span>
        <span className="font-medium tabular-nums text-muted-fg">
          {streak > 1 && <span className="mr-3 text-gold">{Math.min(5, streak)}× streak</span>}
          {score.toLocaleString()} pts
        </span>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-line-soft">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-linear",
            secondsLeft <= 5 ? "bg-accent" : "bg-gold",
          )}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div
        key={q.id}
        className={cn(
          "animate-pop rounded-card border border-line-soft bg-surface p-6",
          phase === "feedback" && lastResult && !lastResult.correct && "animate-shake border-accent/50",
        )}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-fg">
          Round {index + 1} of {questions.length}
        </p>
        <p className="mt-3 text-lg font-medium leading-relaxed">{q.prompt}</p>
        <div className="mt-5 flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const value = q.type === "mc" ? i : opt;
            const isPicked = picked === value;
            return (
              <button
                key={i}
                type="button"
                disabled={phase === "feedback"}
                onClick={() => submit(q, value)}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-150 active:scale-[0.99]",
                  isPicked && lastResult?.correct && "border-gold bg-gold/10 text-gold",
                  isPicked && lastResult && !lastResult.correct && "border-accent bg-accent/10 text-accent",
                  !isPicked && "border-line-strong hover:border-accent/40 hover:bg-foreground/5",
                  phase === "feedback" && !isPicked && "opacity-50",
                )}
              >
                {q.type === "tfq" ? TFQ_LABELS[opt] ?? opt : opt}
              </button>
            );
          })}
        </div>
      </div>

      {phase === "feedback" && lastResult && (
        <div className="flex flex-col items-center gap-3">
          <p className={cn("text-sm font-semibold", lastResult.correct ? "text-gold" : "text-accent")}>
            {lastResult.correct
              ? `Correct — +${100 * Math.min(5, streak)} pts`
              : picked === null
                ? "Time's up — that costs a life."
                : "Wrong — that costs a life."}
          </p>
          {!lastResult.correct && lastResult.note && (
            <p className="max-w-md text-center text-sm leading-relaxed text-muted-fg">
              {lastResult.note}
            </p>
          )}
          <Button onClick={next}>
            {lives <= 0 ? "See the damage" : index + 1 >= questions.length ? "Finish" : "Next round"}
          </Button>
        </div>
      )}
    </div>
  );
}
