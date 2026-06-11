import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {greetingFor(new Date().getHours())}, {firstName}.
      </h1>
      <p className="mt-2 text-sm text-muted-fg">
        Today&apos;s training is ready.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Review queue</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-fg">
              {dueCount && dueCount > 0 ? (
                <>
                  <span className="font-display text-3xl font-semibold text-foreground">
                    {dueCount}
                  </span>{" "}
                  card{dueCount === 1 ? "" : "s"} due
                </>
              ) : (
                "Nothing due. Complete a lesson to seed your deck."
              )}
            </p>
            <Link href="/review">
              <Button className="w-full" disabled={!dueCount}>
                Start review
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{quizPassed ? "Completed" : "Resume"}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium">{lesson?.title}</p>
              <p className="mt-1 text-xs text-muted-fg">
                The Trinity · Level 1 · ~{lesson?.est_minutes} min
              </p>
              <Progress value={lessonProgress} className="mt-3" />
            </div>
            <Link href={`/learn/${LESSON_ID}`}>
              <Button variant={quizPassed ? "outline" : "primary"} className="w-full">
                {quizPassed ? "Read again" : lessonRead ? "Take the quiz" : "Continue"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drill of the day</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-fg">
              Someone has an objection. You have 90 seconds. Answer well.
            </p>
            <Link href="/respond">
              <Button variant="outline" className="w-full">
                Take the drill
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Recent badges
        </h2>
        {badges && badges.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
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
            No badges yet — they&apos;re earned, not given. Keep training.
          </p>
        )}
      </section>

      <section className="mt-10">
        <Link
          href="/tracks"
          className="text-sm font-medium text-accent hover:text-accent-deep"
        >
          Browse all tracks →
        </Link>
      </section>
    </main>
  );
}
