import { renderInline } from "@/lib/markdown";

/** Greek/Hebrew word study (content arrives in later levels). */
export function WordStudyBlock({
  word,
  original,
  transliteration,
  md,
}: {
  word: string;
  original?: string;
  transliteration?: string;
  md: string;
}) {
  return (
    <section className="my-10 rounded-card border border-line-soft bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg">
        Word study
      </p>
      <p className="mt-2 font-display text-xl font-semibold">
        {word}
        {original && <span className="ml-3 font-serif">{original}</span>}
        {transliteration && (
          <em className="ml-2 text-base font-normal text-muted-fg">
            {transliteration}
          </em>
        )}
      </p>
      <p className="mt-3 text-[1.0625rem] leading-[1.75]">{renderInline(md)}</p>
    </section>
  );
}
