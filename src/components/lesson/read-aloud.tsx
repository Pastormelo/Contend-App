"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Voice = "male" | "female";
type Mode = "loading" | "audio" | "browser";
const RATES = [1, 1.25, 1.5, 0.85];

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ---------- Browser-voice helpers (fallback) ---------- */

function toChunks(segments: string[]): string[] {
  const chunks: string[] = [];
  for (const seg of segments) {
    const sentences = seg.match(/[^.!?]+[.!?]*\s*/g) ?? [seg];
    let buf = "";
    for (const s of sentences) {
      if ((buf + s).length > 220 && buf) {
        chunks.push(buf.trim());
        buf = s;
      } else buf += s;
    }
    if (buf.trim()) chunks.push(buf.trim());
  }
  return chunks;
}

function pickVoice(voices: SpeechSynthesisVoice[], gender: Voice) {
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const female = ["female", "samantha", "victoria", "karen", "moira", "tessa", "fiona", "zira", "susan", "serena", "ava", "allison"];
  const male = ["male", "daniel", "alex", "fred", "tom", "rishi", "oliver", "george", "david", "mark", "aaron"];
  const hints = gender === "female" ? female : male;
  return en.find((v) => hints.some((h) => v.name.toLowerCase().includes(h))) ?? en[0] ?? voices[0];
}

/* ================================================================== */

