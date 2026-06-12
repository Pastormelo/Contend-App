import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "border border-transparent bg-accent text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(14_14_16/0.12)] hover:bg-accent-deep hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_4px_12px_-2px_rgb(122_46_46/0.45)]",
  outline:
    "border border-line-strong bg-transparent text-foreground hover:border-accent/50 hover:bg-foreground/5",
  ghost: "border border-transparent text-foreground hover:bg-foreground/5",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
