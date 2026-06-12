import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
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
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(122,46,46,0.07),transparent_70%)]"
          />
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pb-28 sm:pt-32">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Apologetics training for the local church
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.06] tracking-tight">
              Train to defend
              <br />
              the faith.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
              Learn the doctrine. Memorize the case. Spar under pressure — so
              the next hard question at your door finds you ready, not
              rehearsing regrets in the driveway.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center rounded-lg bg-accent px-8 text-base font-medium text-white shadow-sm transition-colors duration-150 hover:bg-accent-deep"
              >
                Start training — it&apos;s free
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center px-2 text-base font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
              >
                Why this exists →
              </Link>
            </div>
            <p className="mt-14 border-t border-line-soft pt-8 font-display text-[1.0625rem] italic leading-relaxed text-ink-soft">
              “…always being prepared to make a defense to anyone who asks you
              for a reason for the hope that is in you; yet do it with
              gentleness and respect.”
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
              1 Peter 3:15 · ESV
            </p>
          </div>
        </section>

        {/* Three pillars */}
        <section className="border-t border-line-soft bg-foreground/[0.02]">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
              The method
            </p>
            <h2 className="mt-3 text-center font-display text-3xl font-semibold tracking-tight">
              Knowing it isn&apos;t the same as being ready.
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {PILLARS.map((f) => (
                <div
                  key={f.n}
                  className="group flex flex-col rounded-card border border-line-soft bg-surface p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
                >
                  <span className="font-display text-sm font-semibold text-accent">
                    {f.n}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {f.body}
                  </p>
                  <Link
                    href={f.href}
                    className="mt-5 text-sm font-medium text-accent transition-colors group-hover:text-accent-deep"
                  >
                    {f.link} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog strip */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
                The training
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                Nine fronts. One faith.
              </h2>
            </div>
            <Link
              href="/training"
              className="text-sm font-medium text-accent hover:text-accent-deep"
            >
              Read about every course →
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/training/${s.slug}`}
                className="group rounded-card border border-line-soft bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    {s.kind === "doctrine" ? "Doctrine" : "Engagement"}
                  </span>
                  {s.status === "live" ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-accent">
                      Open now
                    </span>
                  ) : (
                    <span className="rounded-full border border-line-soft px-2 py-0.5 text-[0.6875rem] font-medium text-ink-soft">
                      In production
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight group-hover:text-accent">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {s.tagline}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-line-soft">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-20 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              The questions are coming either way.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
              From your kids, your coworkers, the missionaries at the door.
              Ten minutes a day is the difference between freezing and being
              of use.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center rounded-lg bg-accent px-8 text-base font-medium text-white shadow-sm transition-colors duration-150 hover:bg-accent-deep"
            >
              Begin your first course
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
