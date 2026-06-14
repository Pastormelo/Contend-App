import { createClient } from "@/lib/supabase/server";
import { FriendsManager, type FriendItem } from "@/components/social/friends-manager";

export const metadata = { title: "Friends" };

export default async function FriendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rows } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status");

  const others = new Set<string>();
  for (const r of rows ?? []) {
    others.add(r.requester_id === user.id ? r.addressee_id : r.requester_id);
  }
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name")
    .in("id", others.size ? Array.from(others) : ["00000000-0000-0000-0000-000000000000"]);
  const nameOf = new Map((profiles ?? []).map((p) => [p.id, p.name ?? "Defender"]));

  const accepted: FriendItem[] = [];
  const incoming: FriendItem[] = [];
  const outgoing: FriendItem[] = [];
  for (const r of rows ?? []) {
    const otherId = r.requester_id === user.id ? r.addressee_id : r.requester_id;
    const item: FriendItem = {
      friendshipId: r.id,
      userId: otherId,
      name: nameOf.get(otherId) ?? "Defender",
    };
    if (r.status === "accepted") accepted.push(item);
    else if (r.addressee_id === user.id) incoming.push(item);
    else outgoing.push(item);
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
        Compete &amp; encourage
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Friends
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-fg">
        Add the people you&apos;re training alongside. Friends show up on your
        leaderboard, so a class or small group can compete in the games.
      </p>
      <div className="mt-10">
        <FriendsManager accepted={accepted} incoming={incoming} outgoing={outgoing} />
      </div>
    </main>
  );
}
