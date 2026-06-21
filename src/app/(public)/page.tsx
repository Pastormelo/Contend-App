import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Reveal } from "@/components/ui/reveal";
import { Kicker, Meta, SectionHeading } from "@/components/ui/editorial";
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
        {/* ---------- Masthead lead ---------- */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
            <Reveal>
              <Kicker tone="brass">Apologetics training for the local church</Kicker>
            </Reveal>
            <div className="mt-6 grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-end">
              <div>
                <Reveal delay={80}>
                  <h1 className="font-display text-[clamp(2.75rem,8vw,5.75rem)] font-semibold leading-[0.98] tracking-tight">
                    Train to defend the faith.
                  </h1>
                </Reveal>
                <Reveal delay={160}>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-fg">
                    Learn the doctrine. Memorize the case. Spar under pressure —
                    so the next hard question at your door finds you ready, not
                    rehearsing regrets in the driveway.
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <Link
                      href="/signup"
                      className="inline-flex h-12 items-center rounded-lg bg-accent px-8 text-base font-medium text-white shadow-[0_10px_30px_-8px_rgba(29,78,216,0.5)] transition-all duration-200 hover:bg-accent-deep active:scale-[0.97]"
                    >
                      Start training — it&apos;s free
                    </Link>
                    <Link
                      href="/about"
                      className="link-underline text-base font-medium text-accent"
                    >
                      Why this exists →
                    </Link>
                  </div>
                </Reveal>
              </div>
              <Reveal delay={320}>
                <figure className="border-l-2 border-accent pl-6">
                  <blockquote className="font-display text-xl italic leading-relaxed text-foreground sm:text-[1.6rem] sm:leading-[1.4]">
                    “…always being prepared to make a defense to anyone who asks
                    you for a reason for the hope that is in you.”
                  </blockquote>
                  <figcaption className="mt-4">
                    <Meta items={["1 Peter 3:15", "ESV"]} />
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- The method (numbered) ---------- */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
            <Reveal>
              <SectionHeading label="The method" />
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight">
                Knowing it isn&apos;t the same as being ready.
              </h2>
            </Reveal>

            <ol className="mt-12 border-t border-line-soft">
              {PILLARS.map((f, i) => (
                <Reveal key={f.n} delay={i * 100}>
                  <li className="group grid gap-4 border-b border-line-soft py-9 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline sm:gap-8">
                    <span className="font-display text-4xl font-semibold tabular-nums text-accent/30 transition-colors group-hover:text-accent/60 sm:text-5xl">
                      {f.n}
                    </span>
                    <div className="max-w-xl">
                      <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                        {f.title}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-muted-fg">
                        {f.body}
                      </p>
                    </div>
                    <Link
                      href={f.href}
                      className="link-underline self-start text-sm font-medium text-accent sm:self-auto"
                    >
                      {f.link} →
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- The training (news index) ---------- */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
            <Reveal>
              <SectionHeading
                label="The training"
                action="Read about every course"
                actionHref="/training"
              />
              <h2 className="mt-5 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight">
                Nine fronts. One faith.
              </h2>
            </Reveal>

            <div className="mt-10 border-t border-line-soft">
              {SUBJECTS.slice(0, 6).map((s, i) => (
                <Reveal key={s.slug} delay={(i % 3) * 80}>
                  <Link
                    href={`/training/${s.slug}`}
                    className="group flex items-baseline gap-5 border-b border-line-soft py-6 transition-colors hover:bg-foreground/[0.02]"
                  >
                    <span className="font-display text-2xl font-semibold tabular-nums text-accent/40 sm:text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Meta items={[s.kind === "doctrine" ? "Doctrine" : "Engagement", s.status === "live" ? "Open now" : "In production"]} />
                      <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                        {s.title}
                      </h3>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-fg">
                        {s.tagline}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="hidden shrink-0 self-center font-display text-xl text-muted-fg transition-transform group-hover:translate-x-1 group-hover:text-accent sm:block"
                    >
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- What we believe (short) ---------- */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <Reveal>
                <SectionHeading label="What we believe" />
                <h2 className="mt-5 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight">
                  Historic, biblical, Trinitarian.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lg leading-relaxed text-muted-fg">
                  One God in three persons. Jesus Christ — fully God and fully
                  man — crucified for sinners and risen bodily. Salvation by
                  grace alone, through faith alone, in Christ alone, with
                  Scripture as the final authority.
                </p>
                <Link
                  href="/beliefs"
                  className="link-underline mt-5 inline-block text-base font-medium text-accent"
                >
                  Read what we believe →
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Closing CTA (the single dark band) ---------- */}
        <section className="relative overflow-hidden bg-ink text-paper">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_24rem_at_50%_130%,rgba(29,78,216,0.4),transparent_70%)]"
          />
          <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight">
                The questions are coming either way.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-paper/70">
                From your kids, your coworkers, the missionaries at the door. Ten
                minutes a day is the difference between freezing and being of use.
              </p>
              <Link
                href="/signup"
                className="mt-9 inline-flex h-12 items-center rounded-lg bg-accent px-8 text-base font-medium text-white shadow-[0_10px_30px_-8px_rgba(29,78,216,0.7)] transition-all duration-200 hover:bg-accent-deep active:scale-[0.97]"
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
