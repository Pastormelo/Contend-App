"use client";

import { cn } from "@/lib/utils";

export function MCQuestion({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={cn(
            "rounded-lg border px-4 py-3 text-left text-[0.9375rem] transition-colors duration-150",
            value === i
              ? "border-accent bg-accent/10 font-medium"
              : "border-line-strong hover:border-accent/40",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
