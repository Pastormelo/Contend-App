import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSubject } from "@/lib/site-content";
import { Kicker, SectionHeading } from "@/components/ui/editorial";
import { cn } from "@/lib/utils";
import {
  COURSES,
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
      <Kicker>The training path</Kicker>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight">
        Courses
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-fg">
        The path is numbered for a reason — each course builds on the ones before
        it. Finish a course to unlock what depends on it. Completed courses stay
        open for review.
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
        blurb="Applying the foundations to a specific worldview and its playbook."
        courses={engagements}
        completed={completed}
        hasStarted={hasStarted}
      />
    </main>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Open: "bg-accent/10 text-accent",
    Completed: "bg-gold/15 text-gold",
    Locked: "border border-line-strong text-muted-fg",
    "In production": "border border-line-soft text-muted-fg",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
        styles[status],
      )}
    >
      {status}
    </span>
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
      <SectionHeading label={label} />
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
        {blurb}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const subject = getSubject(c.slug);
          const unlocked = isUnlocked(c.slug, completed);
          const done = completed.has(c.slug);
          const playable = c.hasContent && unlocked;
          const missing = missingPrereqs(c.slug, completed);
          const status = done
            ? "Completed"
            : !c.hasContent
              ? "In production"
              : !unlocked
                ? "Locked"
                : "Open";

          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-accent">
                  {formatCourseNumber(c.number)}
                </span>
                <StatusPill status={status} />
              </div>
              <h3
                className={cn(
                  "mt-3 font-display text-lg font-semibold tracking-tight",
                  playable ? "transition-colors group-hover:text-accent" : "text-muted-fg",
                )}
              >
                {c.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-fg">
                {subject?.tagline}
              </p>
              {playable ? (
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {done
                    ? "Review course"
                    : hasStarted && c.slug === "trinity"
                      ? "Continue"
                      : "Start course"}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              ) : (
                <p className="mt-4 border-t border-line-soft pt-3 text-xs leading-relaxed text-muted-fg">
                  {!c.hasContent
                    ? "Content in production."
                    : missing.length > 0
                      ? `Unlocks after ${missing
                          .map((m) => `${formatCourseNumber(m.number)} ${m.title}`)
                          .join(", ")}.`
                      : "Locked."}
                  {subject && (
                    <>
                      {" "}
                      <Link
                        href={`/training/${c.slug}`}
                        className="font-medium text-accent hover:text-accent-deep"
                      >
                        Preview →
                      </Link>
                    </>
                  )}
                </p>
              )}
            </>
          );

          const cardClass =
            "flex flex-col rounded-card border border-line-soft bg-surface p-5";

          return playable ? (
            <Link
              key={c.slug}
              href={`/tracks/${c.slug}`}
              className={cn("card-interactive group hover:border-accent/40", cardClass)}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={c.slug}
              className={cn(
                cardClass,
                !c.hasContent && "border-dashed bg-transparent",
              )}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
