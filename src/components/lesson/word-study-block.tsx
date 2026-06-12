import { renderInline } from "@/lib/markdown";

/** Greek/Hebrew word study panel. */
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
    <section className="my-12 rounded-card border border-gold/30 bg-gold/[0.04] p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
        Word study
      </p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {original && (
          <span className="font-serif text-3xl leading-none">{original}</span>
        )}
        <span className="font-display text-xl font-semibold tracking-tight">
          {transliteration ? (
            <em className="font-medium">{transliteration}</em>
          ) : (
            word
          )}
        </span>
        {transliteration && (
          <span className="text-sm text-muted-fg">— “{word}”</span>
        )}
      </div>
      <p className="mt-4 text-[1.0625rem] leading-[1.75]">{renderInline(md)}</p>
    </section>
  );
}
