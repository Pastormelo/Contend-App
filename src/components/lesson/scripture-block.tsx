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
    <figure className="my-10 border-l-2 border-accent/60 pl-5">
      <blockquote className="font-display text-[1.0625rem] italic leading-[1.75]">
        {text ?? (
          <span className="text-muted-fg not-italic text-sm">
            {failed ? "Open your Bible to this passage —" : "Loading passage…"}
          </span>
        )}
      </blockquote>
      <figcaption className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-fg">
        {reference} · ESV
      </figcaption>
      {note && (
        <p className="mt-3 text-sm leading-relaxed text-muted-fg">
          {renderInline(note)}
        </p>
      )}
    </figure>
  );
}