export function ReadAloud({
  segments,
  lessonId,
}: {
  segments: string[];
  lessonId: string;
}) {
  const [mode, setMode] = useState<Mode>("loading");
  const [voice, setVoice] = useState<Voice>("male");
  const [src, setSrc] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);

  // Resolve studio audio for the chosen voice (or fall back to browser TTS).
  useEffect(() => {
    let cancelled = false;
    setSwitching(true);
    fetch(`/api/lesson-audio?lessonId=${lessonId}&voice=${voice}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { url?: string; fallback?: boolean }) => {
        if (cancelled) return;
        if (d.url) {
          setSrc(d.url);
          setMode("audio");
        } else {
          setMode("browser");
        }
      })
      .catch(() => !cancelled && setMode("browser"))
      .finally(() => !cancelled && setSwitching(false));
    return () => {
      cancelled = true;
    };
  }, [lessonId, voice]);

  if (mode === "loading") {
    return (
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-line-soft bg-surface px-4 py-3 text-sm text-muted-fg">
        <Spinner /> Preparing audio…
      </div>
    );
  }

  return mode === "audio" && src ? (
    <AudioPlayer src={src} voice={voice} onVoice={setVoice} switching={switching} />
  ) : (
    <BrowserPlayer segments={segments} voice={voice} onVoice={setVoice} />
  );
}

/* ---------- Studio audio: real <audio> with a draggable timeline ---------- */

function AudioPlayer({
  src,
  voice,
  onVoice,
  switching,
}: {
  src: string;
  voice: Voice;
  onVoice: (v: Voice) => void;
  switching: boolean;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);

  const seek = (t: number) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(t, el.duration || 0));
  };

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  };

  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(next);
    if (ref.current) ref.current.playbackRate = next;
  };

  return (
    <div className="mt-5 rounded-xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex items-center gap-2">
        <IconButton label="Rewind 10 seconds" onClick={() => seek(cur - 10)}>
          <Rewind />
        </IconButton>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-deep"
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <IconButton label="Forward 10 seconds" onClick={() => seek(cur + 10)}>
          <Forward />
        </IconButton>

        <span className="ml-2 text-xs tabular-nums text-muted-fg">{fmt(cur)}</span>

        <input
          type="range"
          min={0}
          max={dur || 0}
          step={0.1}
          value={cur}
          onChange={(e) => seek(parseFloat(e.target.value))}
          aria-label="Seek"
          className="mx-1 h-1.5 flex-1 cursor-pointer accent-accent"
        />

        <span className="text-xs tabular-nums text-muted-fg">{fmt(dur)}</span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <VoiceToggle voice={voice} onVoice={onVoice} disabled={switching} />
        {switching && <Spinner />}
        <button
          type="button"
          onClick={cycleRate}
          className="ml-auto rounded-full border border-line-strong px-2.5 py-1 text-xs font-medium text-muted-fg transition-colors hover:text-foreground"
          aria-label="Playback speed"
        >
          {rate}×
        </button>
      </div>
    </div>
  );
}

/* ---------- Browser voices: chunked speech with estimated timeline ---------- */

function BrowserPlayer({
  segments,
  voice,
  onVoice,
}: {
  segments: string[];
  voice: Voice;
  onVoice: (v: Voice) => void;
}) {
  const chunks = useRef<string[]>(toChunks(segments));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const rateRef = useRef(1);
  const voiceRef = useRef<Voice>(voice);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const noop = () => synth.getVoices();
    noop();
    synth.onvoiceschanged = noop;
    return () => {
      synth.cancel();
    };
  }, [supported]);

  // Rough timeline from word counts at ~180 wpm * rate.
  const words = chunks.current.map((c) => c.split(/\s+/).length);
  const total = words.reduce((a, b) => a + b, 0);
  const done = words.slice(0, idx).reduce((a, b) => a + b, 0);
  const totalSec = (total / (180 * rate)) * 60;
  const curSec = (done / (180 * rate)) * 60;

  const speakFrom = useCallback((i: number) => {
    const synth = window.speechSynthesis;
    if (i >= chunks.current.length) {
      setPlaying(false);
      setIdx(0);
      return;
    }
    setIdx(i);
    const u = new SpeechSynthesisUtterance(chunks.current[i]);
    u.rate = rateRef.current;
    const v = pickVoice(synth.getVoices(), voiceRef.current);
    if (v) u.voice = v;
    u.onend = () => speakFrom(i + 1);
    synth.speak(u);
  }, []);

  const play = () => {
    const synth = window.speechSynthesis;
    if (synth.paused && synth.speaking) {
      synth.resume();
      setPlaying(true);
      return;
    }
    synth.cancel();
    setPlaying(true);
    speakFrom(idx);
  };
  const pause = () => {
    window.speechSynthesis.pause();
    setPlaying(false);
  };
  const jump = (i: number) => {
    const clamped = Math.max(0, Math.min(i, chunks.current.length - 1));
    window.speechSynthesis.cancel();
    setIdx(clamped);
    if (playing) speakFrom(clamped);
  };
  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(next);
    rateRef.current = next;
    if (playing) {
      window.speechSynthesis.cancel();
      speakFrom(idx);
    }
  };
  const changeVoice = (v: Voice) => {
    onVoice(v);
    voiceRef.current = v;
    if (playing) {
      window.speechSynthesis.cancel();
      speakFrom(idx);
    }
  };

  if (!supported) return null;

  return (
    <div className="mt-5 rounded-xl border border-line-soft bg-surface px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <IconButton label="Back" onClick={() => jump(idx - 1)}>
          <Rewind />
        </IconButton>
        <button
          type="button"
          onClick={playing ? pause : play}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-deep"
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <IconButton label="Forward" onClick={() => jump(idx + 1)}>
          <Forward />
        </IconButton>

        <span className="ml-2 text-xs tabular-nums text-muted-fg">~{fmt(curSec)}</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, chunks.current.length - 1)}
          step={1}
          value={idx}
          onChange={(e) => jump(parseInt(e.target.value, 10))}
          aria-label="Seek"
          className="mx-1 h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <span className="text-xs tabular-nums text-muted-fg">~{fmt(totalSec)}</span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <VoiceToggle voice={voice} onVoice={changeVoice} />
        <button
          type="button"
          onClick={cycleRate}
          className="ml-auto rounded-full border border-line-strong px-2.5 py-1 text-xs font-medium text-muted-fg transition-colors hover:text-foreground"
          aria-label="Playback speed"
        >
          {rate}×
        </button>
      </div>
      <p className="mt-1.5 text-[0.6875rem] text-muted-fg">
        Using your device&apos;s built-in voice.
      </p>
    </div>
  );
}

/* ---------- Shared bits ---------- */

function VoiceToggle({
  voice,
  onVoice,
  disabled,
}: {
  voice: Voice;
  onVoice: (v: Voice) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-line-strong text-xs font-medium">
      {(["male", "female"] as Voice[]).map((v) => (
        <button
          key={v}
          type="button"
          disabled={disabled}
          onClick={() => onVoice(v)}
          className={
            "px-3 py-1 capitalize transition-colors disabled:opacity-50 " +
            (voice === v
              ? "bg-accent text-white"
              : "text-muted-fg hover:text-foreground")
          }
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-fg transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
  );
}
function Play() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function Pause() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function Rewind() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="currentColor" aria-hidden>
      <path d="M11 6v12l-8.5-6L11 6zm1.5 6L21 6v12l-8.5-6z" />
    </svg>
  );
}
function Forward() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="currentColor" aria-hidden>
      <path d="M13 6v12l8.5-6L13 6zm-1.5 6L3 6v12l8.5-6z" />
    </svg>
  );
}
