import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Kicker, SectionHeading } from "@/components/ui/editorial";

export const metadata = {
  title: "How Training Works",
  description:
    "The Witness Ready method: lessons, spaced-repetition memory, timed drills, sparring simulations, honest coaching, XP, streaks, and levels — explained.",
};

const LOOP = [
  {
    step: "Learn",
    body: "Each course is built from focused lessons — the doctrine in plain language, the key passages with their context, the strongest objections steelmanned, and the exact sentences worth saying out loud. Tap any scripture reference to read it in place; tap any technical term for a full definition.",
  },
  {
    step: "Memorize",
    body: "Finishing a lesson loads its verses, definitions, and argument outlines into your review queue as flashcards. Each card comes back on a schedule tuned to your memory: get it right and the gap grows — one day, three, seven, thirty. Struggle, and it returns tomorrow. Ten minutes a day moves the whole case into permanent memory.",
  },
  {
    step: "Drill",
    body: "The daily drill throws a real objection at you — “you worship three gods”, “the word Trinity isn't in the Bible” — and gives you 90 seconds to answer in writing, the way you'd have to in a hallway. A coach scores it on five criteria and shows you a stronger answer.",
  },
  {
    step: "Spar",
    body: "Simulated opponents hold full conversations with you — a curious neighbor, and at higher difficulty a trained Witness or a sharp skeptic. They push back like real people: one sincere question at a time, unconvinced by weak answers. End the conversation and a coach reviews the film.",
  },
];

const SCORING = [
  { label: "Biblical accuracy", body: "Are your claims true to Scripture, with texts used in context?" },
  { label: "Logic & structure", body: "Is the argument ordered and valid? Are your distinctions precise?" },
  { label: "Steelman integrity", body: "Did you answer the strongest form of the objection, or a convenient one?" },
  { label: "Persuasive clarity", body: "Would a real person follow it, remember it, repeat it?" },
  { label: "Tone in context", body: "Firm is fine. Contempt is not. Gentleness that surrenders nothing scores highest." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
          <Kicker>How it works</Kicker>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-tight">
            A gym, not a library.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-fg">
            Reading about apologetics makes you informed. Training makes you
            ready. Every Witness Ready course runs the same four-part circuit, and
            everything you do is measured — honestly.
          </p>

          {/* The loop */}
          <SectionHeading label="The circuit" className="mt-14" />
          <section className="mt-6 flex flex-col gap-5">
            {LOOP.map((item, i) => (
              <div
                key={item.step}
                id={item.step === "Spar" ? "sparring" : undefined}
                className="flex gap-5 rounded-card border border-line-soft bg-surface p-6"
              >
                <span className="font-display text-2xl font-semibold text-accent">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight">
                    {item.step}
                  </h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-fg">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* Honest scoring */}
          <section className="mt-16">
            <Kicker tone="brass">The scorecard</Kicker>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Scored like it matters
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-fg">
              Drills and sparring sessions are scored 1–5 on five criteria.
              The coach is instructed to be honest, not encouraging: a
              non-answer scores 1 across the board, and a 5 means your answer
              would hold up against a sharp, real interlocutor. If your scores
              sting a little, the training is working.
            </p>
            <dl className="mt-6 flex flex-col gap-3">
              {SCORING.map((s) => (
                <div key={s.label} className="rounded-card border border-line-soft bg-surface px-5 py-4">
                  <dt className="text-sm font-semibold">{s.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-fg">{s.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* XP, streaks, levels */}
          <section className="mt-16">
            <Kicker tone="brass">The ledger</Kicker>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              XP, streaks, and levels
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-muted-fg">
              <p>
                <strong className="text-foreground">Experience points (XP)</strong>{" "}
                are the ledger of your training. Lessons earn 50, passed
                quizzes 25, a cleared review queue 15 a day — and drills and
                sparring pay out by performance, up to 100 and 250. A weak
                showing earns little. A non-answer earns nothing. The number
                next to your name is work actually done, which is why it
                means something.
              </p>
              <p>
                <strong className="text-foreground">Your streak</strong> (the flame)
                counts consecutive days with any completed training. Readiness
                is a perishable skill — ten minutes daily beats two hours on
                Saturday. Miss a day and the count starts over.
              </p>
              <p>
                <strong className="text-foreground">Levels</strong> mark what you are
                equipped to do. Every course climbs the same ladder — from
                Beginner (“can explain the claim in plain language”) through
                Defender (“can hold a real conversation under pressure”) and
                beyond. You advance by completing the material and proving it
                in assessment, not by showing up.
              </p>
              <p>
                <strong className="text-foreground">Courses unlock by finishing.</strong>{" "}
                Pick any open course first. Complete it, and you choose your
                next one — no fixed order. Completed courses stay open
                forever; their flashcards stay in your review queue so the
                case never fades.
              </p>
            </div>
          </section>

          <div className="mt-16 flex flex-col items-center gap-3 rounded-card border border-line-soft bg-surface p-8 text-center">
            <p className="font-display text-xl font-semibold tracking-tight">
              See it from the inside.
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-fg">
              The first course is open. Your first review queue can exist
              twenty minutes from now.
            </p>
            <Link href="/signup" className="mt-2 inline-block">
              <Button size="lg">Start training free</Button>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
