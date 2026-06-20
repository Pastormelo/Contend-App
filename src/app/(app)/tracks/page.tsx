import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSubject } from "@/lib/site-content";
import { Kicker, Meta, SectionHeading, Rank } from "@/components/ui/editorial";
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
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-fg">
        The path is numbered for a reason — each course assumes what came before
        it. Foundations build the case; engagements apply it to a worldview. A
        course unlocks once you&apos;ve completed what it depends on, and
        finished courses stay open for review.
      </p>
      <div className="mt-6 border-t-2 border-foreground/80" />

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
      <SectionHeading label={label} />
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
        {blurb}
      </p>

      <div className="mt-6 border-t border-line-soft">
        {courses.map((c) => {
          const subject = getSubject(c.slug);
          const unlocked = isUnlocked(c.slug, completed);
          const done = completed.has(c.slug);
          const playable = c.hasContent && unlocked;
          const missing = missingPrereqs(c.slug, completed);
          const kind = subject?.kind === "engagement" ? "Engagement" : "Doctrine";
          const status = done
            ? "Completed"
            : !c.hasContent
              ? "In production"
              : !unlocked
                ? "Locked"
                : "Open";

          const inner = (
            <>
              <Rank n={c.number} />
              <div className="min-w-0 flex-1">
                <Meta items={[kind, status]} />
                <h3
                  className={cn(
                    "mt-1.5 font-display text-xl font-semibold tracking-tight sm:text-2xl",
                    playable
                      ? "transition-colors group-hover:text-accent"
                      : "text-muted-fg",
                  )}
                >
                  {c.title}
                </h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-fg">
                  {subject?.tagline}
                </p>
                {playable ? (
                  <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent/80">
                    {done
                      ? "Complete • review anytime"
                      : hasStarted && c.slug === "trinity"
                        ? "In progress"
                        : "Ready to begin"}
                  </p>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-muted-fg">
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
                          Read the preview →
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </div>
              {playable && (
                <span
                  aria-hidden
                  className="hidden shrink-0 self-center font-display text-xl text-muted-fg transition-transform group-hover:translate-x-1 group-hover:text-accent sm:block"
                >
                  →
                </span>
              )}
            </>
          );

          const rowClass =
            "flex items-baseline gap-4 border-b border-line-soft py-6 sm:gap-6";

          return playable ? (
            <Link
              key={c.slug}
              href={`/tracks/${c.slug}`}
              className={cn("group transition-colors hover:bg-foreground/[0.02]", rowClass)}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={c.slug}
              className={cn(rowClass, !c.hasContent && "opacity-70")}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
