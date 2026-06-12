"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFace, type QueueCard } from "@/components/cards/card-face";
import { GradeBar } from "@/components/cards/grade-bar";
import { SessionSummary } from "@/components/cards/session-summary";
import type { ReviewGrade } from "@/lib/srs";

export function ReviewSession() {
  const [queue, setQueue] = useState<QueueCard[] | null>(null);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [typedValue, setTypedValue] = useState("");
  const [grading, setGrading] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/review/queue")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { cards: QueueCard[] }) => {
        setQueue(d.cards);
        if (d.cards.length === 0) setDone(true);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="text-center text-sm text-accent">Couldn&apos;t load your queue.</p>;
  }
  if (!queue) {
    return <p className="text-center text-sm text-muted-fg">Loading queue…</p>;
  }
  if (done) {
    return <SessionSummary reviewed={reviewed} xpAwarded={xpAwarded} />;
  }

  if (!started) {
    return (
      <div className="flex w-full flex-col items-center gap-8">
        <div className="w-full rounded-card border border-line-soft bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
            How review works
          </p>
          <ol className="mt-4 flex flex-col gap-3 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="font-display font-semibold text-accent">1.</span>
              <span>
                A card shows you a prompt — a verse reference, a term, or a
                question. <strong>Answer it in your head first</strong>, out
                loud if you can.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display font-semibold text-accent">2.</span>
              <span>
                Tap <strong>Reveal answer</strong> and compare it to what you
                said.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display font-semibold text-accent">3.</span>
              <span>
                Grade yourself honestly. Cards you miss come back{" "}
                <strong>tomorrow</strong>; cards you know wait days or weeks.
                That spacing is what moves them into permanent memory.
              </span>
            </li>
          </ol>
          <p className="mt-4 border-t border-line-soft pt-4 text-sm leading-relaxed text-muted-fg">
            {queue.length} {queue.length === 1 ? "card is" : "cards are"} due
            today. Clearing the queue keeps your streak alive.
          </p>
        </div>
        <Button size="lg" onClick={() => setStarted(true)}>
          Start review
        </Button>
      </div>
    );
  }

  const card = queue[index];

  async function grade(g: ReviewGrade) {
    setGrading(true);
    const res = await fetch("/api/review/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: card.cardId, grade: g }),
    });
    setGrading(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    const data = (await res.json()) as { xpAwarded: number };
    if (data.xpAwarded > 0) setXpAwarded(data.xpAwarded);
    setReviewed((n) => n + 1);
    setRevealed(false);
    setTypedValue("");
    if (index + 1 >= queue!.length) {
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-fg">
        {index + 1} of {queue.length}
      </p>

      <div className="flex min-h-[260px] items-center justify-center rounded-card border border-line-soft bg-surface p-8">
        <CardFace
          card={card}
          revealed={revealed}
          typedValue={typedValue}
          onTypedChange={setTypedValue}
        />
      </div>

      {revealed ? (
        <GradeBar onGrade={grade} disabled={grading} />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-muted-fg">
            Answer from memory first — then check yourself.
          </p>
          <Button size="lg" onClick={() => setRevealed(true)}>
            Reveal answer
          </Button>
        </div>
      )}
    </div>
  );
}
