import Link from "next/link";

export const metadata = { title: "Games" };

const GAMES = [
  {
    slug: "gauntlet",
    title: "The Gauntlet",
    tag: "Speed · Accuracy",
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
    tag: "The argument",
    body: "Rebuild the six-line Trinity formulation in order — then again with three heresies hiding in the pile. One wrong touch collapses it.",
    glyph: "⚔",
  },
];

export default function GamesPage() {
  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14 sm:px-6">
        <header className="border-b border-line-soft pb-8">
          <p className="eyebrow text-gold">The arena</p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,3.25rem)] font-semibold tracking-tight">
            Games
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-fg">
            Same doctrine, different pressure. None of these can be won by
            guessing — you advance by knowing the material, and each one pays XP
            once a day.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-4">
          {GAMES.map((g, i) => (
            <Link
              key={g.slug}
              href={`/games/${g.slug}`}
              className="group relative flex items-stretch overflow-hidden rounded-card border border-line-soft bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50"
            >
              <span aria-hidden className="w-1.5 shrink-0 bg-gold/60 transition-colors group-hover:bg-gold" />
              <span className="relative z-10 flex flex-1 items-center gap-4 p-5 sm:gap-5 sm:p-6">
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line-strong font-display text-2xl text-gold"
                >
                  {g.glyph}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-fg">
                    {g.tag}
                  </span>
                  <span className="mt-1 block font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-gold sm:text-2xl">
                    {g.title}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-fg">
                    {g.body}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="hidden self-start font-mono text-xs tabular-nums text-muted-fg/40 sm:block"
                >
                  0{i + 1}
                </span>
              </span>
              {/* hover sheen */}
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-[sheen_0.9s_ease-out] group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-14 border-t border-line-soft pt-8">
          <p className="eyebrow text-muted-fg">Compete</p>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
            Climb the ranks.
          </h2>
          <p className="mt-1 text-sm text-muted-fg">
            Your best Gauntlet run ranks you. Add friends and turn your group
            into a competition.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/leaderboard", label: "Leaderboard" },
              { href: "/friends", label: "Friends" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-center justify-between rounded-card border border-line-soft bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50"
              >
                <span className="font-display text-base font-semibold tracking-tight">
                  {c.label}
                </span>
                <span
                  aria-hidden
                  className="font-display text-xl text-gold transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
