import Link from "next/link";
import { StreakFlame } from "@/components/progress/streak-flame";

export function AppHeader({
  name,
  xp,
  streak,
}: {
  name: string;
  xp: number;
  streak: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Contend
        </Link>
        <div className="flex items-center gap-4">
          <StreakFlame count={streak} />
          <span
            className="text-sm font-medium tabular-nums text-muted-fg"
            title="Experience points"
          >
            {xp.toLocaleString()} XP
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              title={`${name} — sign out`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition-colors duration-150 hover:bg-accent-deep"
            >
              {name.charAt(0).toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
