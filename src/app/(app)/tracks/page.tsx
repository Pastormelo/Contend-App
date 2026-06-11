import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { LevelInsignia } from "@/components/progress/level-insignia";
import { Progress } from "@/components/ui/progress";

// One-line stub descriptions (display copy; tracks themselves are DB rows)
const STUB_BLURBS: Record<string, string> = {
  "deity-of-christ": "Who Jesus claimed to be — and the case that he is God.",
  "existence-of-god": "The classical arguments, made usable in real conversations.",
  "scripture-reliability": "Why the Bible you hold is the Bible they wrote.",
  resurrection: "The historical case for the risen Christ.",
  islam: "Engage Muslim friends with truth and honor.",
  mormonism: "The LDS gospel measured against the apostolic one.",
  "hebrew-israelites": "Identity claims answered from the text itself.",
};

export default async function TracksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: tracks }, { data: quizPassed }] = await Promise.all([
    supabase.from("tracks").select("*").order("sort"),
    supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("passed", true)
      .limit(1),
  ]);

  const trinityProgress = quizPassed && quizPassed.length > 0 ? 100 : 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Tracks
      </h1>
      <p className="mt-2 text-sm text-muted-fg">
        Doctrine before debate. Each track trains one front.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(tracks ?? []).map((track) => {
          if (track.status === "live") {
            return (
              <Link
                key={track.id}
                href={`/tracks/${track.slug}`}
                className="group rounded-card border border-line-soft bg-surface p-5 transition-colors duration-150 hover:border-accent/40"
              >
                <div className="flex items-start justify-between">
                  <LevelInsignia level={1} earned />
                  <Badge variant="accent">Live</Badge>
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold tracking-tight group-hover:text-accent">
                  {track.title}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-fg">
                  Level 1 · Beginner
                </p>
                <Progress value={trinityProgress} className="mt-4" />
              </Link>
            );
          }
          if (track.status === "locked") {
            return (
              <div
                key={track.id}
                className="rounded-card border border-line-soft bg-surface p-5 opacity-80"
              >
                <div className="flex items-start justify-between">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-muted-fg"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3H9V6Z" />
                  </svg>
                  <Badge variant="muted">Locked</Badge>
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {track.title}
                </h2>
                <p className="mt-2 text-sm text-muted-fg">
                  Requires Trinity: Defender
                </p>
              </div>
            );
          }
          return (
            <div
              key={track.id}
              className="rounded-card border border-dashed border-line-soft p-5 opacity-60"
            >
              <Badge variant="muted">In Training</Badge>
              <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
                {track.title}
              </h2>
              <p className="mt-2 text-sm text-muted-fg">
                {STUB_BLURBS[track.slug] ?? "In production."}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
