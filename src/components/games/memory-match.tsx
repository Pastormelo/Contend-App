"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MatchPair = { term: string; definition: string };

type Tile = {
  id: number;
  pairKey: string;
  face: string;
  kind: "term" | "definition";
};

const LEVELS = [
  { pairs: 3, seconds: 45 },
  { pairs: 4, seconds: 60 },
  { pairs: 6, seconds: 80 },
];

function buildTiles(pairs: MatchPair[], count: number): Tile[] {
  const chosen = [...pairs].sort(() => Math.random() - 0.5).slice(0, count);
  const tiles: Tile[] = [];
  chosen.forEach((p, i) => {
    tiles.push({ id: i * 2, pairKey: p.term, face: p.term, kind: "term" });
    tiles.push({
      id: i * 2 + 1,
      pairKey: p.term,
      face: p.definition,
      kind: "definition",
    });
  });
  return tiles.sort(() => Math.random() - 0.5);
}

export function MemoryMatch({ pairs }: { pairs: MatchPair[] }) {
  const [level, setLevel] = useState(0);
  const [tiles, setTiles] = useState<Tile[] | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [phase, setPhase] = useState<"intro" | "play" | "levelup" | "won" | "lost">("intro");
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);

  const config = LEVELS[level];

  function startLevel(l: number) {
    setLevel(l);
    setTiles(buildTiles(pairs, LEVELS[l].pairs));
    setFlipped([]);
    setMatched(new Set());
    setMisses(0);
    setSecondsLeft(LEVELS[l].seconds);
    setPhase("play");
  }

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && secondsLeft <= 0) setPhase("lost");
  }, [secondsLeft, phase]);

  const allMatched = useMemo(
    () => tiles !== null && matched.size === config.pairs,
    [tiles, matched, config.pairs],
  );

  useEffect(() => {
    if (!allMatched || phase !== "play") return;
    if (level + 1 >= LEVELS.length) {
      setPhase("won");
      fetch("/api/games/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game: "match" }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { xpAwarded: number } | null) => {
          if (d) setXpAwarded(d.xpAwarded);
        })
        .catch(() => {});
    } else {
      setPhase("levelup");
    }
  }, [allMatched, phase, level]);

  function flip(tile: Tile) {
    if (phase !== "play") return;
    if (matched.has(tile.pairKey)) return;
    if (flipped.includes(tile.id)) return;
    if (flipped.length === 2) return;

    const next = [...flipped, tile.id];
    setFlipped(next);

    if (next.length === 2 && tiles) {
      const [a, b] = next.map((id) => tiles.find((t) => t.id === id)!);
      if (a.pairKey === b.pairKey && a.kind !== b.kind) {
        setTimeout(() => {
          setMatched((m) => new Set(m).add(a.pairKey));
          setFlipped([]);
        }, 450);
      } else {
        setMisses((m) => m + 1);
        setTimeout(() => setFlipped([]), 950);
      }
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
            <li>• Flip tiles to pair each <strong>term</strong> with its <strong>definition</strong>.</li>
            <li>• Three levels — more pairs, less time per pair as you climb.</li>
            <li>• The clock runs out, the level resets. Match them all to advance.</li>
            <li>• Clear level 3 for XP (once a day).</li>
          </ul>
        </div>
        <Button size="lg" onClick={() => startLevel(0)}>
          Start matching
        </Button>
      </div>
    );
  }

  if (phase === "won" || phase === "lost") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {phase === "won" ? "All terms mastered" : "Out of time"}
        </p>
        <p className="font-display text-3xl font-semibold">
          {phase === "won"
            ? "You know your vocabulary."
            : `Level ${level + 1} got you.`}
        </p>
        {phase === "won" && xpAwarded !== null && (
          <p className="text-sm font-medium text-gold">
            {xpAwarded > 0 ? `+${xpAwarded} XP` : "Already earned today — back tomorrow for more XP"}
          </p>
        )}
        {phase === "lost" && (
          <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
            These exact definitions are in the lesson&apos;s glossary — and in
            your review queue. Sharpen them and return.
          </p>
        )}
        <div className="flex gap-3">
          <Button size="lg" onClick={() => startLevel(phase === "lost" ? level : 0)}>
            {phase === "lost" ? "Retry this level" : "Play again"}
          </Button>
          <Link href="/games">
            <Button size="lg" variant="outline">All games</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "levelup") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Level {level + 1} clear
        </p>
        <p className="font-display text-3xl font-semibold">
          {misses === 0 ? "Flawless." : `${misses} miss${misses === 1 ? "" : "es"} — clean enough.`}
        </p>
        <Button size="lg" onClick={() => startLevel(level + 1)}>
          Level {level + 2}: {LEVELS[level + 1].pairs} pairs, {LEVELS[level + 1].seconds}s
        </Button>
      </div>
    );
  }

  const timerPct = (secondsLeft / config.seconds) * 100;

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between text-sm text-muted-fg">
        <span>Level {level + 1} of {LEVELS.length}</span>
        <span className="tabular-nums">{matched.size}/{config.pairs} pairs</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line-soft">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-linear",
            secondsLeft <= 10 ? "bg-accent" : "bg-gold",
          )}
          style={{ width: `${timerPct}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles?.map((tile) => {
          const isUp = flipped.includes(tile.id);
          const isMatched = matched.has(tile.pairKey);
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => flip(tile)}
              disabled={isMatched}
              className={cn(
                "min-h-24 rounded-card border p-3 text-center transition-all duration-200 active:scale-[0.97]",
                isMatched &&
                  "animate-pop cursor-default border-gold/60 bg-gold/10 opacity-80",
                !isMatched && isUp && "border-accent/60 bg-surface",
                !isMatched && !isUp &&
                  "border-line-strong bg-foreground/5 hover:border-accent/40 hover:bg-foreground/10",
              )}
            >
              {isUp || isMatched ? (
                <span
                  className={cn(
                    "block leading-snug",
                    tile.kind === "term"
                      ? "font-display text-lg font-semibold"
                      : "text-xs sm:text-[0.8125rem]",
                  )}
                >
                  {tile.face}
                </span>
              ) : (
                <span className="font-display text-2xl text-muted-fg">✦</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
