import Link from "next/link";
import { Logo } from "@/components/layout/logo";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/training", label: "The Training" },
  { href: "/how-it-works", label: "How It Works" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/15 bg-background/90 backdrop-blur">
      {/* Masthead row */}
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-fg transition-colors duration-150 hover:text-foreground"
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

      {/* Section bar (newsroom category nav) */}
      <nav className="border-t border-line-soft">
        <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-center gap-7 px-6 sm:justify-start sm:px-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-fg transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
