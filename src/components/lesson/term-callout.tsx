"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { renderInline } from "@/lib/markdown";

export type GlossaryEntry = {
  term: string;
  short_blurb: string;
  full_definition?: string | null;
};

export function TermCallout({ entry }: { entry: GlossaryEntry }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-full border border-line-strong px-2.5 py-0.5 text-xs font-medium text-muted-fg transition-colors duration-150 hover:border-accent/50 hover:text-accent"
        >
          {entry.term}
        </button>
      </PopoverTrigger>
      <PopoverContent className="text-sm leading-relaxed">
        <p className="font-display font-semibold">{entry.term}</p>
        <p className="mt-1.5 text-muted-fg">
          {renderInline(entry.full_definition || entry.short_blurb)}
        </p>
      </PopoverContent>
    </Popover>
  );
}
