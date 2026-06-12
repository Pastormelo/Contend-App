"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * An inline, tappable scripture reference. The verse text is fetched on
 * first open (served from verses_cache after the first fetch).
 */
export function VerseRef({ reference }: { reference: string }) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  function load(open: boolean) {
    if (!open || text || failed) return;
    fetch(`/api/verses?ref=${encodeURIComponent(reference)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { text: string }) => setText(data.text))
      .catch(() => setFailed(true));
  }

  return (
    <Popover onOpenChange={load}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-sm font-medium text-accent underline decoration-accent/40 decoration-dotted underline-offset-[3px] transition-colors hover:decoration-accent"
        >
          {reference}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-fg">
          {reference} · ESV
        </p>
        <p className="mt-2 font-display text-[0.9375rem] italic leading-relaxed">
          {failed
            ? "Couldn't load this passage — open your Bible to it."
            : text ?? "Loading…"}
        </p>
      </PopoverContent>
    </Popover>
  );
}
