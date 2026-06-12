import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const LESSON_ID = "40000000-0000-0000-0000-000000000001";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date().toISOString();
  const [
    { data: profile },
    { count: dueCount },
    { data: lesson },
    { data: lessonXp },
    { data: passedAttempt },
    { data: badges },
  ] = await Promise.all([
    supabase.from("profiles").select("name").eq("id", user.id).single(),
    supabase
      .from("card_reviews")
      .select("card_id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .lte("due_at", now),
    supabase
      .from("lessons")
      .select("id, title, est_minutes")
      .eq("id", LESSON_ID)
      .single(),
    supabase
      .from("xp_events")
      .select("id")
      .eq("user_id", user.id)
      .eq("reason", "lesson_complete")
      .eq("ref_id", LESSON_ID)
      .limit(1),
    supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("passed", true)
      .limit(1),
    supabase
      .from("user_badges")
      .select("badge_id, badges(title)")
      .eq("user_id", user.id)
      .limit(6),
  ]);

  const firstName = (profile?.name ?? "Defender").split(" ")[0];
  const lessonRead = (lessonXp?.length ?? 0) > 0;
  const quizPassed = (passedAttempt?.length ?? 0) > 0;
  const lessonProgress = quizPassed ? 100 : lessonRead ? 50 : 0;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
        {today}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {greetingFor(new Date().getHours())}, {firstName}.
      </h1>
      <p className="mt-2 text-sm text-muted-fg">
        Ten focused minutes. Here&apos;s today&apos;s training.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {/* Review queue */}
        <section className="flex flex-col rounded-card border border-line-soft bg-surface p-6 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Memory
            </p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-fg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">
            Review queue
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-fg">
            {dueCount && dueCount > 0 ? (
              <>
                <span className="font-display text-4xl font-semibold tabular-nums text-foreground">
                  {dueCount}
                </span>{" "}
                card{dueCount === 1 ? "" : "s"} due — clear them to keep the
                case sharp and your streak alive.
              </>
            ) : (
              "Nothing due right now. Finish a lesson to load its verses and arguments into your queue."
            )}
          </p>
          <Link href="/review" className="mt-5">
            <Button className="w-full" disabled={!dueCount}>
              {dueCount ? "Start review" : "Queue is clear"}
            </Button>
          </Link>
        </section>

        {/* Lesson */}
        <section className="flex flex-col rounded-card border border-line-soft bg-surface p-6 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Study
            </p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-fg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M12 6.5C10.4 5 8.2 4.5 5.5 4.5v13c2.7 0 4.9.5 6.5 2 1.6-1.5 3.8-2 6.5-2v-13c-2.7 0-4.9.5-6.5 2Zm0 0v13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">
            {quizPassed ? "Course complete" : lessonRead ? "Prove it" : "Current lesson"}
          </h2>
          <div className="mt-2 flex-1">
            <p className="text-sm font-medium">{lesson?.title}</p>
            <p className="mt-1 text-xs text-muted-fg">
              The Trinity · Level 1 · ~{lesson?.est_minutes} min
            </p>
            <Progress value={lessonProgress} className="mt-3" />
          </div>
          <Link href={lessonRead && !quizPassed ? `/learn/${LESSON_ID}/quiz` : `/learn/${LESSON_ID}`} className="mt-5">
            <Button variant={quizPassed ? "outline" : "primary"} className="w-full">
              {quizPassed ? "Read again" : lessonRead ? "Take the quiz" : "Continue reading"}
            </Button>
          </Link>
        </section>

        {/* Drill */}
        <section className="flex flex-col rounded-card border border-line-soft bg-surface p-6 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Drill
            </p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-fg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="13" r="7" />
              <path d="M12 10v3.5M9 3h6M12 3v3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">
            Drill of the day
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-fg">
            A real objection, 90 seconds, your own words — then an honest
            score and a stronger answer to learn from.
          </p>
          <Link href="/respond" className="mt-5">
            <Button variant="outline" className="w-full">
              Take the drill
            </Button>
          </Link>
        </section>

        {/* Spar */}
        <section className="flex flex-col rounded-card border border-line-soft bg-surface p-6 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Spar
            </p>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-fg" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 11h6M9 14h3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">
            Sparring ring
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-fg">
            Marcus from next door has sincere questions about the Trinity.
            Hold the conversation, then get the coach&apos;s film review.
          </p>
          <Link href="/spar" className="mt-5">
            <Button variant="outline" className="w-full">
              Start a conversation
            </Button>
          </Link>
        </section>
      </div>

      <section className="mt-10 flex flex-col gap-3 rounded-card border border-line-soft bg-foreground/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Badges
          </h2>
          {badges && badges.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.badge_id}
                  className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                >
                  {(b.badges as { title: string } | null)?.title ?? "Badge"}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-fg">
              None yet — badges are earned, not given. Keep training.
            </p>
          )}
        </div>
        <Link
          href="/tracks"
          className="shrink-0 text-sm font-medium text-accent hover:text-accent-deep"
        >
          Browse all courses →
        </Link>
      </section>
    </main>
  );
}
