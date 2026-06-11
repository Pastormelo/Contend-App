import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "gold" | "muted";

const variants: Record<Variant, string> = {
  default: "border-line-strong text-foreground",
  accent: "border-accent/40 bg-accent/10 text-accent",
  gold: "border-gold/50 bg-gold/10 text-gold",
  muted: "border-line-soft text-muted-fg",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
