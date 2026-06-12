import Link from "next/link";

const NAV = [
  { href: "/about", label: "Why Contend" },
  { href: "/training", label: "The Training" },
  { href: "/how-it-works", label: "How It Works" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Contend
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-deep"
          >
            Start training
          </Link>
        </div>
      </div>
      <nav className="flex items-center justify-center gap-6 border-t border-line-soft py-2.5 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[0.8125rem] font-medium text-ink-soft"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
