import { cn } from "@/lib/utils";

const BRASS = "#b5893c";
const ACCENT = "#1d4ed8";

/**
 * The Witness Ready mark: an academic seal — a brass double-ring crest
 * topped by a cross, with a serif "WR" at its center. Reads as a seminary.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="Witness Ready"
    >
      {/* double ring */}
      <circle cx="24" cy="24" r="22.2" fill="none" stroke={BRASS} strokeWidth="1.5" />
      <circle cx="24" cy="24" r="18.4" fill="none" stroke={BRASS} strokeWidth="0.8" />
      {/* cross at the crown */}
      <path
        d="M24 2.4 V8.4 M21.2 5 H26.8"
        stroke={BRASS}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* serif monogram */}
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill={ACCENT}
        style={{
          fontFamily: "var(--font-newsreader), Georgia, 'Times New Roman', serif",
          fontWeight: 600,
          fontSize: "17px",
          letterSpacing: "-0.5px",
        }}
      >
        WR
      </text>
    </svg>
  );
}

/** Full lockup: seal + serif "Witness Ready" wordmark. */
export function Logo({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {showMark && <LogoMark className="h-8 w-8" />}
      <span className="font-display text-[1.2rem] font-semibold tracking-tight text-foreground">
        Witness Ready
      </span>
    </span>
  );
}
