"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/notes/note-editor";
import { renderNotes, noteSnippet } from "@/lib/notes-format";
import { course, formatCourseNumber } from "@/lib/courses";

export type Note = {
  id: string;
  title: string;
  body: string;
  track_slug: string | null;
  lesson_id: string | null;
  lesson_title: string | null;
  section: string | null;
  updated_at: string;
};

export function NotesManager({ notes }: { notes: Note[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        (n.lesson_title ?? "").toLowerCase().includes(q),
    );
  }, [notes, query]);

  // Group by course (track_slug → course label), then keep newest first within.
  const groups = useMemo(() => {
    const map = new Map<string, { label: string; order: number; notes: Note[] }>();
    for (const n of filtered) {
      const node = n.track_slug ? course(n.track_slug) : undefined;
      const key = n.track_slug ?? "__general__";
      const label = node ? `${formatCourseNumber(node.number)} · ${node.title}` : "General notes";
      const order = node ? node.number : 999;
      if (!map.has(key)) map.set(key, { label, order, notes: [] });
      map.get(key)!.notes.push(n);
    }
    return [...map.values()].sort((a, b) => a.order - b.order);
  }, [filtered]);

  async function create(title: string, body: string) {
    setBusy(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      setCreating(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function update(id: string, title: string, body: string) {
    setBusy(true);
    try {
      await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      setEditingId(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your notes…"
          className="h-10 flex-1 rounded-lg border border-line-strong bg-transparent px-3 text-sm outline-none focus:border-accent/50"
        />
        {!creating && <Button onClick={() => setCreating(true)}>New note</Button>}
      </div>

      {creating && (
        <div className="rounded-card border border-accent/30 bg-accent/[0.04] p-5">
          <p className="mb-3 text-sm font-semibold">New note</p>
          <NoteEditor onSave={create} onCancel={() => setCreating(false)} saving={busy} />
        </div>
      )}

      {groups.length === 0 && !creating && (
        <p className="text-sm text-muted-fg">
          {query ? "No notes match your search." : "No notes yet. Jot one down here, or take notes right inside a lesson — they'll file themselves by course."}
        </p>
      )}

      {groups.map((g) => (
        <section key={g.label}>
          <h2 className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight">
            {g.label}
            <span className="h-px flex-1 bg-line-soft" />
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {g.notes.map((n) =>
              editingId === n.id ? (
                <div key={n.id} className="rounded-card border border-accent/30 bg-surface p-5">
                  <NoteEditor
                    initialTitle={n.title}
                    initialBody={n.body}
                    onSave={(t, b) => update(n.id, t, b)}
                    onCancel={() => setEditingId(null)}
                    saving={busy}
                  />
                </div>
              ) : (
                <div key={n.id} className="rounded-card border border-line-soft bg-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-base font-semibold tracking-tight">
                        {n.title}
                      </p>
                      {(n.lesson_title || n.section) && (
                        <p className="mt-0.5 text-xs text-muted-fg">
                          {n.lesson_title}
                          {n.lesson_title && n.section ? " · " : ""}
                          {n.section}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => setOpenId(openId === n.id ? null : n.id)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-muted-fg hover:bg-foreground/5"
                      >
                        {openId === n.id ? "Collapse" : "Open"}
                      </button>
                      <button
                        onClick={() => setEditingId(n.id)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-foreground/5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(n.id)}
                        disabled={busy}
                        className="rounded-md px-2 py-1 text-xs font-medium text-muted-fg hover:bg-foreground/5"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {openId === n.id ? (
                    <div className="mt-3 border-t border-line-soft pt-3 text-sm">{renderNotes(n.body)}</div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-fg">{noteSnippet(n.body)}</p>
                  )}
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
