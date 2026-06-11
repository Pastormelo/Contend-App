"use client";

import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  true: "True",
  false: "False",
  needs_qualification: "Needs qualification",
};

export function TFQQuestion({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-lg border px-4 py-3 text-left text-[0.9375rem] transition-colors duration-150",
            value === option
              ? "border-accent bg-accent/10 font-medium"
              : "border-line-strong hover:border-accent/40",
          )}
        >
          {LABELS[option] ?? option}
        </button>
      ))}
    </div>
  );
}
