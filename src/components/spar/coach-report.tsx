import Link from "next/link";
import { RubricBars } from "@/components/spar/rubric-bars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Rubric } from "@/lib/ai/schemas";
import { cn } from "@/lib/utils";

type Moment = { quote: string; note: string };
type Suggestion = { point: string; citation_source_id: string | null };

const MOMENT_STYLES = [
  { label: "Best moment", className: "border-gold/40 bg-gold/5", labelColor: "text-gold" },
  { label: "Weak moment", className: "border-accent/40 bg-accent/5", labelColor: "text-accent" },
  { label: "Missed opportunity", className: "border-line-strong", labelColor: "text-muted-fg" },
];

export function CoachReport({
  rubric,
  moments,
  suggestions,
  sourceTitles,
  remediationLessonIds,
}: {
  rubric: Rubric;
  moments: [Moment | null, Moment | null, Moment | null];
  suggestions: Suggestion[];
  sourceTitles: Map<string, string>;
  remediationLessonIds: string[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="font-display text-lg font-semibold tracking-tight">
          The rubric
        </h2>
        <div className="mt-4">
          <RubricBars rubric={rubric} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Three moments
        </h2>
        {moments.map((moment, i) =>
          moment ? (
            <div
              key={MOMENT_STYLES[i].label}
              className={cn("rounded-card border p-5", MOMENT_STYLES[i].className)}
            >
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  MOMENT_STYLES[i].labelColor,
                )}
              >
                {MOMENT_STYLES[i].label}
              </p>
              <blockquote className="mt-2 font-display italic leading-relaxed">
                “{moment.quote}”
              </blockquote>
              <p className="mt-2 text-sm leading-relaxed text-muted-fg">
                {moment.note}
              </p>
            </div>
          ) : null,
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Work on this
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {suggestions.map((s, i) => (
            <li key={i} className="rounded-card border border-line-soft bg-surface p-4 text-sm leading-relaxed">
              {s.point}
              {s.citation_source_id && sourceTitles.has(s.citation_source_id) && (
                <Badge variant="muted" className="ml-2 align-middle">
                  {sourceTitles.get(s.citation_source_id)}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </section>

      {remediationLessonIds.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Recommended review
          </h2>
          <div className="mt-3">
            {remediationLessonIds.map((id) => (
              <Link
                key={id}
                href={`/learn/${id}`}
                className="text-sm font-medium text-accent hover:text-accent-deep"
              >
                Re-read: The Trinity — One God, Three Persons →
              </Link>
            ))}
          </div>
        </section>
      )}

      <Link href="/spar" className="self-center">
        <Button size="lg">Spar again</Button>
      </Link>
    </div>
  );
}
