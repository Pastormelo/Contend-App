"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GroupsLauncher({
  courses,
}: {
  courses: { slug: string; title: string; number: number }[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"none" | "create" | "join">("none");
  const [name, setName] = useState("");
  const [trackSlug, setTrackSlug] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (name.trim().length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "create", name: name.trim(), trackSlug: trackSlug || undefined }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      router.push(`/groups/${d.groupId}`);
    } catch {
      setError("Couldn't create the group. Try again.");
      setBusy(false);
    }
  }

  async function join() {
    if (code.trim().length < 4) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "join", code: code.trim() }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      router.push(`/groups/${d.groupId}`);
    } catch {
      setError("No group found with that code.");
      setBusy(false);
    }
  }

  if (mode === "none") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => setMode("create")}>Create a group</Button>
        <Button variant="outline" onClick={() => setMode("join")}>
          Join with a code
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line-soft bg-surface p-5">
      {mode === "create" ? (
        <div className="flex flex-col gap-3">
          <p className="font-display text-base font-semibold">New study group</p>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name (e.g. Tuesday Men's Study)" />
          <select
            value={trackSlug}
            onChange={(e) => setTrackSlug(e.target.value)}
            className="h-10 rounded-lg border border-line-strong bg-transparent px-3 text-sm"
          >
            <option value="">Studying together: pick a course (optional)</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                Course {String(c.number).padStart(2, "0")}: {c.title}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-accent">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={create} disabled={busy}>
              {busy ? "Creating…" : "Create group"}
            </Button>
            <Button variant="ghost" onClick={() => setMode("none")} disabled={busy}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-display text-base font-semibold">Join a group</p>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Invite code (e.g. K7M2QP)"
            maxLength={12}
          />
          {error && <p className="text-sm text-accent">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={join} disabled={busy}>
              {busy ? "Joining…" : "Join group"}
            </Button>
            <Button variant="ghost" onClick={() => setMode("none")} disabled={busy}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
