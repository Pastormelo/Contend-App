import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlockRenderer } from "@/components/lesson/block-renderer";
import { LessonProgressRail } from "@/components/lesson/lesson-progress-rail";
import { LessonCompleteCTA } from "@/components/lesson/lesson-complete-cta";
import { LessonGroupDiscussion } from "@/components/social/lesson-group-discussion";
import { ReadAloud } from "@/components/lesson/read-aloud";
import { LessonNotes } from "@/components/notes/lesson-notes";
import { lessonReadable, lessonSections } from "@/lib/lesson-tts";
import { Kicker, Meta } from "@/components/ui/editorial";
import type { GlossaryEntry } from "@/components/lesson/term-callout";
import type { CitationInfo } from "@/components/lesson/citation-card";
import { z } from "zod";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  if (!z.string().uuid().safeParse(lessonId).success) notFound();

  const supabase = await createClient();

  const [{ data: lesson }, { data: blocks }, { data: glossaryRows }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, est_minutes")
        .eq("id", lessonId)
        .eq("status", "published")
        .maybeSingle(),
      supabase
        .from("lesson_blocks")
        .select("id, sort, type, content")
        .eq("lesson_id", lessonId)
        .order("sort"),
      supabase
        .from("glossary_terms")
        .select("term, short_blurb, full_definition"),
    ]);

  if (!lesson || !blocks?.length) notFound();

  // Course/level context for the header (which track does this lesson belong to?)
  const { data: ctx } = await supabase
    .from("module_lessons")
    .select("modules(levels(number, tracks(title, slug)))")
    .eq("lesson_id", lessonId)
    .limit(1)
    .maybeSingle();
  const levelInfo = (ctx?.modules as unknown as {
    levels: { number: number; tracks: { title: string; slug: string } | null } | null;
  } | null)?.levels;
  const trackTitle = levelInfo?.tracks?.title ?? "Witness Ready";
  const trackSlug = levelInfo?.tracks?.slug;
  const levelNumber = levelInfo?.number ?? 1;

  const { data: citationRows } = await supabase
    .from("citations")
    .select(
      "id, locator, lesson_block_id, sources(title, author, publisher, year, source_type)",
    )
    .in(
      "lesson_block_id",
      blocks.map((b) => b.id),
    );

  const glossary = new Map<string, GlossaryEntry>(
    (glossaryRows ?? []).map((g) => [g.term.toLowerCase(), g]),
  );

  // Group citations per block, numbering them in reading order
  const citationsByBlock = new Map<string, CitationInfo[]>();
  for (const block of blocks) {
    const rows = (citationRows ?? []).filter(
      (c) => c.lesson_block_id === block.id,
    );
    if (rows.length) {
      citationsByBlock.set(
        block.id,
        rows.map((c) => ({
          id: c.id,
          locator: c.locator,
          source: c.sources as unknown as CitationInfo["source"],
        })),
      );
    }
  }
  let citationCounter = 1;

  const readableSegments = lessonReadable(lesson.title, blocks);
  const sections = lessonSections(blocks);

  // Jump-to contents built from block headings.
  const contents = blocks
    .map((b) => {
      const c = (b.content ?? {}) as { heading?: string; word?: string };
      if ((b.type === "prose" || b.type === "objection") && c.heading)
        return { id: `block-${b.id}`, label: c.heading };
      if (b.type === "word_study" && c.word)
        return { id: `block-${b.id}`, label: `Word study: ${c.word}` };
      return null;
    })
    .filter((x): x is { id: string; label: string } => x !== null);

  return (
    <>
      <LessonProgressRail />
      <main className="mx-auto w-full max-w-[68ch] px-5 py-12 sm:px-6">
        <header className="border-b border-line-strong pb-7">
          <Kicker>
            {trackTitle} · Level {levelNumber}
          </Kicker>
          <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-tight">
            {lesson.title}
          </h1>
          <Meta
            className="mt-4"
            items={["Witness Ready", `${lesson.est_minutes} min read`, "ESV"]}
          />
          <p className="mt-4 text-sm leading-relaxed text-muted-fg">
            Tap any{" "}
            <span className="font-medium text-accent">scripture reference</span>{" "}
            to read it, and any{" "}
            <span className="rounded-full border border-line-strong px-2 py-0.5 text-xs font-medium text-muted-fg">
              term
            </span>{" "}
            for its full definition.
          </p>
        </header>

        <ReadAloud segments={readableSegments} lessonId={lesson.id} />

        {contents.length > 2 && (
          <details className="mt-6 rounded-card border border-line-soft bg-surface px-4 py-3 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold tracking-tight">
              In this lesson
              <span aria-hidden className="text-muted-fg">▾</span>
            </summary>
            <ul className="mt-3 flex flex-col gap-1.5 border-t border-line-soft pt-3">
              {contents.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="text-sm text-muted-fg transition-colors hover:text-accent"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        <article className="mt-4">
          {blocks.map((block, i) => {
            const citations = citationsByBlock.get(block.id) ?? [];
            const start = citationCounter;
            citationCounter += citations.length;
            return (
              <div key={block.id} id={`block-${block.id}`} className="scroll-mt-24">
                <BlockRenderer
                  block={block}
                  glossary={glossary}
                  citations={citations}
                  citationStart={start}
                  first={i === 0}
                />
              </div>
            );
          })}
        </article>

        <LessonCompleteCTA lessonId={lesson.id} />

        <LessonNotes
          lessonId={lesson.id}
          trackSlug={trackSlug}
          lessonTitle={lesson.title}
          sections={sections}
        />

        <LessonGroupDiscussion lessonId={lesson.id} trackSlug={trackSlug} />
      </main>
    </>
  );
}
