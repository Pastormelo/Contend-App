import React from "react";

/** Inline **bold** and *italic* for note text. */
function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const bold = text.split(/\*\*(.+?)\*\*/g);
  bold.forEach((part, i) => {
    if (i % 2 === 1) {
      out.push(<strong key={`${key}-b${i}`}>{italic(part, `${key}-b${i}`)}</strong>);
    } else {
      out.push(...italic(part, `${key}-t${i}`));
    }
  });
  return out;
}

function italic(text: string, key: string): React.ReactNode[] {
  return text.split(/\*(.+?)\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <em key={`${key}-i${i}`}>{part}</em>
    ) : (
      <React.Fragment key={`${key}-${i}`}>{part}</React.Fragment>
    ),
  );
}

/**
 * Render a note body: paragraphs, plus "- " / "* " bullet lists, with inline
 * bold/italic. A deliberately small, predictable subset.
 */
export function renderNotes(body: string): React.ReactNode {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bullets.length === 0) return;
    const items = [...bullets];
    out.push(
      <ul key={`ul${key++}`} className="my-2 list-disc space-y-1 pl-5">
        {items.map((b, i) => (
          <li key={i}>{inline(b, `li${key}-${i}`)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) {
      bullets.push(m[1]);
    } else if (line.trim() === "") {
      flushBullets();
    } else {
      flushBullets();
      out.push(
        <p key={`p${key++}`} className="my-2 leading-relaxed">
          {inline(line, `p${key}`)}
        </p>,
      );
    }
  }
  flushBullets();
  return <>{out}</>;
}

/** A one-line plain-text preview (strips markup). */
export function noteSnippet(body: string, max = 140): string {
  const plain = body
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}
