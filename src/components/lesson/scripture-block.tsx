"use client";

import { useEffect, useState } from "react";
import { renderInline } from "@/lib/markdown";

export function ScriptureBlock({
  reference,
  note,
}: {
  reference: string;
  note?: string;
}) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/verses?ref=${encodeURIComponent(reference)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { text: string }) => {
        if (!cancelled) setText(data.text);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <figure className="relative my-12 rounded-card border border-line-soft bg-foreground/[0.02] px-6 py-7 sm:px-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1 left-4 select-none font-display text-6xl font-semibold leading-none text-accent/15"
      >
        “
      </span>
      <figcaption className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {reference}
        <span className="h-px flex-1 bg-line-soft" />
        <span className="font-medium text-muted-fg">ESV</span>
      </figcaption>
      <blockquote className="mt-4 font-display text-[1.125rem] italic leading-[1.8]">
        {text ?? (
          <span className="text-sm not-italic text-muted-fg">
            {failed ? "Open your Bible to this passage —" : "Loading passage…"}
          </span>
        )}
      </blockquote>
      {note && (
        <p className="mt-4 border-t border-line-soft pt-4 text-sm leading-relaxed text-muted-fg">
          {renderInline(note)}
        </p>
      )}
    </figure>
  );
}
