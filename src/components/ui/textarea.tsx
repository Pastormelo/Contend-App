import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-[0.9375rem] leading-relaxed text-foreground placeholder:text-muted-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
