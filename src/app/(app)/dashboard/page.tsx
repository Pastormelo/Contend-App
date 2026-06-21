import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Kicker, Meta, SectionHeading } from "@/components/ui/editorial";

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

  const { data: intake } = await supabase
    .from("intake_attempts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);
  const hasPlacement = (intake?.length ?? 0) > 0;

  const firstName = (profile?.name ?? "Defender").split(" ")[0];
  const lessonRead = (lessonXp?.length ?? 0) > 0;
  const quizPassed = (passedAttempt?.length ?? 0) > 0;
  const lessonProgress = quizPassed ? 100 : lessonRead ? 50 : 0;
  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  const deskBtn = (
    href: string,
    label: string,
    variant: "primary" | "outline",
    disabled = false,
  ) => (
    <Link href={href} className="mt-2.5 inline-block">
      <Button size="sm" variant={variant} disabled={disabled}>
        {label}
      </Button>
    </Link>
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      {/* Masthead */}
      <Meta items={[today, "Today's training"]} />
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.04] tracking-tight">
        {greetingFor(new Date().getHours())}, {firstName}.
      </h1>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-fg">
        Ten focused minutes — here&apos;s what&apos;s ready for you today.
      </p>
      <div className="mt-6 border-t border-line-soft" />

      {/* Bulletin */}
      {!hasPlacement && (
        <Link
          href="/assessment"
          className="group mt-6 flex items-center justify-between gap-4 border-l-2 border-accent bg-accent/[0.05] px-5 py-4 transition-colors hover:bg-accent/[0.08]"
        >
          <span>
            <Kicker>New reader</Kicker>
            <span className="mt-1 block font-display text-lg font-semibold tracking-tight">
              Not sure where to start?
            </span>
            <span className="mt-0.5 block text-sm leading-relaxed text-muted-fg">
              Take the 5-minute placement assessment — we&apos;ll read your
              footing and point you to the right course on the path.
            </span>
          </span>
          <span
            aria-hidden
            className="shrink-0 font-display text-xl text-accent transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      )}

      {/* Lead story + desk rail */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Lead: current lesson */}
        <article className="flex flex-col">
          <Kicker>{quizPassed ? "Course complete" : "Today's lesson"}</Kicker>
          <h2 className="mt-2 font-display text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold leading-[1.08] tracking-tight">
            {lesson?.title}
          </h2>
          <Meta
            className="mt-3"
            items={["The Trinity", "Level 1", `${lesson?.est_minutes} min read`]}
          />
          <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-muted-fg">
            {quizPassed
              ? "You've finished the flagship lesson and passed its checkpoint. Keep it sharp in review, or read it again."
              : lessonRead
                ? "You've read it. Now prove it on the checkpoint — eight questions, graded honestly."
                : "The flagship lesson: one God, three persons. What the Trinity is, what it isn't, and why it isn't a contradiction."}
          </p>
          <Progress value={lessonProgress} className="mt-5 max-w-md" />
          <div className="mt-5">
            <Link
              href={
                lessonRead && !quizPassed
                  ? `/learn/${LESSON_ID}/quiz`
                  : `/learn/${LESSON_ID}`
              }
            >
              <Button variant={quizPassed ? "outline" : "primary"} size="lg">
                {quizPassed
                  ? "Read again"
                  : lessonRead
                    ? "Take the checkpoint"
                    : "Start reading"}
              </Button>
            </Link>
          </div>
        </article>

        {/* Up next */}
        <aside>
          <h2 className="eyebrow text-foreground">Up next</h2>
          <div className="mt-3 flex flex-col gap-3">
            <div className="rounded-card border border-line-soft bg-surface p-4">
              <Kicker>Memory</Kicker>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  Review queue
                </h3>
                {dueCount ? (
                  <span className="font-display text-2xl font-semibold tabular-nums text-accent">
                    {dueCount}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-fg">
                {dueCount
                  ? `card${dueCount === 1 ? "" : "s"} due — clear them to keep the case sharp.`
                  : "Nothing due yet. Finish a lesson to load its cards."}
              </p>
              {deskBtn(
                "/review",
                dueCount ? "Start review" : "Queue clear",
                dueCount ? "primary" : "outline",
                !dueCount,
              )}
            </div>

            <div className="rounded-card border border-line-soft bg-surface p-4">
              <Kicker>Drill</Kicker>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
                Drill of the day
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-fg">
                One objection, 90 seconds, your own words — then an honest score
                and a stronger answer.
              </p>
              {deskBtn("/respond", "Take the drill", "outline")}
            </div>

            <div className="rounded-card border border-line-soft bg-surface p-4">
              <Kicker>Spar</Kicker>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
                Sparring ring
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-fg">
                Marcus next door has sincere questions. Hold the conversation,
                then get the coach&apos;s film review.
              </p>
              {deskBtn("/spar", "Start a conversation", "outline")}
            </div>
          </div>
        </aside>
      </div>

      {/* Honors */}
      <section className="mt-12">
        <SectionHeading label="Your badges" action="All courses" actionHref="/tracks" />
        {badges && badges.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
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
          <p className="mt-3 text-sm text-muted-fg">
            None yet — badges are earned, not given. Keep training.
          </p>
        )}
      </section>
    </main>
  );
}
