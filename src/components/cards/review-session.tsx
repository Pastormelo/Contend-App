"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFace, type QueueCard } from "@/components/cards/card-face";
import { GradeBar } from "@/components/cards/grade-bar";
import { SessionSummary } from "@/components/cards/session-summary";
import type { ReviewGrade } from "@/lib/srs";

export function ReviewSession() {
  const [queue, setQueue] = useState<QueueCard[] | null>(null);
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
        <Button size="lg" onClick={() => setRevealed(true)}>
          Reveal
        </Button>
      )}
    </div>
  );
}
