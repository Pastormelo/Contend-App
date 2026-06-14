"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type FriendItem = { friendshipId: string; userId: string; name: string };

export function FriendsManager({
  accepted,
  incoming,
  outgoing,
}: {
  accepted: FriendItem[];
  incoming: FriendItem[];
  outgoing: FriendItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setNote(null);
    try {
      const res = await fetch(`/api/friends?q=${encodeURIComponent(query.trim())}`);
      const d = (await res.json()) as { results: { id: string; name: string }[] };
      setResults(d.results);
      if (d.results.length === 0) setNote("No one found by that name.");
    } finally {
      setSearching(false);
    }
  }

  async function act(body: object, msg?: string) {
    setBusy(true);
    try {
      await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (msg) setNote(msg);
      setResults([]);
      setQuery("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="font-display text-lg font-semibold tracking-tight">Add a friend</h2>
        <form onSubmit={search} className="mt-3 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            aria-label="Search by name"
          />
          <Button type="submit" variant="outline" disabled={searching}>
            {searching ? "…" : "Search"}
          </Button>
        </form>
        {note && <p className="mt-2 text-sm text-muted-fg">{note}</p>}
        {results.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {results.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-line-soft px-4 py-2.5"
              >
                <span className="text-sm font-medium">{r.name}</span>
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => act({ op: "request", addresseeId: r.id }, "Request sent.")}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {incoming.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Friend requests
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {incoming.map((f) => (
              <li
                key={f.friendshipId}
                className="flex items-center justify-between rounded-lg border border-line-soft px-4 py-2.5"
              >
                <span className="text-sm font-medium">{f.name}</span>
                <span className="flex gap-2">
                  <Button size="sm" disabled={busy} onClick={() => act({ op: "accept", friendshipId: f.friendshipId })}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" disabled={busy} onClick={() => act({ op: "remove", friendshipId: f.friendshipId })}>
                    Decline
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Your friends {accepted.length > 0 && <span className="text-muted-fg">({accepted.length})</span>}
        </h2>
        {accepted.length === 0 ? (
          <p className="mt-3 text-sm text-muted-fg">
            No friends yet. Search above to send a request.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {accepted.map((f) => (
              <li
                key={f.friendshipId}
                className="flex items-center justify-between rounded-lg border border-line-soft px-4 py-2.5"
              >
                <span className="text-sm font-medium">{f.name}</span>
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => act({ op: "remove", friendshipId: f.friendshipId })}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {outgoing.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight">Pending</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {outgoing.map((f) => (
              <li
                key={f.friendshipId}
                className="flex items-center justify-between rounded-lg border border-line-soft px-4 py-2.5 text-muted-fg"
              >
                <span className="text-sm">{f.name}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide">Sent</span>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => act({ op: "remove", friendshipId: f.friendshipId })}>
                    Cancel
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
