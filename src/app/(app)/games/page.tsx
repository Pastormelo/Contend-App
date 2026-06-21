import Link from "next/link";
import { Kicker, SectionHeading } from "@/components/ui/editorial";

export const metadata = { title: "Games" };

const GAMES = [
  {
    slug: "gauntlet",
    title: "The Gauntlet",
    tag: "Speed · Accuracy",
    body: "Every checkpoint question, fired in random order against a shrinking clock. Three lives, and streaks multiply your score.",
    glyph: "⚡",
  },
  {
    slug: "match",
    title: "Term Match",
    tag: "Vocabulary",
    body: "Pair every term with its exact definition before the clock runs out. Three levels, each one faster than the last.",
    glyph: "❖",
  },
  {
    slug: "creed",
    title: "Creed Builder",
    tag: "The argument",
    body: "Rebuild the six-line Trinity formulation in order — then again with three heresies hiding in the pile. One wrong touch collapses it.",
    glyph: "⚔",
  },
];

export default function GamesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <Kicker tone="brass">Practice arena</Kicker>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight">
        Games
      </h1>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-fg">
        Same doctrine, different pressure. None of these can be won by guessing —
        you advance by knowing the material, and each one pays XP once a day.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {GAMES.map((g) => (
          <Link
            key={g.slug}
            href={`/games/${g.slug}`}
            className="card-interactive group flex flex-col rounded-card border border-line-soft bg-surface p-6 hover:border-accent/40"
          >
            <span
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-soft text-2xl text-accent"
            >
              {g.glyph}
            </span>
            <span className="mt-4">
              <Kicker>{g.tag}</Kicker>
            </span>
            <h2 className="mt-1.5 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
              {g.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-fg">
              {g.body}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Play
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-14">
        <SectionHeading label="Compete" />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
          Your best Gauntlet run ranks you. Add friends and turn your group into
          a friendly competition.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { href: "/leaderboard", label: "Leaderboard", note: "See where you stand" },
            { href: "/friends", label: "Friends", note: "Add people to compete with" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="card-interactive group flex items-center justify-between rounded-card border border-line-soft bg-surface p-5 hover:border-accent/40"
            >
              <span>
                <span className="block font-display text-base font-semibold tracking-tight">
                  {c.label}
                </span>
                <span className="mt-0.5 block text-sm text-muted-fg">{c.note}</span>
              </span>
              <span
                aria-hidden
                className="font-display text-xl text-accent transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
