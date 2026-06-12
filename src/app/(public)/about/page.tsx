import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "Why Contend Exists",
  description:
    "The philosophy behind Contend: why ordinary Christians need real apologetics training, and how a training method differs from a library.",
};

const AFFIRMATIONS = [
  "The Scriptures of the Old and New Testaments are the inspired, authoritative Word of God.",
  "There is one God, eternally existing in three persons: Father, Son, and Holy Spirit.",
  "Jesus Christ is fully God and fully man — conceived of the Spirit, born of the virgin Mary, crucified for sinners, bodily risen, and returning.",
  "Salvation is by grace alone, through faith alone, in Christ alone.",
  "The defense of the faith is the calling of every believer, not a specialty for scholars (1 Pet 3:15; Jude 3).",
  "Apologetics without love is noise. The goal of every argument is the good of the person in front of you (1 Cor 13:1).",
];

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Why Contend exists
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
            The church is full of believers who freeze.
          </h1>

          <div className="prose-contend mt-10 flex flex-col gap-6 text-[1.0625rem] leading-[1.8]">
            <p>
              <span className="float-left mr-3 mt-1 font-display text-6xl font-semibold leading-[0.8] text-accent">
                S
              </span>
              ooner or later it happens to every Christian. A coworker asks why
              a good God allows suffering. A son asks how Jesus can be God if
              he prayed to God. Two polite missionaries at the door explain
              that the Trinity was invented by an emperor. And the believer —
              who loves Christ sincerely, who has sat under years of faithful
              preaching — freezes, mumbles, changes the subject, and spends
              the drive home rehearsing what they should have said.
            </p>
            <p>
              The problem is not a lack of information. We live in the golden
              age of apologetics content: books, debates, podcasts, lectures —
              more than any generation of Christians has ever had. The problem
              is that <em>information does not survive pressure</em>. Nobody
              learns to box by watching boxing. Under stress, you do not rise
              to the occasion; you fall to the level of your training — and
              most Christians have never trained at all.
            </p>
            <p>
              Contend is built on that distinction. It is not a library; it is
              a gym. Every course runs the same circuit:{" "}
              <strong>learn</strong> the doctrine in plain language,{" "}
              <strong>memorize</strong> the verses and arguments until they
              are reflexes, <strong>drill</strong> against timed objections,
              and <strong>spar</strong> against simulated opponents — a
              curious neighbor, a trained Witness, a sharp skeptic — who push
              back the way real people push back. Then a coach reviews the
              film: where you stood firm, where you drifted, what you should
              have said. Honestly. Scores here are earned, not given.
            </p>
            <p>
              We train with both eyes open. You will read the{" "}
              <em>strongest</em> version of every objection — steelmanned, the
              way its smartest advocates put it — because training against
              strawmen produces Christians who lose to real people. And you
              will train tone as seriously as content, because Peter attached
              a manner to the mandate: <em>with gentleness and respect</em>.
              Winning the argument and losing the person is a loss.
            </p>
            <p>
              The name comes from Jude, who wanted to write about a shared
              salvation and found he had to write something more urgent
              instead: <em>contend for the faith that was once for all
              delivered to the saints</em>. The word he chose is an athlete&apos;s
              word — agonize, strain, train. That is the invitation. Not to
              become an academic. To become <em>useful</em> — to your kids,
              your church, your neighbor, and the person God puts in front of
              you next.
            </p>
          </div>

          <section id="affirms" className="mt-16 scroll-mt-24">
            <div className="rounded-card border border-line-soft bg-foreground/[0.02] p-7">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                What Contend affirms
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Every lesson, drill, and coached review on this platform is
                built inside these convictions:
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {AFFIRMATIONS.map((a, i) => (
                  <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                    <span className="mt-0.5 font-display font-semibold text-accent">
                      {i + 1}.
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="mt-14 flex flex-col items-center gap-3 border-t border-line-soft pt-10 text-center">
            <p className="font-display text-xl font-semibold tracking-tight">
              Ready to stop rehearsing regrets?
            </p>
            <Link
              href="/signup"
              className="mt-2 inline-flex h-11 items-center rounded-lg bg-accent px-7 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Start your first course
            </Link>
            <Link
              href="/training"
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              or read about the training first →
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
