import { cn } from "@/lib/utils";

/**
 * The Contend mark: a shield bearing a cross whose lower beam is drawn to
 * a sword point — defend the faith. Geometric, two-tone, scales cleanly.
 */
export function LogoMark({
  className,
  cross = "var(--background)",
}: {
  className?: string;
  /** Color of the cross cut-out (defaults to page background) */
  cross?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 56"
      className={cn("h-8 w-auto", className)}
      aria-hidden
      fill="none"
    >
      {/* Shield */}
      <path
        d="M24 1.5 45 9.5v17.3c0 13.4-8.6 22.1-21 27.7C11.6 48.9 3 40.2 3 26.8V9.5L24 1.5Z"
        fill="currentColor"
      />
      {/* Inner hairline */}
      <path
        d="M24 5.6 41.2 12.2v14.6c0 11.2-7 18.6-17.2 23.5C13.8 45.4 6.8 38 6.8 26.8V12.2L24 5.6Z"
        stroke={cross}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {/* Cross-sword */}
      <path
        d="M21.6 13h4.8v6.2h6.8v4.6h-6.8v14.4L24 43.6l-2.4-5.4V23.8h-6.8v-4.6h6.8V13Z"
        fill={cross}
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  cross,
}: {
  className?: string;
  markClassName?: string;
  cross?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} cross={cross} />
      <span className="font-display text-xl font-semibold tracking-tight">
        Contend
      </span>
    </span>
  );
}
