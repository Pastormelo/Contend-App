import { renderInline } from "@/lib/markdown";
import { TermCallout, type GlossaryEntry } from "@/components/lesson/term-callout";
import { CitationMark, type CitationInfo } from "@/components/lesson/citation-card";
import { cn } from "@/lib/utils";

export function ProseBlock({
  heading,
  md,
  terms = [],
  citations = [],
  citationStart = 1,
  variant = "prose",
}: {
  heading?: string;
  md: string;
  terms?: GlossaryEntry[];
  citations?: CitationInfo[];
  citationStart?: number;
  variant?: "prose" | "objection";
}) {
  return (
    <section
      className={cn(
        "my-10",
        variant === "objection" &&
          "rounded-card border border-line-strong bg-foreground/[0.03] p-6",
      )}
    >
      {heading && (
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {variant === "objection" ? <>⚔ {heading}</> : heading}
        </h2>
      )}
      <p
        className={cn(
          "text-[1.0625rem] leading-[1.75]",
          heading && "mt-4",
        )}
      >
        {renderInline(md)}
        {citations.map((c, i) => (
          <CitationMark key={c.id} citation={c} index={citationStart + i} />
        ))}
      </p>
      {terms.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-fg">
            Terms
          </span>
          {terms.map((t) => (
            <TermCallout key={t.term} entry={t} />
          ))}
        </div>
      )}
    </section>
  );
}
