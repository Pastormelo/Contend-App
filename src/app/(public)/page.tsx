import Link from "next/link";

const features = [
  {
    title: "Learn the doctrine",
    body: "Structured tracks take you from the claim itself to the strongest objections against it — grounded in Scripture, cited from real sources, honest about the other side.",
  },
  {
    title: "Memorize the case",
    body: "Spaced-repetition drills move key verses, definitions, and full argument skeletons into long-term memory — so the answer is there when the conversation is real.",
  },
  {
    title: "Spar under pressure",
    body: "Practice live conversations against AI opponents who push back like real people do, then get coached on exactly where you stood firm and where you slipped.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-xl font-semibold tracking-tight">
          Contend
        </span>
        <Link
          href="/login"
          className="text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
        >
          Sign in
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight">
          Train to defend the faith.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Learn the doctrine. Memorize the case. Spar under pressure — so the
          next hard question at your door finds you ready.
        </p>
        <Link
          href="/signup"
          className="mt-10 inline-flex h-12 items-center rounded-lg bg-accent px-8 text-base font-medium text-white transition-colors duration-150 hover:bg-accent-deep"
        >
          Get started
        </Link>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3 sm:px-10">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-card border border-line-soft bg-white p-6"
          >
            <h2 className="font-display text-lg font-semibold tracking-tight">
              {f.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-line-soft px-6 py-8 text-center text-sm text-ink-soft">
        <span>What Contend Affirms — coming soon</span>
      </footer>
    </main>
  );
}
