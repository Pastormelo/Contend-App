import { ProseBlock } from "@/components/lesson/prose-block";
import { ScriptureBlock } from "@/components/lesson/scripture-block";
import { WordStudyBlock } from "@/components/lesson/word-study-block";
import type { GlossaryEntry } from "@/components/lesson/term-callout";
import type { CitationInfo } from "@/components/lesson/citation-card";
import type { Json } from "@/types/database";

export type LessonBlock = {
  id: string;
  sort: number;
  type: string;
  content: Json;
};

type BlockContent = {
  heading?: string;
  md?: string;
  terms?: string[];
  reference?: string;
  note?: string;
  word?: string;
  original?: string;
  transliteration?: string;
};

export function BlockRenderer({
  block,
  glossary,
  citations,
  citationStart,
  first = false,
}: {
  block: LessonBlock;
  glossary: Map<string, GlossaryEntry>;
  citations: CitationInfo[];
  citationStart: number;
  first?: boolean;
}) {
  const content = (block.content ?? {}) as BlockContent;
  const terms = (content.terms ?? [])
    .map((t) => glossary.get(t.toLowerCase()))
    .filter((t): t is GlossaryEntry => Boolean(t));

  switch (block.type) {
    case "prose":
      return (
        <ProseBlock
          heading={content.heading}
          md={content.md ?? ""}
          terms={terms}
          citations={citations}
          citationStart={citationStart}
          dropCap={first}
        />
      );
    case "objection":
      return (
        <ProseBlock
          heading={content.heading}
          md={content.md ?? ""}
          terms={terms}
          citations={citations}
          citationStart={citationStart}
          variant="objection"
        />
      );
    case "scripture":
      return (
        <ScriptureBlock
          reference={content.reference ?? ""}
          note={content.note}
        />
      );
    case "word_study":
      return (
        <WordStudyBlock
          word={content.word ?? ""}
          original={content.original}
          transliteration={content.transliteration}
          md={content.md ?? ""}
        />
      );
    case "model_answer":
      // Coach-grounding content — never rendered to the learner
      return null;
    default:
      return null;
  }
}
