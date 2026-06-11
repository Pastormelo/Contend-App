"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DIFFICULTIES = ["civil", "standard", "hostile", "academic"] as const;

export function SparConfig({
  personaId,
  personaName,
  scenario,
}: {
  personaId: string;
  personaName: string;
  scenario: string;
}) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(false);

  async function begin() {
    setStarting(true);
    setError(false);
    const res = await fetch("/api/spar/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaId }),
    });
    if (!res.ok) {
      setError(true);
      setStarting(false);
      return;
    }
    const { simulationId } = (await res.json()) as { simulationId: string };
    router.push(`/spar/${simulationId}`);
  }

  return (
    <div className="rounded-card border border-line-soft bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg">
        Opponent
      </p>
      <p className="mt-2 font-display text-xl font-semibold">{personaName}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-fg">{scenario}</p>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-fg">
        Difficulty
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <Badge
            key={d}
            variant={d === "civil" ? "accent" : "muted"}
            className="capitalize"
          >
            {d}
            {d !== "civil" && " 🔒"}
          </Badge>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-accent">Could not start — try again.</p>
      )}

      <Button size="lg" className="mt-6 w-full" onClick={begin} disabled={starting}>
        {starting ? "Setting the scene…" : "Begin conversation"}
      </Button>
    </div>
  );
}
