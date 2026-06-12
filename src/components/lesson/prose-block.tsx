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
  dropCap = false,
}: {
  heading?: string;
  md: string;
  terms?: GlossaryEntry[];
  citations?: CitationInfo[];
  citationStart?: number;
  variant?: "prose" | "objection";
  dropCap?: boolean;
}) {
  return (
    <section
      className={cn(
        "my-10",
        variant === "objection" &&
          "rounded-card border border-accent/25 bg-accent/[0.03] p-6 sm:p-7",
      )}
    >
      {heading && variant === "objection" && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Steelmanned — their strongest form
        </p>
      )}
      {heading && (
        <h2
          className={cn(
            "font-display text-xl font-semibold tracking-tight",
            variant === "objection" && "mt-2",
            variant === "prose" &&
              "flex items-center gap-3 after:h-px after:flex-1 after:bg-line-soft after:content-['']",
          )}
        >
          {heading}
        </h2>
      )}
      <p
        className={cn(
          "text-[1.0625rem] leading-[1.75]",
          heading && "mt-4",
          dropCap &&
            "first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-display first-letter:text-[3.25rem] first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-accent",
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
