import { cn } from "@/lib/utils";

/**
 * Witness Ready is a wordmark-led brand: "Witness" in ink, "Ready" in the
 * oxblood accent, set in Fraunces. The monogram below is only for square
 * slots (favicon, tight icons) where a wordmark won't fit.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  /** Use the light wordmark tone on dark surfaces. */
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-tight",
        className,
      )}
    >
      <span className={onDark ? "text-paper" : "text-foreground"}>Witness</span>
      <span className="text-accent"> Ready</span>
    </span>
  );
}

/** Square "WR" monogram for favicons and tight icon slots. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent font-display text-sm font-semibold leading-none text-white",
        className,
      )}
    >
      WR
    </span>
  );
}
