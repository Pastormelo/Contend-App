"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NoteEditor } from "@/components/notes/note-editor";
import { renderNotes } from "@/lib/notes-format";

type Note = {
  id: string;
  title: string;
  body: string;
  section: string | null;
  updated_at: string;
};

/**
 * Note-taking embedded at the end of a lesson. New notes are auto-tagged with
 * the course, lesson, and (optionally) section, so they file themselves in
 * the journal.
 */
export function LessonNotes({
  lessonId,
  trackSlug,
  lessonTitle,
  sections,
}: {
  lessonId: string;
  trackSlug?: string;
  lessonTitle: string;
  sections: string[];
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [composing, setComposing] = useState(false);
  const [section, setSection] = useState("General");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch(`/api/notes?lessonId=${lessonId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { notes: Note[] }) => setNotes(d.notes))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }

  useEffect(load, [lessonId]);

  async function save(title: string, body: string) {
    setSaving(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          trackSlug: trackSlug ?? null,
          lessonId,
          lessonTitle,
          section,
        }),
      });
      setComposing(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-12 border-t border-line-soft pt-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Your notes
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">
            Take a note on this lesson
          </h2>
        </div>
        <Link href="/notes" className="text-sm font-medium text-accent hover:text-accent-deep">
          All notes →
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted-fg">
        Saved notes are filed automatically under this course and lesson.
      </p>

      {loaded && notes.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-card border border-line-soft bg-surface p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-sm font-semibold">{n.title}</p>
                {n.section && n.section !== "General" && (
                  <span className="text-xs text-muted-fg">{n.section}</span>
                )}
              </div>
              <div className="mt-1 text-sm text-muted-fg">{renderNotes(n.body)}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        {composing ? (
          <div className="rounded-card border border-accent/30 bg-accent/[0.04] p-5">
            {sections.length > 0 && (
              <label className="mb-3 block text-sm">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-fg">
                  Section
                </span>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="h-10 w-full rounded-lg border border-line-strong bg-transparent px-3 text-sm"
                >
                  <option value="General">General (whole lesson)</option>
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <NoteEditor onSave={save} onCancel={() => setComposing(false)} saving={saving} compact />
          </div>
        ) : (
          <Button variant="outline" onClick={() => setComposing(true)}>
            + Add a note
          </Button>
        )}
      </div>
    </section>
  );
}
