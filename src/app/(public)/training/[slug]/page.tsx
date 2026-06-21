import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/editorial";
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import { SUBJECTS, getSubject } from "@/lib/site-content";
import { renderInline } from "@/lib/markdown";

const SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "outcomes", label: "Outcomes" },
  { id: "traps", label: "The traps" },
];

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const subject = getSubject((await params).slug);
  if (!subject) return {};
  return { title: subject.title, description: subject.tagline };
}

export default async function SubjectPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const subject = getSubject((await params).slug);
  if (!subject) notFound();

  const others = SUBJECTS.filter((s) => s.slug !== subject.slug).slice(0, 3);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Header */}
        <div className="mx-auto w-full max-w-2xl px-6 pt-16 sm:pt-20">
          <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-fg">
            <Link href="/training" className="link-underline text-accent">
              The training
            </Link>
            <span aria-hidden className="text-muted-fg/40">/</span>
            {subject.kind === "doctrine" ? "Doctrine course" : "Engagement course"}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
            {subject.title}
          </h1>
          <p className="mt-3 font-display text-lg italic leading-relaxed text-muted-fg">
            {subject.tagline}
          </p>
        </div>

        <SectionNav sections={SECTIONS} />

        <article className="mx-auto w-full max-w-2xl px-6 pb-16 sm:pb-20">
          {/* Overview */}
          <section id="overview" className="scroll-mt-[10rem] pt-12">
            <div className="flex flex-col gap-6 text-[1.0625rem] leading-[1.8]">
              {subject.article.map((p, i) => (
                <p key={i}>{renderInline(p)}</p>
              ))}
            </div>
          </section>

          {/* Outcomes */}
          <section
            id="outcomes"
            className="mt-12 scroll-mt-[10rem] rounded-card border border-line-soft bg-surface p-7"
          >
            <Kicker tone="brass">Outcomes</Kicker>
            <h2 className="mt-2 font-display text-lg font-semibold tracking-tight">
              What the full course trains into you
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {subject.equipped.map((e, i) => (
                <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <span aria-hidden className="mt-0.5 font-semibold text-accent">✓</span>
                  {e}
                </li>
              ))}
            </ul>
          </section>

          {/* The traps */}
          <section
            id="traps"
            className="mt-6 scroll-mt-[10rem] rounded-card border border-accent/25 bg-accent/[0.04] p-7"
          >
            <Kicker>Watch out for</Kicker>
            <h2 className="mt-2 font-display text-lg font-semibold tracking-tight">
              The traps in this conversation
            </h2>
            <p className="mt-1 text-sm text-muted-fg">
              Traps this conversation is known for — the course drills all of them.
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {subject.watchFor.map((w, i) => (
                <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <span aria-hidden className="mt-0.5 font-semibold text-accent">⚠</span>
                  {w}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 flex flex-col items-center gap-3 rounded-card border border-line-soft bg-surface p-8 text-center">
            {subject.status === "live" ? (
              <>
                <p className="font-display text-xl font-semibold tracking-tight">
                  This course is open now.
                </p>
                <Link href="/signup" className="mt-2 inline-block">
                  <Button size="lg">Start training free</Button>
                </Link>
              </>
            ) : (
              <>
                <p className="font-display text-xl font-semibold tracking-tight">
                  This course is in production.
                </p>
                <p className="max-w-md text-sm leading-relaxed text-muted-fg">
                  Start with an open course now — your training account carries
                  into every course as it releases.
                </p>
                <Link href="/signup" className="mt-2 inline-block">
                  <Button size="lg">Start training free</Button>
                </Link>
              </>
            )}
          </div>

          <nav className="mt-14 border-t border-line-soft pt-8">
            <Kicker tone="muted">Keep reading</Kicker>
            <div className="mt-4 flex flex-col gap-2">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={`/training/${s.slug}`}
                  className="text-sm font-medium text-accent hover:text-accent-deep"
                >
                  {s.title} — {s.tagline}
                </Link>
              ))}
            </div>
          </nav>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
