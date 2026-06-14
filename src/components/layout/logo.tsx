import { cn } from "@/lib/utils";

/**
 * The Witness Ready mark: a constructed monoline "WR" monogram inside a
 * cobalt badge. Geometric, two-stroke, scales cleanly to a favicon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="Witness Ready"
    >
      <defs>
        <linearGradient id="wr-badge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6781ff" />
          <stop offset="1" stopColor="#3b54e6" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#wr-badge)" />
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="46.5"
        rx="11.25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* W */}
        <path d="M8 16 L12.5 33 L19 21 L25.5 33 L30 16" />
        {/* R */}
        <path d="M34 33 V16 H38.5 a4.6 4.6 0 0 1 0 9.2 H34 M38.4 25 L42.5 33" />
      </g>
    </svg>
  );
}

/** Full lockup: monogram + "Witness Ready" wordmark. */
export function Logo({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {showMark && <LogoMark className="h-7 w-7" />}
      <span className="font-display text-[1.15rem] font-semibold tracking-tight text-foreground">
        Witness Ready
      </span>
    </span>
  );
}
