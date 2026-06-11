"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type CitationInfo = {
  id: string;
  locator: string | null;
  source: {
    title: string;
    author: string | null;
    publisher: string | null;
    year: number | null;
    source_type: string;
  };
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  scripture: "Scripture",
  public_domain: "Public domain",
  melo_notes: "Teaching notes",
  copyrighted_reference: "Summarized reference",
  opponent_publication: "Opponent publication",
};

export function CitationMark({
  citation,
  index,
}: {
  citation: CitationInfo;
  index: number;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="align-super text-[0.7rem] font-medium text-accent hover:text-accent-deep"
          aria-label={`Citation ${index}`}
        >
          [{index}]
        </button>
      </PopoverTrigger>
      <PopoverContent className="text-sm">
        <Badge variant="muted">
          {SOURCE_TYPE_LABELS[citation.source.source_type] ??
            citation.source.source_type}
        </Badge>
        <p className="mt-2 font-medium">
          {citation.source.author ? `${citation.source.author}, ` : ""}
          <em>{citation.source.title}</em>
        </p>
        <p className="mt-0.5 text-xs text-muted-fg">
          {[
            citation.source.publisher,
            citation.source.year,
            citation.locator,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </PopoverContent>
    </Popover>
  );
}
