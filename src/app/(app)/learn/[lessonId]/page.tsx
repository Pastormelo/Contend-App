import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlockRenderer } from "@/components/lesson/block-renderer";
import { LessonProgressRail } from "@/components/lesson/lesson-progress-rail";
import { LessonCompleteCTA } from "@/components/lesson/lesson-complete-cta";
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

  return (
    <>
      <LessonProgressRail />
      <main className="mx-auto w-full max-w-[68ch] px-5 py-12 sm:px-6">
        <header className="border-b border-line-soft pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            The Trinity · Level 1
          </p>
          <h1 className="mt-3 font-display text-[clamp(1.875rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight">
            {lesson.title}
          </h1>
          <p className="mt-3 text-sm text-muted-fg">
            A {lesson.est_minutes}-minute lesson · tap any{" "}
            <span className="font-medium text-accent">scripture reference</span>{" "}
            to read it, and any{" "}
            <span className="rounded-full border border-line-strong px-2 py-0.5 text-xs font-medium text-muted-fg">
              term
            </span>{" "}
            for its full definition.
          </p>
        </header>

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
      </main>
    </>
  );
}
