"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LessonCompleteCTA({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleComplete() {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/learn/${lessonId}/complete`, {
      method: "POST",
    });
    if (!res.ok) {
      setError(true);
      setLoading(false);
      return;
    }
    router.push(`/learn/${lessonId}/quiz`);
  }

  return (
    <div className="my-16 flex flex-col items-center gap-3 border-t border-line-soft pt-10 text-center">
      <p className="font-display text-lg font-semibold">
        You&apos;ve read the case. Now prove you hold it.
      </p>
      <Button size="lg" onClick={handleComplete} disabled={loading}>
        {loading ? "Preparing…" : "Complete lesson → take the checkpoint"}
      </Button>
      <p className="text-xs text-muted-fg">
        Completing seeds your review deck with this lesson&apos;s 12 cards.
      </p>
      {error && (
        <p className="text-sm text-accent">Something failed — try again.</p>
      )}
    </div>
  );
}
