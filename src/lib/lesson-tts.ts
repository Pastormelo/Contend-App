/**
 * Turn lesson blocks into plain-text segments for text-to-speech, and pull
 * out section headings (used for the notes section picker). Server-safe.
 */

type BlockContent = {
  heading?: string;
  md?: string;
  reference?: string;
  note?: string;
  word?: string;
};

type Block = { type: string; content: unknown };

function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Ordered plain-text segments to read aloud (skips coach-only blocks). */
export function lessonReadable(title: string, blocks: Block[]): string[] {
  const segments: string[] = [title];
  for (const b of blocks) {
    const c = (b.content ?? {}) as BlockContent;
    if (b.type === "prose" || b.type === "objection") {
      if (c.heading) segments.push(stripMarkdown(c.heading));
      if (c.md) segments.push(stripMarkdown(c.md));
    } else if (b.type === "scripture") {
      if (c.reference) segments.push(`Scripture. ${c.reference}.`);
      if (c.note) segments.push(stripMarkdown(c.note));
    } else if (b.type === "word_study") {
      if (c.word) segments.push(`Word study. ${c.word}.`);
      if (c.md) segments.push(stripMarkdown(c.md));
    }
    // model_answer and others are not read
  }
  return segments.filter((s) => s.length > 0);
}

/** Section headings for the in-lesson note picker. */
export function lessonSections(blocks: Block[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    const c = (b.content ?? {}) as BlockContent;
    if ((b.type === "prose" || b.type === "objection") && c.heading) out.push(c.heading);
    else if (b.type === "word_study" && c.word) out.push(`Word study: ${c.word}`);
  }
  return out;
}
