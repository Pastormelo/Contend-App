import Link from "next/link";

export const metadata = { title: "Games" };

const GAMES = [
  {
    slug: "gauntlet",
    title: "The Gauntlet",
    tag: "Speed + accuracy",
    body: "Every checkpoint question, fired in random order against a shrinking clock. Three lives. Streaks multiply your score. Survive all of it.",
    glyph: "⚡",
  },
  {
    slug: "match",
    title: "Term Match",
    tag: "Vocabulary",
    body: "Pair every term with its exact definition before the clock dies. Three levels — being, person, essence, and friends get faster each time.",
    glyph: "❖",
  },
  {
    slug: "creed",
    title: "Creed Builder",
    tag: "The argument itself",
    body: "Rebuild the six-line Trinity formulation in order — then do it again with three heresies hiding in the pile. One wrong touch collapses it.",
    glyph: "⚔",
  },
];

export default function GamesPage() {
  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The arena
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Games
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-fg">
          Same doctrine, different pressure. None of these can be won by
          guessing — you advance by knowing the material, and each one pays
          XP once a day.
        </p>

        <div className="mt-10 flex flex-col gap-5">
          {GAMES.map((g, i) => (
            <Link
              key={g.slug}
              href={`/games/${g.slug}`}
              className="card-interactive group flex items-start gap-5 rounded-card border border-line-soft bg-surface p-6 hover:border-gold/40"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="font-display text-3xl text-gold" aria-hidden>
                {g.glyph}
              </span>
              <span className="flex-1">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-fg">
                  {g.tag}
                </span>
                <span className="mt-1 block font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-gold">
                  {g.title}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted-fg">
                  {g.body}
                </span>
              </span>
              <span className="self-center font-display text-xl text-muted-fg transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gold" aria-hidden>
                →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
