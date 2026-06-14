import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SUBJECTS } from "@/lib/site-content";
import { course, formatCourseNumber } from "@/lib/courses";

export const metadata = {
  title: "The Training Catalog",
  description:
    "Ten courses on a numbered path — from the existence of God and the Trinity to engaging Roman Catholicism, Islam, Mormonism, and more. Each course builds on the last.",
};

const byNumber = (a: (typeof SUBJECTS)[number], b: (typeof SUBJECTS)[number]) =>
  (course(a.slug)?.number ?? 99) - (course(b.slug)?.number ?? 99);

export default function TrainingCatalogPage() {
  const doctrine = SUBJECTS.filter((s) => s.kind === "doctrine").sort(byNumber);
  const engagement = SUBJECTS.filter((s) => s.kind === "engagement").sort(byNumber);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            The training
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
            Ten courses. One path. Each builds on the last.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            The path is numbered for a reason.{" "}
            <strong className="text-ink">Foundations (1–5)</strong> build the
            positive case — what Scripture teaches and why it holds.{" "}
            <strong className="text-ink">Engagements (6–10)</strong> apply that
            case to a specific worldview, and each one requires the doctrine it
            leans on: you don&apos;t engage Islam before you can defend the
            deity of Christ. Each article below previews a course. Read them
            free; start where you&apos;re ready.
          </p>

          <h2 className="mt-14 flex items-center gap-3 font-display text-xl font-semibold tracking-tight">
            Foundations
            <span className="h-px flex-1 bg-line-soft" />
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {doctrine.map((s) => (
              <SubjectCard key={s.slug} subject={s} />
            ))}
          </div>

          <h2 className="mt-14 flex items-center gap-3 font-display text-xl font-semibold tracking-tight">
            Engagements
            <span className="h-px flex-1 bg-line-soft" />
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {engagement.map((s) => (
              <SubjectCard key={s.slug} subject={s} />
            ))}
          </div>

          <p className="mt-14 rounded-card border border-line-soft bg-foreground/[0.02] p-6 text-sm leading-relaxed text-ink-soft">
            <strong className="text-ink">How the path unlocks:</strong> begin
            with any foundation that has no prerequisite. Complete a course —
            its lessons, memory work, and checkpoint — and the courses that
            depend on it open up. Engagements stay locked until you can defend
            the doctrine underneath them. Courses you finish stay open forever
            for review.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SubjectCard({
  subject: s,
}: {
  subject: (typeof SUBJECTS)[number];
}) {
  return (
    <Link
      href={`/training/${s.slug}`}
      className="group flex flex-col rounded-card border border-line-soft bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
          Course {formatCourseNumber(course(s.slug)?.number ?? 0)} ·{" "}
          {s.kind === "doctrine" ? "Foundation" : "Engagement"}
        </span>
        {s.status === "live" ? (
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-accent">
            Open now
          </span>
        ) : (
          <span className="rounded-full border border-line-soft px-2.5 py-0.5 text-[0.6875rem] font-medium text-ink-soft">
            In production
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
        {s.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {s.tagline}
      </p>
      <span className="mt-4 text-sm font-medium text-accent">
        Read the preview →
      </span>
    </Link>
  );
}
