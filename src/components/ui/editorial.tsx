import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial primitives — the "theological broadsheet" layout language:
 * category kickers, bylines/meta, section rules, and divided story rows.
 * Server-safe (no client hooks).
 */

export function Kicker({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "brass" | "muted";
  className?: string;
}) {
  const tones = {
    accent: "text-accent",
    brass: "text-gold",
    muted: "text-muted-fg",
  };
  return <span className={cn("eyebrow", tones[tone], className)}>{children}</span>;
}

/** Uppercase byline/meta line: items joined by hairline dots. */
export function Meta({
  items,
  className,
}: {
  items: (string | null | undefined | false)[];
  className?: string;
}) {
  const parts = items.filter(Boolean) as string[];
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-fg",
        className,
      )}
    >
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-2.5">
          {i > 0 && (
            <span aria-hidden className="text-muted-fg/40">
              •
            </span>
          )}
          {p}
        </span>
      ))}
    </p>
  );
}

/** A masthead-style section header: label, rule across, optional action. */
export function SectionHeading({
  label,
  action,
  actionHref,
  className,
}: {
  label: string;
  action?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <h2 className="eyebrow shrink-0 text-foreground">{label}</h2>
      <span aria-hidden className="h-px flex-1 bg-foreground/20" />
      {action && actionHref && (
        <Link
          href={actionHref}
          className="eyebrow link-underline shrink-0 text-accent"
        >
          {action} →
        </Link>
      )}
    </div>
  );
}

/** A numbered index rule: big serif numeral for genuine sequences (the course path). */
export function Rank({ n }: { n: number }) {
  return (
    <span className="font-display text-2xl font-semibold leading-none tabular-nums text-accent/40 sm:text-3xl">
      {String(n).padStart(2, "0")}
    </span>
  );
}
