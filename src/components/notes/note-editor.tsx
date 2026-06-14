"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renderNotes } from "@/lib/notes-format";

export function NoteEditor({
  initialTitle = "",
  initialBody = "",
  onSave,
  onCancel,
  saving = false,
  compact = false,
}: {
  initialTitle?: string;
  initialBody?: string;
  onSave: (title: string, body: string) => void;
  onCancel?: () => void;
  saving?: boolean;
  compact?: boolean;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [showPreview, setShowPreview] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function surround(before: string, after: string, placeholder: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end) || placeholder;
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  }

  function bulletLines() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = body.lastIndexOf("\n", start - 1) + 1;
    const block = body.slice(lineStart, end) || "List item";
    const bulleted = block
      .split("\n")
      .map((l) => (l.startsWith("- ") ? l : `- ${l}`))
      .join("\n");
    const next = body.slice(0, lineStart) + bulleted + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => el.focus());
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        maxLength={120}
        aria-label="Note title"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => surround("**", "**", "bold")}
          className="rounded-md border border-line-strong px-2.5 py-1 text-sm font-bold transition-colors hover:bg-foreground/5"
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => surround("*", "*", "italic")}
          className="rounded-md border border-line-strong px-2.5 py-1 text-sm italic transition-colors hover:bg-foreground/5"
          aria-label="Italic"
        >
          i
        </button>
        <button
          type="button"
          onClick={bulletLines}
          className="rounded-md border border-line-strong px-2.5 py-1 text-sm transition-colors hover:bg-foreground/5"
          aria-label="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => setShowPreview((p) => !p)}
          className="ml-auto text-xs font-medium text-muted-fg hover:text-foreground"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {showPreview ? (
        <div className="min-h-32 rounded-lg border border-line-soft bg-surface px-4 py-3 text-sm">
          {body.trim() ? renderNotes(body) : <span className="text-muted-fg">Nothing to preview yet.</span>}
        </div>
      ) : (
        <textarea
          ref={ref}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={compact ? 4 : 8}
          placeholder="Write your note… **bold**, *italic*, and start a line with - for bullets."
          className="w-full rounded-lg border border-line-strong bg-transparent px-4 py-3 text-sm leading-relaxed outline-none focus:border-accent/50"
        />
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(title.trim() || "Untitled note", body)}
          disabled={saving || body.trim().length === 0}
        >
          {saving ? "Saving…" : "Save note"}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
