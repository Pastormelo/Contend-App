"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "playing" | "paused" | "unsupported";

const RATES = [1, 1.25, 1.5, 0.85];

/** Split segments into short utterance chunks (avoids browser TTS cutoffs). */
function toChunks(segments: string[]): string[] {
  const chunks: string[] = [];
  for (const seg of segments) {
    const sentences = seg.match(/[^.!?]+[.!?]*\s*/g) ?? [seg];
    let buf = "";
    for (const s of sentences) {
      if ((buf + s).length > 220 && buf) {
        chunks.push(buf.trim());
        buf = s;
      } else {
        buf += s;
      }
    }
    if (buf.trim()) chunks.push(buf.trim());
  }
  return chunks;
}

export function ReadAloud({ segments }: { segments: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [rate, setRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const rateRef = useRef(1);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("unsupported");
      return;
    }
    chunksRef.current = toChunks(segments);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [segments]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  function speakFrom(i: number) {
    const synth = window.speechSynthesis;
    const chunks = chunksRef.current;
    if (i >= chunks.length) {
      setStatus("idle");
      indexRef.current = 0;
      setProgress(0);
      return;
    }
    indexRef.current = i;
    setProgress(Math.round((i / chunks.length) * 100));

    const u = new SpeechSynthesisUtterance(chunks[i]);
    u.rate = rateRef.current;
    const voice = synth
      .getVoices()
      .find((v) => v.lang?.toLowerCase().startsWith("en"));
    if (voice) u.voice = voice;
    u.onend = () => {
      // Only advance if we're still meant to be playing.
      if (window.speechSynthesis.speaking || indexRef.current === i) {
        speakFrom(i + 1);
      }
    };
    synth.speak(u);
  }

  function play() {
    const synth = window.speechSynthesis;
    if (status === "paused") {
      synth.resume();
      setStatus("playing");
      return;
    }
    synth.cancel();
    setStatus("playing");
    speakFrom(0);
  }

  function pause() {
    window.speechSynthesis.pause();
    setStatus("paused");
  }

  function stop() {
    window.speechSynthesis.cancel();
    indexRef.current = 0;
    setProgress(0);
    setStatus("idle");
  }

  function cycleRate() {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(next);
    // Apply immediately if speaking by restarting from current chunk.
    if (status === "playing") {
      window.speechSynthesis.cancel();
      rateRef.current = next;
      speakFrom(indexRef.current);
    }
  }

  if (status === "unsupported") return null;

  return (
    <div className="sticky top-[3.75rem] z-30 -mx-1 mt-5 flex items-center gap-3 rounded-full border border-line-soft bg-background/90 px-3 py-2 backdrop-blur sm:mx-0">
      {status === "playing" ? (
        <button
          type="button"
          onClick={pause}
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          <PauseIcon /> Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={play}
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          <PlayIcon /> {status === "paused" ? "Resume" : "Listen"}
        </button>
      )}

      {status !== "idle" && (
        <button
          type="button"
          onClick={stop}
          className="text-sm font-medium text-muted-fg hover:text-foreground"
        >
          Stop
        </button>
      )}

      <button
        type="button"
        onClick={cycleRate}
        className="ml-auto rounded-full border border-line-strong px-2.5 py-1 text-xs font-medium text-muted-fg hover:text-foreground"
        aria-label="Playback speed"
      >
        {rate}×
      </button>

      {status !== "idle" && (
        <span className="hidden text-xs tabular-nums text-muted-fg sm:inline">
          {progress}%
        </span>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
