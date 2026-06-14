"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StreakFlame } from "@/components/progress/streak-flame";
import { LogoMark } from "@/components/layout/logo";

const NAV = [
  { href: "/dashboard", label: "Today" },
  { href: "/tracks", label: "Courses" },
  { href: "/review", label: "Review" },
  { href: "/spar", label: "Spar" },
  { href: "/games", label: "Games" },
  { href: "/groups", label: "Groups" },
];

// The full set shown in the mobile menu and (partly) the account dropdown.
const MORE = [
  { href: "/notes", label: "Notes" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/friends", label: "Friends" },
  { href: "/account", label: "Account & progress" },
  { href: "/how-it-works", label: "How training works" },
];

export function AppHeader({
  name,
  email,
  xp,
  streak,
}: {
  name: string;
  email: string;
  xp: number;
  streak: number;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-8">
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-foreground/5 sm:hidden"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
          >
            <LogoMark className="h-7 text-accent" />
            Witness Ready
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname.startsWith(item.href)
                    ? "text-sm font-medium text-foreground"
                    : "text-sm font-medium text-muted-fg transition-colors hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" aria-label="About your streak">
                <StreakFlame count={streak} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
              <p className="text-sm font-semibold">
                {streak > 0 ? `${streak}-day training streak` : "No streak yet"}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">
                Train on consecutive days to build your streak. Anything
                counts — a lesson, your review queue, a drill, or a spar. Miss
                a day and it resets.
              </p>
              <Link
                href="/account"
                className="mt-2 inline-block text-sm font-medium text-accent hover:text-accent-deep"
              >
                See your progress →
              </Link>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="About experience points"
                className="text-sm font-medium tabular-nums text-muted-fg transition-colors hover:text-foreground"
              >
                {xp.toLocaleString()} XP
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
              <p className="text-sm font-semibold">
                {xp.toLocaleString()} experience points
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">
                XP measures the training you have put in. You earn it by
                finishing lessons, passing quizzes, clearing your review
                queue, and sparring — the harder the work and the better the
                performance, the more you earn.
              </p>
              <Link
                href="/how-it-works"
                className="mt-2 inline-block text-sm font-medium text-accent hover:text-accent-deep"
              >
                How training works →
              </Link>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition-colors duration-150 hover:bg-accent-deep"
              >
                {name.charAt(0).toUpperCase()}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
              <div className="border-b border-line-soft px-3 pb-3 pt-2">
                <p className="text-sm font-semibold">{name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-fg">{email}</p>
              </div>
              <nav className="flex flex-col py-1">
                {MORE.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-line-soft/50"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <form action="/auth/signout" method="post" className="border-t border-line-soft pt-1">
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-accent transition-colors hover:bg-line-soft/50"
                >
                  Sign out
                </button>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <nav className="border-t border-line-soft bg-background sm:hidden">
          <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-2">
            {[...NAV, ...MORE].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/5 " +
                  (pathname.startsWith(item.href) ? "text-foreground" : "text-muted-fg")
                }
              >
                {item.label}
              </Link>
            ))}
            <form action="/auth/signout" method="post" className="mt-1 border-t border-line-soft pt-1">
              <button
                type="submit"
                className="w-full rounded-md px-2 py-2.5 text-left text-sm font-medium text-accent hover:bg-foreground/5"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      )}
    </header>
  );
}
