"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The six-line Trinity formulation, in order (the flagship argument card). */
const CREED = [
  "There is one God.",
  "The Father is God.",
  "The Son is God.",
  "The Holy Spirit is God.",
  "The Father, Son, and Spirit are distinct persons.",
  "Therefore the one God eternally exists as three persons.",
];

/** Stage 2 distractors — each is a real heresy. Selecting one is fatal. */
const HERESIES = [
  { line: "The Son is God's first and greatest creature.", name: "Arianism — the error Nicaea answered" },
  { line: "Father, Son, and Spirit are three forms of the one person.", name: "modalism" },
  { line: "The Father, Son, and Spirit are three separate gods.", name: "tritheism" },
];

type Stage = {
  title: string;
  note: string;
  pool: { line: string; heresy?: string }[];
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildStages(): Stage[] {
  return [
    {
      title: "Stage 1 — Build the argument",
      note: "Tap the six lines in the order the argument runs.",
      pool: shuffle(CREED.map((line) => ({ line }))),
    },
    {
      title: "Stage 2 — Build it through the minefield",
      note: "Same six lines, in order — but three impostors slipped in. Pick a heresy and the whole thing collapses.",
      pool: shuffle([
        ...CREED.map((line) => ({ line })),
        ...HERESIES.map((h) => ({ line: h.line, heresy: h.name })),
      ]),
    },
  ];
}

export function CreedBuilder() {
  const [stages, setStages] = useState<Stage[]>(buildStages);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0); // next CREED index expected
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [strikes, setStrikes] = useState(0);
  const [shakeLine, setShakeLine] = useState<string | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const [phase, setPhase] = useState<"intro" | "play" | "stageclear" | "won">("intro");
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);

  const stage = stages[stageIndex];

  function reset(toStage: number) {
    setStages(buildStages());
    setStageIndex(toStage);
    setProgress(0);
    setUsed(new Set());
    setStrikes(0);
    setFatal(null);
    setShakeLine(null);
    setPhase("play");
  }

  function pick(item: { line: string; heresy?: string }) {
    if (phase !== "play" || used.has(item.line) || fatal) return;

    if (item.heresy) {
      setFatal(item.heresy);
      return;
    }

    if (item.line === CREED[progress]) {
      const nextUsed = new Set(used).add(item.line);
      setUsed(nextUsed);
      const next = progress + 1;
      setProgress(next);
      if (next === CREED.length) {
        if (stageIndex + 1 >= stages.length) {
          setPhase("won");
          fetch("/api/games/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game: "creed" }),
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((d: { xpAwarded: number } | null) => {
              if (d) setXpAwarded(d.xpAwarded);
            })
            .catch(() => {});
        } else {
          setPhase("stageclear");
        }
      }
    } else {
      setShakeLine(item.line);
      setStrikes((s) => s + 1);
      setTimeout(() => setShakeLine(null), 350);
    }
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="w-full rounded-card border border-line-soft bg-surface p-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The rules
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed">
            <li>• The six-line Trinity argument is scrambled. Rebuild it in order, tap by tap.</li>
            <li>• A line out of order is a strike — three strikes restarts the stage.</li>
            <li>• Stage 2 hides <strong>three heresies</strong> among the lines. Build through them without touching one.</li>
            <li>• Finish both stages for XP (once a day).</li>
          </ul>
        </div>
        <Button size="lg" onClick={() => reset(0)}>
          Build the creed
        </Button>
      </div>
    );
  }

  if (phase === "won") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Creed complete
        </p>
        <div className="rounded-card border border-gold/40 bg-gold/5 p-6 text-left">
          {CREED.map((line, i) => (
            <p key={line} className="font-display text-[0.9375rem] italic leading-relaxed">
              <span className="mr-2 not-italic text-xs font-semibold text-gold">{i + 1}.</span>
              {line}
            </p>
          ))}
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
          That argument — in that order — is the whole doctrine. Say it out
          loud once. It&apos;s yours now.
        </p>
        {xpAwarded !== null && (
          <p className="text-sm font-medium text-gold">
            {xpAwarded > 0 ? `+${xpAwarded} XP` : "Already earned today — back tomorrow for more XP"}
          </p>
        )}
        <div className="flex gap-3">
          <Button size="lg" onClick={() => reset(0)}>Build it again</Button>
          <Link href="/games">
            <Button size="lg" variant="outline">All games</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "stageclear") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Stage 1 clear
        </p>
        <p className="font-display text-3xl font-semibold">
          Now do it under fire.
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
          Three heresies are about to hide among your six lines. Real
          conversations work the same way — the wrong sentence sounds almost
          right.
        </p>
        <Button size="lg" onClick={() => reset(1)}>Start stage 2</Button>
      </div>
    );
  }

  if (fatal) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Heresy
        </p>
        <p className="font-display text-2xl font-semibold leading-snug">
          That line was {fatal}.
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
          It sounded close — that&apos;s exactly why it&apos;s dangerous. The
          lesson&apos;s &ldquo;What the Trinity is NOT&rdquo; section has the
          tell-tale signs.
        </p>
        <Button size="lg" onClick={() => reset(stageIndex)}>
          Rebuild from the start
        </Button>
      </div>
    );
  }

  if (strikes >= 3) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Three strikes
        </p>
        <p className="font-display text-2xl font-semibold">
          The order is the argument.
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
          One God first. Then the three persons. Then the distinctness. Only
          then the conclusion — it has to <em>follow</em>.
        </p>
        <Button size="lg" onClick={() => reset(stageIndex)}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-fg">
        <span>{stage.title}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i < strikes ? "bg-accent" : "bg-line-strong",
              )}
            />
          ))}
        </span>
      </div>

      {/* The creed being built */}
      <div className="min-h-36 rounded-card border border-line-soft bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
          The argument so far
        </p>
        {progress === 0 ? (
          <p className="mt-3 text-sm italic text-muted-fg">{stage.note}</p>
        ) : (
          <div className="mt-3 flex flex-col gap-1.5">
            {CREED.slice(0, progress).map((line, i) => (
              <p key={line} className="animate-pop font-display text-[0.9375rem] italic leading-relaxed">
                <span className="mr-2 not-italic text-xs font-semibold text-gold">{i + 1}.</span>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* The pool */}
      <div className="flex flex-col gap-2">
        {stage.pool.map((item) => {
          const isUsed = used.has(item.line);
          if (isUsed) return null;
          return (
            <button
              key={item.line}
              type="button"
              onClick={() => pick(item)}
              className={cn(
                "rounded-lg border border-line-strong px-4 py-3 text-left text-sm font-medium transition-all duration-150 hover:border-accent/40 hover:bg-foreground/5 active:scale-[0.99]",
                shakeLine === item.line && "animate-shake border-accent text-accent",
              )}
            >
              {item.line}
            </button>
          );
        })}
      </div>
    </div>
  );
}
