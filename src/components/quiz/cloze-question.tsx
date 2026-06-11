"use client";

import { Input } from "@/components/ui/input";

export function ClozeQuestion({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Fill in the blank…"
      autoCapitalize="none"
      autoCorrect="off"
    />
  );
}
