import React from "react";

/* ------------------------------------------------------------------ *
 * Notes are stored as a small, sanitized HTML subset (what the rich
 * editor produces). Legacy notes saved as markdown still render via the
 * markdown fallback below, so nothing already written is lost.
 * ------------------------------------------------------------------ */

const INLINE_MAP: Record<string, string> = {
  b: "strong",
  strong: "strong",
  i: "em",
  em: "em",
  u: "u",
  ul: "ul",
  ol: "ol",
  li: "li",
};

/**
 * Reduce arbitrary contentEditable HTML to a safe allowlist:
 * strong / em / u / ul / ol / li / br. Block tags (div, p) become line
 * breaks; everything else is dropped while keeping its text. All
 * attributes are stripped.
 */
export function sanitizeNoteHtml(html: string): string {
  if (!html) return "";
  let s = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/&nbsp;/gi, " ");

  s = s.replace(/<(\/?)([a-zA-Z0-9]+)\b[^>]*?>/g, (_m, slash: string, name: string) => {
    const lower = name.toLowerCase();
    if (lower === "br") return "<br/>";
    if (lower === "div" || lower === "p") return slash ? "<br/>" : "";
    const mapped = INLINE_MAP[lower];
    if (!mapped) return "";
    return slash ? `</${mapped}>` : `<${mapped}>`;
  });

  // Collapse runs of breaks and trim leading/trailing ones.
  s = s
    .replace(/(?:<br\/>\s*){3,}/g, "<br/><br/>")
    .replace(/^(?:\s*<br\/>)+/, "")
    .replace(/(?:<br\/>\s*)+$/, "")
    .trim();

  return s;
}

function looksLikeHtml(body: string): boolean {
  return /<\/?(strong|em|u|ul|ol|li|br|p|div|b|i)\b/i.test(body);
}

/* ---------- Legacy markdown fallback (notes saved before the rich editor) ---------- */

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

function renderMarkdown(body: string): React.ReactNode {
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

/** Render a note body — sanitized HTML, or legacy markdown. */
export function renderNotes(body: string): React.ReactNode {
  if (looksLikeHtml(body)) {
    return (
      <div
        className="leading-relaxed [&_em]:italic [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_u]:underline [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: sanitizeNoteHtml(body) }}
      />
    );
  }
  return renderMarkdown(body);
}

/** A one-line plain-text preview (strips markup). */
export function noteSnippet(body: string, max = 140): string {
  const plain = body
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|ul|ol)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}
