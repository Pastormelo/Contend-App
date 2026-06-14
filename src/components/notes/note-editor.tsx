"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanitizeNoteHtml } from "@/lib/notes-format";

/**
 * A small WYSIWYG note editor. Bold / italic / bullets format the text
 * directly as you type — the saved value is a sanitized HTML subset.
 */
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(
    !sanitizeNoteHtml(initialBody).replace(/<[^>]+>/g, "").trim(),
  );

  function exec(command: string) {
    editorRef.current?.focus();
    document.execCommand(command, false);
    setEmpty(!editorRef.current?.textContent?.trim());
  }

  function handleSave() {
    const html = sanitizeNoteHtml(editorRef.current?.innerHTML ?? "");
    const plain = editorRef.current?.textContent?.trim() ?? "";
    if (!plain) return;
    onSave(title.trim() || "Untitled note", html);
  }

  const toolBtn =
    "rounded-md border border-line-strong px-2.5 py-1 text-sm transition-colors hover:bg-foreground/5 active:bg-foreground/10";

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
          onMouseDown={(e) => {
            e.preventDefault();
            exec("bold");
          }}
          className={`${toolBtn} font-bold`}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("italic");
          }}
          className={`${toolBtn} italic`}
          aria-label="Italic"
        >
          i
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("underline");
          }}
          className={`${toolBtn} underline`}
          aria-label="Underline"
        >
          U
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertUnorderedList");
          }}
          className={toolBtn}
          aria-label="Bullet list"
        >
          • List
        </button>
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Note body"
          onInput={(e) => setEmpty(!e.currentTarget.textContent?.trim())}
          dangerouslySetInnerHTML={{ __html: sanitizeNoteHtml(initialBody) }}
          className={`note-editable w-full overflow-y-auto rounded-lg border border-line-strong bg-transparent px-4 py-3 text-sm leading-relaxed outline-none focus:border-accent/50 [&_em]:italic [&_li]:my-0.5 [&_strong]:font-semibold [&_u]:underline [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 ${
            compact ? "min-h-[6rem]" : "min-h-[10rem]"
          }`}
        />
        {empty && (
          <span className="pointer-events-none absolute left-4 top-3 text-sm text-muted-fg">
            Write your note… use the buttons above to format.
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving || empty}>
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
