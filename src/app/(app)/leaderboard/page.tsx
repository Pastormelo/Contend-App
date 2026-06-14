import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Leaderboard" };

type Row = { userId: string; name: string; score: number };

function medal(rank: number): string {
  return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Global gauntlet leaderboard
  const { data: scores } = await supabase
    .from("game_scores")
    .select("user_id, best_score")
    .eq("game", "gauntlet")
    .order("best_score", { ascending: false })
    .limit(50);

  // Accepted friends (either direction)
  const { data: friendRows } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id, status")
    .eq("status", "accepted");
  const friendIds = new Set<string>([user.id]);
  for (const f of friendRows ?? []) {
    friendIds.add(f.requester_id === user.id ? f.addressee_id : f.requester_id);
  }

  // Names for everyone we'll display
  const ids = new Set<string>([...(scores ?? []).map((s) => s.user_id), ...friendIds]);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name")
    .in("id", Array.from(ids));
  const nameOf = new Map((profiles ?? []).map((p) => [p.id, p.name ?? "Defender"]));

  const global: Row[] = (scores ?? []).map((s) => ({
    userId: s.user_id,
    name: nameOf.get(s.user_id) ?? "Defender",
    score: s.best_score,
  }));

  // Friends circle: friends (and self) who have a gauntlet score
  const scoreOf = new Map((scores ?? []).map((s) => [s.user_id, s.best_score]));
  const circle: Row[] = Array.from(friendIds)
    .map((id) => ({ userId: id, name: nameOf.get(id) ?? "Defender", score: scoreOf.get(id) ?? 0 }))
    .sort((a, b) => b.score - a.score);

  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The arena
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Leaderboard
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-fg">
          Ranked by your best run in <strong>The Gauntlet</strong>. Add friends
          to turn your study group into a competition.
        </p>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Your circle
            </h2>
            <Link href="/friends" className="text-sm font-medium text-gold hover:opacity-80">
              Manage friends →
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-card border border-line-soft">
            {circle.map((r, i) => (
              <Row key={r.userId} rank={i + 1} row={r} me={r.userId === user.id} />
            ))}
          </div>
          {circle.length <= 1 && (
            <p className="mt-3 text-sm text-muted-fg">
              It&apos;s just you so far.{" "}
              <Link href="/friends" className="font-medium text-gold hover:opacity-80">
                Add a friend
              </Link>{" "}
              to compete.
            </p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Top defenders
          </h2>
          {global.length === 0 ? (
            <p className="mt-4 text-sm text-muted-fg">
              No scores yet. Be the first —{" "}
              <Link href="/games/gauntlet" className="font-medium text-gold hover:opacity-80">
                run the Gauntlet
              </Link>
              .
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-card border border-line-soft">
              {global.map((r, i) => (
                <Row key={r.userId} rank={i + 1} row={r} me={r.userId === user.id} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Row({ rank, row, me }: { rank: number; row: Row; me: boolean }) {
  return (
    <div
      className={
        "flex items-center justify-between border-b border-line-soft px-4 py-3 last:border-0 " +
        (me ? "bg-gold/10" : "")
      }
    >
      <div className="flex items-center gap-3">
        <span className="w-7 text-center font-display text-sm font-semibold text-muted-fg">
          {medal(rank)}
        </span>
        <span className="text-sm font-medium">
          {row.name}
          {me && <span className="ml-2 text-xs text-gold">you</span>}
        </span>
      </div>
      <span className="font-display text-sm font-semibold tabular-nums">
        {row.score.toLocaleString()}
      </span>
    </div>
  );
}
