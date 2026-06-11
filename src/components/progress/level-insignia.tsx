import { cn } from "@/lib/utils";

export function LevelInsignia({
  level,
  earned = false,
  done = false,
  size = "md",
}: {
  level: number;
  earned?: boolean;
  done?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full border font-display font-semibold",
        size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm",
        done
          ? "border-gold bg-gold/15 text-gold"
          : earned
            ? "border-accent bg-accent/10 text-accent"
            : "border-line-strong text-muted-fg",
      )}
      aria-label={`Level ${level}`}
    >
      {done ? "✓" : level}
    </span>
  );
}
