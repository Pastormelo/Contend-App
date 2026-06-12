"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StreakFlame } from "@/components/progress/streak-flame";

const NAV = [
  { href: "/dashboard", label: "Today" },
  { href: "/tracks", label: "Courses" },
  { href: "/review", label: "Review" },
  { href: "/spar", label: "Spar" },
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

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Contend
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
                <Link
                  href="/account"
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-line-soft/50"
                >
                  Account &amp; progress
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-line-soft/50"
                >
                  How training works
                </Link>
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
    </header>
  );
}
