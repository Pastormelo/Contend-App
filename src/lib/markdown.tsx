import React from "react";
import { VerseRef } from "@/components/lesson/verse-ref";

/**
 * Minimal inline-markdown renderer for lesson copy: **bold**, *italic*,
 * and auto-detected scripture references (rendered as tappable popovers).
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
      <em key={`${keyPrefix}-i${i}`}>{linkScripture(part, `${keyPrefix}-i${i}`)}</em>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>
        {linkScripture(part, `${keyPrefix}-${i}`)}
      </React.Fragment>
    ),
  );
}

const BOOKS = [
  "Genesis", "Gen", "Exodus", "Exod", "Ex", "Leviticus", "Lev", "Numbers",
  "Num", "Deuteronomy", "Deut", "Joshua", "Josh", "Judges", "Judg", "Ruth",
  "Samuel", "Sam", "Kings", "Kgs", "Chronicles", "Chron", "Ezra", "Nehemiah",
  "Neh", "Esther", "Job", "Psalms", "Psalm", "Ps", "Proverbs", "Prov",
  "Ecclesiastes", "Eccl", "Isaiah", "Isa", "Jeremiah", "Jer", "Lamentations",
  "Lam", "Ezekiel", "Ezek", "Daniel", "Dan", "Hosea", "Hos", "Joel", "Amos",
  "Obadiah", "Obad", "Jonah", "Micah", "Mic", "Nahum", "Nah", "Habakkuk",
  "Hab", "Zephaniah", "Zeph", "Haggai", "Hag", "Zechariah", "Zech",
  "Malachi", "Mal", "Matthew", "Matt", "Mark", "Luke", "John", "Acts",
  "Romans", "Rom", "Corinthians", "Cor", "Galatians", "Gal", "Ephesians",
  "Eph", "Philippians", "Phil", "Colossians", "Col", "Thessalonians",
  "Thess", "Timothy", "Tim", "Titus", "Philemon", "Phlm", "Hebrews", "Heb",
  "James", "Jas", "Peter", "Pet", "Jude", "Revelation", "Rev",
];

// e.g. "John 17:3", "Deut 6:4", "1 Cor 12:11", "Matt 3:16–17", "Acts 5:3-4"
const REF_PATTERN = new RegExp(
  `\\b((?:[123]\\s)?(?:${BOOKS.join("|")}))\\.?\\s(\\d{1,3}):(\\d{1,3}(?:[–-]\\d{1,3})?)`,
  "g",
);

function linkScripture(text: string, keyPrefix: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(REF_PATTERN)) {
    const idx = match.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));
    nodes.push(
      <VerseRef key={`${keyPrefix}-v${n++}`} reference={match[0]} />,
    );
    last = idx + match[0].length;
  }
  if (nodes.length === 0) return text;
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
