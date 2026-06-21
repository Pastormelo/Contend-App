import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Kicker, SectionHeading } from "@/components/ui/editorial";
import {
  POSTURE,
  LEAD,
  AFFIRMATIONS,
  DOCTRINES,
  GUARDRAILS,
  WHY_CREEDS,
  CREEDS,
  SOLAS,
  NON_DENOM,
} from "@/lib/beliefs";

export const metadata = {
  title: "What We Believe",
  description:
    "The doctrinal foundation of Witness Ready: historic, biblical, Trinitarian Christianity, consistent with the Apostles', Nicene, Chalcedonian, and Athanasian creeds.",
};

export default function BeliefsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Header + lead confession */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
            <Kicker>What we believe</Kicker>
            <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
              The faith we train you to defend.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-fg">{POSTURE}</p>
            <div className="mt-8 flex flex-col gap-5 border-l-2 border-accent pl-6">
              {LEAD.map((p, i) => (
                <p key={i} className="font-display text-lg italic leading-[1.7] text-foreground">
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-fg">
              We confess this faith together with the Apostles&apos;, Nicene,
              Chalcedonian, and Athanasian creeds — not above Scripture, but as
              faithful summaries of it.
            </p>
          </div>
        </section>

        {/* What we affirm */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8">
            <SectionHeading label="What we affirm" />
            <ol className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {AFFIRMATIONS.map((a, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-display text-lg font-semibold tabular-nums text-accent/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold tracking-tight">
                      {a.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-fg">
                      {a.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* By doctrine */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <SectionHeading label="By doctrine" />
            <div className="mt-10 flex flex-col gap-14">
              {DOCTRINES.map((d) => (
                <article key={d.id} id={d.id} className="scroll-mt-24">
                  <Kicker>{d.kicker}</Kicker>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {d.title}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4">
                    {d.statement.map((p, i) => (
                      <p
                        key={i}
                        className="font-display text-[1.125rem] leading-[1.75]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-fg">
                      Scripture
                    </span>
                    {d.scriptures.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line-soft px-2.5 py-0.5 text-xs text-muted-fg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Guarding the lines */}
        <section className="border-b border-line-soft bg-foreground/[0.02]">
          <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <SectionHeading label="Guarding the lines" />
            <p className="mt-4 text-base leading-relaxed text-muted-fg">
              Precision is the point — most attacks on the faith are really
              attacks on a distortion of it. Here is what these doctrines are
              <em> not</em>.
            </p>
            <ul className="mt-8 flex flex-col gap-5">
              {GUARDRAILS.map((g, i) => (
                <li
                  key={i}
                  className="grid gap-3 rounded-card border border-line-soft bg-surface p-5 sm:grid-cols-2 sm:gap-6"
                >
                  <p className="text-sm leading-relaxed text-muted-fg">
                    <span className="mr-1 font-semibold uppercase tracking-wide text-muted-fg/70">
                      Not:
                    </span>
                    {g.wrong}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground sm:border-l sm:border-line-soft sm:pl-6">
                    <span className="mr-1 font-semibold uppercase tracking-wide text-accent">
                      But:
                    </span>
                    {g.right}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why the creeds */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <SectionHeading label="Why the creeds" />
            <div className="mt-6 flex flex-col gap-4">
              {WHY_CREEDS.map((p, i) => (
                <p key={i} className="text-[1.0625rem] leading-relaxed text-muted-fg">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Doctrinal standards */}
        <section className="border-b border-line-soft">
          <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <SectionHeading label="Doctrinal standards" />
            <p className="mt-4 text-base leading-relaxed text-muted-fg">
              We affirm the four historic ecumenical creeds as faithful
              summaries of biblical teaching:
            </p>
            <ul className="mt-6 divide-y divide-line-soft border-y border-line-soft">
              {CREEDS.map((c) => (
                <li key={c.name} className="py-4">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    {c.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-fg">
                    {c.note}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[1.0625rem] font-medium leading-relaxed">
              {SOLAS}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-fg">{NON_DENOM}</p>
          </div>
        </section>

        {/* Closing */}
        <section className="bg-ink text-paper">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              This is the faith. Now learn to defend it.
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-paper/70">
              Every lesson, drill, and sparring session on this platform is built
              inside these convictions.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-flex h-12 items-center rounded-lg bg-accent px-8 text-base font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Start training
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
