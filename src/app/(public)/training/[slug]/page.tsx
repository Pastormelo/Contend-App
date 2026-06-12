import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SUBJECTS, getSubject } from "@/lib/site-content";
import { renderInline } from "@/lib/markdown";

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
        <article className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            <Link href="/training" className="text-accent hover:text-accent-deep">
              The training
            </Link>
            <span aria-hidden>/</span>
            {subject.kind === "doctrine" ? "Doctrine course" : "Engagement course"}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
            {subject.title}
          </h1>
          <p className="mt-3 font-display text-lg italic leading-relaxed text-ink-soft">
            {subject.tagline}
          </p>

          <div className="mt-10 flex flex-col gap-6 border-t border-line-soft pt-10 text-[1.0625rem] leading-[1.8]">
            {subject.article.map((p, i) => (
              <p key={i}>{renderInline(p)}</p>
            ))}
          </div>

          <section className="mt-12 rounded-card border border-line-soft bg-foreground/[0.02] p-7">
            <h2 className="font-display text-lg font-semibold tracking-tight">
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

          <section className="mt-6 rounded-card border border-accent/25 bg-accent/[0.04] p-7">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Watch out for
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
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
                <Link
                  href="/signup"
                  className="mt-2 inline-flex h-11 items-center rounded-lg bg-accent px-7 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
                >
                  Start training free
                </Link>
              </>
            ) : (
              <>
                <p className="font-display text-xl font-semibold tracking-tight">
                  This course is in production.
                </p>
                <p className="max-w-md text-sm leading-relaxed text-ink-soft">
                  Start with an open course now — your training account
                  carries into every course as it releases.
                </p>
                <Link
                  href="/signup"
                  className="mt-2 inline-flex h-11 items-center rounded-lg bg-accent px-7 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
                >
                  Start training free
                </Link>
              </>
            )}
          </div>

          <nav className="mt-14 border-t border-line-soft pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Keep reading
            </p>
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
