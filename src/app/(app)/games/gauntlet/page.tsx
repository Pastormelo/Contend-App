import Link from "next/link";
import { Gauntlet } from "@/components/games/gauntlet";

export const metadata = { title: "The Gauntlet" };

export default function GauntletPage() {
  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12 sm:px-6">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              The arena
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              The Gauntlet
            </h1>
          </div>
          <Link href="/games" className="text-sm font-medium text-muted-fg hover:text-foreground">
            ← All games
          </Link>
        </div>
        <Gauntlet />
      </main>
    </div>
  );
}
