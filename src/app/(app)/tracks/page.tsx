import Link from "next/link";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSubject } from "@/lib/site-content";
import {
  COURSES,
  CHECKPOINT_QUIZ_ID,
  completedSlugs,
  isUnlocked,
  missingPrereqs,
  formatCourseNumber,
  type CourseSlug,
} from "@/lib/courses";

export const metadata = { title: "Courses" };

export default async function TracksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: passed } = await supabase
    .from("quiz_attempts")
    .select("quiz_id")
    .eq("user_id", user.id)
    .eq("passed", true);

  const completed = completedSlugs((passed ?? []).map((p) => p.quiz_id as string));

  // Did the user start (read) the Trinity lesson? (for in-progress state)
  const { data: started } = await supabase
    .from("xp_events")
    .select("id")
    .eq("user_id", user.id)
    .eq("reason", "lesson_complete")
    .limit(1);
  const hasStarted = (started?.length ?? 0) > 0;

  const foundations = COURSES.filter((c) => c.tier === "Foundations");
  const engagements = COURSES.filter((c) => c.tier === "Engagements");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
        Your training path
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Courses
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-fg">
        The path is numbered for a reason — each course assumes what came
        before it. Foundations build the case; engagements apply it to a
        worldview. A course unlocks once you&apos;ve completed everything it
        depends on. Finished courses stay open for review forever.
      </p>

      <CourseSection
        label="Foundations"
        blurb="The positive case — what Scripture teaches and why it holds."
        courses={foundations}
        completed={completed}
        hasStarted={hasStarted}
      />
      <CourseSection
        label="Engagements"
        blurb="Apply the foundations to a specific worldview and its playbook."
        courses={engagements}
        completed={completed}
        hasStarted={hasStarted}
      />
    </main>
  );
}

function CourseSection({
  label,
  blurb,
  courses,
  completed,
  hasStarted,
}: {
  label: string;
  blurb: string;
  courses: typeof COURSES;
  completed: Set<CourseSlug>;
  hasStarted: boolean;
}) {
  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold tracking-tight">
        {label}
        <span className="h-px flex-1 bg-line-soft" />
      </h2>
      <p className="mt-1 text-sm text-muted-fg">{blurb}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const subject = getSubject(c.slug);
          const unlocked = isUnlocked(c.slug, completed);
          const done = completed.has(c.slug);
          const playable = c.hasContent && unlocked;
          const missing = missingPrereqs(c.slug, completed);

          const inner = (
            <>
              <div className="flex items-start justify-between">
                <span className="font-display text-sm font-semibold text-accent">
                  {formatCourseNumber(c.number)}
                </span>
                {done ? (
                  <Badge variant="accent">Completed</Badge>
                ) : !c.hasContent ? (
                  <Badge variant="muted">In production</Badge>
                ) : !unlocked ? (
                  <LockBadge />
                ) : (
                  <Badge variant="accent">Open</Badge>
                )}
              </div>
              <h3
                className={
                  "mt-3 font-display text-lg font-semibold tracking-tight " +
                  (playable ? "group-hover:text-accent" : "text-muted-fg")
                }
              >
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">
                {subject?.tagline}
              </p>

              {playable ? (
                <>
                  <Progress
                    value={done ? 100 : hasStarted && c.slug === "trinity" ? 50 : 0}
                    className="mt-4"
                  />
                  <p className="mt-2 text-xs text-muted-fg">
                    {done
                      ? "Complete — review anytime"
                      : hasStarted && c.slug === "trinity"
                        ? "In progress"
                        : "Ready to begin"}
                  </p>
                </>
              ) : (
                <p className="mt-3 border-t border-line-soft pt-3 text-xs leading-relaxed text-muted-fg">
                  {!c.hasContent
                    ? "Content in production."
                    : missing.length > 0
                      ? `Unlocks after: ${missing.map((m) => `${formatCourseNumber(m.number)} ${m.title}`).join(", ")}.`
                      : "Locked."}
                  {subject && (
                    <>
                      {" "}
                      <Link
                        href={`/training/${c.slug}`}
                        className="font-medium text-accent hover:text-accent-deep"
                      >
                        Read the preview →
                      </Link>
                    </>
                  )}
                </p>
              )}
            </>
          );

          if (playable) {
            return (
              <Link
                key={c.slug}
                href={`/tracks/${c.slug}`}
                className="card-interactive group block rounded-card border border-line-soft bg-surface p-5 hover:border-accent/40"
              >
                {inner}
              </Link>
            );
          }
          return (
            <div
              key={c.slug}
              className={
                "rounded-card border p-5 " +
                (c.hasContent
                  ? "border-line-soft bg-surface"
                  : "border-dashed border-line-strong/60 bg-transparent")
              }
            >
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LockBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line-strong px-2.5 py-0.5 text-[0.6875rem] font-medium text-muted-fg">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
        <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3H9V6Z" />
      </svg>
      Locked
    </span>
  );
}
