"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { normalize } from "@/lib/scoring";

/** First-letter scaffold: "In the beginning" → "I— t— b—" */
export function FirstLetterMode({ text }: { text: string }) {
  const scaffold = useMemo(
    () =>
      text
        .split(/\s+/)
        .map((w) => {
          const m = w.match(/\p{L}/u);
          return m ? `${m[0]}—` : w;
        })
        .join(" "),
    [text],
  );
  return (
    <p className="font-display text-lg italic leading-relaxed tracking-wide">
      {scaffold}
    </p>
  );
}

/** Cloze scaffold: every third word blanked. */
export function ClozeMode({ text }: { text: string }) {
  const scaffold = useMemo(
    () =>
      text
        .split(/\s+/)
        .map((w, i) => (i % 3 === 2 ? "____" : w))
        .join(" "),
    [text],
  );
  return (
    <p className="font-display text-lg italic leading-relaxed">{scaffold}</p>
  );
}

/** Typed recall: strict wording, tolerant punctuation. */
export function TypedRecallMode({
  text,
  revealed,
  value,
  onChange,
}: {
  text: string;
  revealed: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const [match, setMatch] = useState<boolean | null>(null);

  if (revealed && match === null) {
    setMatch(normalize(value) === normalize(text));
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <Textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type the verse from memory…"
        disabled={revealed}
      />
      {revealed && (
        <p
          className={
            match ? "text-sm font-medium text-gold" : "text-sm font-medium text-accent"
          }
        >
          {match
            ? "Word-perfect (punctuation aside)."
            : "Not quite — compare against the text below."}
        </p>
      )}
    </div>
  );
}
