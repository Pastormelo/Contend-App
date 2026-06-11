"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SessionSummary({
  reviewed,
  xpAwarded,
}: {
  reviewed: number;
  xpAwarded: number;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="font-display text-3xl font-semibold">Queue clear.</p>
      <p className="text-sm text-muted-fg">
        {reviewed} card{reviewed === 1 ? "" : "s"} reviewed.
        {xpAwarded > 0 && " Streak credited."}
      </p>
      {xpAwarded > 0 && (
        <p className="rounded-full bg-accent/15 px-4 py-1 text-sm font-semibold text-accent">
          +{xpAwarded} XP
        </p>
      )}
      <Link href="/dashboard">
        <Button>Back to today</Button>
      </Link>
    </div>
  );
}
