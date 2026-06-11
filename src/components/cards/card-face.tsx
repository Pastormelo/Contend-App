"use client";

import { useEffect, useState } from "react";
import {
  ClozeMode,
  FirstLetterMode,
  TypedRecallMode,
} from "@/components/cards/scripture-modes";
import { renderInline } from "@/lib/markdown";

export type QueueCard = {
  cardId: string;
  mode: "read" | "first_letter" | "cloze" | "typed";
  state: string;
  type: "scripture" | "term" | "argument";
  front: { reference?: string; term?: string; cloze?: string; prompt?: string };
  back: { definition?: string; answers?: string[] };
  skeleton: { points?: string[] } | null;
};

export function CardFace({
  card,
  revealed,
  typedValue,
  onTypedChange,
}: {
  card: QueueCard;
  revealed: boolean;
  typedValue: string;
  onTypedChange: (v: string) => void;
}) {
  const [verseText, setVerseText] = useState<string | null>(null);

  useEffect(() => {
    setVerseText(null);
    if (card.type === "scripture" && card.front.reference) {
      fetch(`/api/verses?ref=${encodeURIComponent(card.front.reference)}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: { text: string }) => setVerseText(d.text))
        .catch(() => setVerseText(null));
    }
  }, [card.cardId, card.type, card.front.reference]);

  if (card.type === "scripture") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-fg">
          {card.front.reference} · {card.mode.replace("_", " ")}
        </p>
        {!revealed && card.mode === "first_letter" && verseText && (
          <FirstLetterMode text={verseText} />
        )}
        {!revealed && card.mode === "cloze" && verseText && (
          <ClozeMode text={verseText} />
        )}
        {card.mode === "typed" && (
          <TypedRecallMode
            text={verseText ?? ""}
            revealed={revealed}
            value={typedValue}
            onChange={onTypedChange}
          />
        )}
        {!revealed && card.mode === "read" && (
          <p className="text-sm text-muted-fg">Recite it, then reveal.</p>
        )}
        {revealed && (
          <blockquote className="font-display text-lg italic leading-relaxed">
            {verseText ?? "Passage unavailable — check your Bible."}
          </blockquote>
        )}
      </div>
    );
  }

  if (card.type === "term") {
    const front = card.front.term ?? card.front.cloze ?? "";
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="font-display text-2xl font-semibold">{front}</p>
        {revealed &&
          (card.back.definition ? (
            <p className="max-w-md text-base leading-relaxed text-muted-fg">
              {renderInline(card.back.definition)}
            </p>
          ) : (
            <p className="font-display text-xl text-gold">
              {(card.back.answers ?? []).join(" · ")}
            </p>
          ))}
        {!revealed && (
          <p className="text-sm text-muted-fg">
            {card.front.cloze ? "Fill the blanks in your head." : "Define it precisely."}
          </p>
        )}
      </div>
    );
  }

  // argument card — points hidden, self-graded
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="font-display text-xl font-semibold">{card.front.prompt}</p>
      {revealed ? (
        <ol className="flex max-w-md list-decimal flex-col gap-1.5 pl-6 text-left text-base leading-relaxed">
          {(card.skeleton?.points ?? []).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-fg">
          Say all {card.skeleton?.points?.length ?? 6} lines out loud, in order.
        </p>
      )}
    </div>
  );
}
