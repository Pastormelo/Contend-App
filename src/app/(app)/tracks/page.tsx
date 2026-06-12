import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { LevelInsignia } from "@/components/progress/level-insignia";
import { Progress } from "@/components/ui/progress";
import { getSubject } from "@/lib/site-content";

export default async function TracksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: tracks }, { data: quizPassed }, { data: lessonRead }] =
    await Promise.all([
      supabase.from("tracks").select("*").order("sort"),
      supabase
        .from("quiz_attempts")
        .select("id")
        .eq("user_id", user.id)
        .eq("passed", true)
        .limit(1),
      supabase
        .from("xp_events")
        .select("id")
        .eq("user_id", user.id)
        .eq("reason", "lesson_complete")
        .limit(1),
    ]);

  const completedAny = Boolean(quizPassed && quizPassed.length > 0);
  const trinityProgress = completedAny
    ? 100
    : lessonRead && lessonRead.length > 0
      ? 50
      : 0;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
        Your training
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Courses
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-fg">
        Pick a course and train it to the end — finishing one is what unlocks
        your next choice. There is no fixed order, only finished and
        unfinished. Courses you complete stay open to you forever.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(tracks ?? []).map((track) => {
          const subject = getSubject(track.slug);

          if (track.status === "live") {
            return (
              <Link
                key={track.id}
                href={`/tracks/${track.slug}`}
                className="group rounded-card border border-line-soft bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <LevelInsignia level={1} earned />
                  <Badge variant="accent">
                    {completedAny ? "Completed" : "Open"}
                  </Badge>
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold tracking-tight group-hover:text-accent">
                  {track.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">
                  {subject?.tagline}
                </p>
                <Progress value={trinityProgress} className="mt-4" />
                <p className="mt-2 text-xs text-muted-fg">
                  {completedAny
                    ? "Level 1 complete — review anytime"
                    : trinityProgress > 0
                      ? "In progress — Level 1 · Beginner"
                      : "Not started — Level 1 · Beginner"}
                </p>
              </Link>
            );
          }

          if (track.status === "locked") {
            return (
              <div
                key={track.id}
                className="rounded-card border border-line-soft bg-surface p-5"
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
                  <Badge variant="muted">
                    {completedAny ? "Up next" : "Locked"}
                  </Badge>
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {track.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">
                  {subject?.tagline}
                </p>
                <p className="mt-3 border-t border-line-soft pt-3 text-xs leading-relaxed text-muted-fg">
                  {completedAny
                    ? "You've earned the choice — this course opens with the next release."
                    : "Finish a course to unlock your next choice."}
                  {subject && (
                    <>
                      {" "}
                      <Link
                        href={`/training/${track.slug}`}
                        className="font-medium text-accent hover:text-accent-deep"
                      >
                        Read the preview →
                      </Link>
                    </>
                  )}
                </p>
              </div>
            );
          }

          return (
            <div
              key={track.id}
              className="rounded-card border border-dashed border-line-strong/60 bg-transparent p-5"
            >
              <Badge variant="muted">In production</Badge>
              <h2 className="mt-4 font-display text-lg font-semibold tracking-tight text-muted-fg">
                {track.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">
                {subject?.tagline ?? "In production."}
              </p>
              {subject && (
                <p className="mt-3 text-xs">
                  <Link
                    href={`/training/${track.slug}`}
                    className="font-medium text-accent hover:text-accent-deep"
                  >
                    Read the preview →
                  </Link>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
