import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Reveal } from "@/components/ui/reveal";
import { SUBJECTS } from "@/lib/site-content";

const PILLARS = [
  {
    n: "01",
    title: "Learn the doctrine",
    body: "Structured courses move from the claim itself to the strongest objections against it — grounded in Scripture, cited from real scholarship, honest about the other side.",
    href: "/training",
    link: "Browse the training",
  },
  {
    n: "02",
    title: "Memorize the case",
    body: "Spaced-repetition drills move key verses, precise definitions, and full argument skeletons into permanent memory — so the answer is there when the conversation is real.",
    href: "/how-it-works",
    link: "See the method",
  },
  {
    n: "03",
    title: "Spar under pressure",
    body: "Practice live conversations against opponents who push back like real people do — then get coached, bluntly, on where you stood firm and where you slipped.",
    href: "/how-it-works#sparring",
    link: "How sparring works",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-ink text-paper">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_15%_-15%,rgba(77,107,255,0.42),transparent_60%),radial-gradient(46rem_26rem_at_95%_120%,rgba(130,152,255,0.14),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 top-24 hidden select-none font-display text-[13rem] font-semibold leading-none text-paper/[0.035] lg:block"
          >
            WR
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-24 sm:px-10 sm:pb-36 sm:pt-32">
            <Reveal>
              <p className="eyebrow text-gold">Apologetics training for the local church</p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[0.98] tracking-[-0.02em]">
                Train to defend
                <br />
                the faith<span className="text-accent-bright">.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70">
                Learn the doctrine. Memorize the case. Spar under pressure — so
                the next hard question at your door finds you ready, not
                rehearsing regrets in the driveway.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex h-13 items-center rounded-lg bg-accent px-8 py-3.5 text-base font-medium text-white shadow-[0_10px_30px_-8px_rgba(77,107,255,0.7)] transition-all duration-200 hover:bg-accent-deep hover:shadow-[0_12px_34px_-8px_rgba(77,107,255,0.9)] active:scale-[0.97]"
                >
                  Start training — it&apos;s free
                </Link>
                <Link
                  href="/about"
                  className="link-underline inline-flex items-center px-2 py-2 text-base font-medium text-paper/70 transition-colors duration-150 hover:text-paper"
                >
                  Why this exists →
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <figure className="mt-20 max-w-2xl border-l-2 border-accent/50 pl-6">
                <blockquote className="font-display text-xl italic leading-relaxed text-paper/75 sm:text-2xl">
                  “…always being prepared to make a defense to anyone who asks
                  you for a reason for the hope that is in you.”
                </blockquote>
                <figcaption className="mt-3 eyebrow text-gold/80">
                  1 Peter 3:15 · ESV
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ---------- Method (editorial numbered list) ---------- */}
        <section className="border-t border-line-soft">
          <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">
                  Knowing it isn&apos;t the same as being ready.
                </h2>
                <span className="eyebrow text-ink-soft">The method</span>
              </div>
            </Reveal>

            <ol className="mt-14 border-t border-line-soft">
              {PILLARS.map((f, i) => (
                <Reveal key={f.n} delay={i * 100}>
                  <li className="group grid gap-4 border-b border-line-soft py-10 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-8">
                    <span className="font-display text-5xl font-semibold tabular-nums text-accent/25 transition-colors group-hover:text-accent/60">
                      {f.n}
                    </span>
                    <div className="max-w-xl">
                      <h3 className="font-display text-2xl font-semibold tracking-tight">
                        {f.title}
                      </h3>
                      <p className="mt-2.5 text-base leading-relaxed text-ink-soft">
                        {f.body}
                      </p>
                    </div>
                    <Link
                      href={f.href}
                      className="link-underline self-start text-sm font-medium text-accent transition-colors hover:text-accent-deep sm:self-auto"
                    >
                      {f.link} →
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Catalog (editorial index) ---------- */}
        <section className="border-t border-line-soft bg-foreground/[0.025]">
          <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="eyebrow text-ink-soft">The training</span>
                  <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
                    Nine fronts. One faith.
                  </h2>
                </div>
                <Link
                  href="/training"
                  className="link-underline text-sm font-medium text-accent hover:text-accent-deep"
                >
                  Read about every course →
                </Link>
              </div>
            </Reveal>

            <div className="mt-12 border-t border-line-soft">
              {SUBJECTS.slice(0, 6).map((s, i) => (
                <Reveal key={s.slug} delay={(i % 3) * 80}>
                  <Link
                    href={`/training/${s.slug}`}
                    className="group flex items-center justify-between gap-6 border-b border-line-soft py-6 transition-colors hover:bg-foreground/[0.02]"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-display text-sm font-semibold tabular-nums text-ink-soft/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                          {s.title}
                        </h3>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
                          {s.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0">
                      {s.status === "live" ? (
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-accent">
                          Open now
                        </span>
                      ) : (
                        <span className="rounded-full border border-line-soft px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-soft">
                          In production
                        </span>
                      )}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Closing CTA ---------- */}
        <section className="relative overflow-hidden border-t border-line-soft bg-ink text-paper">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_24rem_at_50%_130%,rgba(77,107,255,0.34),transparent_70%)]"
          />
          <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight">
                The questions are coming either way.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-paper/70">
                From your kids, your coworkers, the missionaries at the door.
                Ten minutes a day is the difference between freezing and being
                of use.
              </p>
              <Link
                href="/signup"
                className="mt-9 inline-flex h-13 items-center rounded-lg bg-accent px-8 py-3.5 text-base font-medium text-white shadow-[0_10px_30px_-8px_rgba(77,107,255,0.7)] transition-all duration-200 hover:bg-accent-deep active:scale-[0.97]"
              >
                Begin your first course
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
