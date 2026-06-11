import React from "react";

/**
 * Minimal inline-markdown renderer for lesson copy: **bold** and *italic*.
 * Lesson content is authored, not user-generated.
 */
export function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on **bold** first, then *italic* inside the remainder
  const boldParts = text.split(/\*\*(.+?)\*\*/g);
  boldParts.forEach((part, i) => {
    if (i % 2 === 1) {
      nodes.push(<strong key={`b${i}`}>{renderItalic(part, `b${i}`)}</strong>);
    } else {
      nodes.push(...renderItalic(part, `t${i}`));
    }
  });
  return nodes;
}

function renderItalic(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={`${keyPrefix}-i${i}`}>{part}</em>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
    ),
  );
}
