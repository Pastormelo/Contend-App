import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LevelLadder } from "@/components/progress/level-ladder";
import { Badge } from "@/components/ui/badge";
import {
  CHECKPOINT_QUIZ_ID,
  completedSlugs,
  isUnlocked,
  course,
  type CourseSlug,
} from "@/lib/courses";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: track } = await supabase
    .from("tracks")
    .select("*")
    .eq("slug", slug)
    .single();

  // If this is a known course whose content hasn't been loaded into the
  // database yet, explain that rather than throwing a bare 404.
  if (!track) {
    const node = course(slug);
    if (node?.hasContent) {
      return (
        <main className="mx-auto w-full max-w-xl flex-1 px-5 py-16 text-center sm:px-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {node.title} isn&apos;t loaded yet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-fg">
            This course&apos;s lessons haven&apos;t been added to the database
            yet. If you&apos;re the administrator, run the course&apos;s SQL
            file in Supabase; otherwise check back shortly.
          </p>
          <Link
            href="/tracks"
            className="mt-6 inline-block text-sm font-medium text-accent hover:text-accent-deep"
          >
            ← Back to courses
          </Link>
        </main>
      );
    }
    notFound();
  }
  if (track.status !== "live") notFound();

  const [{ data: levels }, { data: passedAttempts }] = await Promise.all([
    supabase
      .from("levels")
      .select("id, number, title, equipped_statement, status")
      .eq("track_id", track.id)
      .order("number"),
    supabase
      .from("quiz_attempts")
      .select("quiz_id")
      .eq("user_id", user.id)
      .eq("passed", true),
  ]);

  // Enforce the prerequisite gate on direct navigation, too.
  const completed = completedSlugs((passedAttempts ?? []).map((p) => p.quiz_id as string));
  const node = course(slug);
  if (node && !isUnlocked(slug as CourseSlug, completed)) {
    redirect("/tracks");
  }
  const courseDone = !!CHECKPOINT_QUIZ_ID[slug as CourseSlug] && completed.has(slug as CourseSlug);

  const activeLevel = (levels ?? []).find((l) => l.status === "live");

  // Modules + lessons under the active level
  const { data: modules } = activeLevel
    ? await supabase
        .from("modules")
        .select("id, title, summary, sort, module_lessons(sort, lessons(id, title, est_minutes))")
        .eq("level_id", activeLevel.id)
        .eq("status", "published")
        .order("sort")
    : { data: [] };

  // Bibliography: only the sources actually cited by this track's lessons
  const lessonIds = (modules ?? []).flatMap((m) =>
    (m.module_lessons ?? [])
      .map((ml) => (ml.lessons as unknown as { id: string } | null)?.id)
      .filter((id): id is string => Boolean(id)),
  );

  let sources: {
    id: string;
    source_type: string;
    title: string;
    author: string | null;
    publisher: string | null;
    year: number | null;
  }[] = [];
  if (lessonIds.length > 0) {
    const { data: blocks } = await supabase
      .from("lesson_blocks")
      .select("id")
      .in("lesson_id", lessonIds);
    const blockIds = (blocks ?? []).map((b) => b.id);
    if (blockIds.length > 0) {
      const { data: citations } = await supabase
        .from("citations")
        .select("source_id")
        .in("lesson_block_id", blockIds);
      const sourceIds = Array.from(
        new Set((citations ?? []).map((c) => c.source_id as string)),
      );
      if (sourceIds.length > 0) {
        const { data: srcs } = await supabase
          .from("sources")
          .select("id, source_type, title, author, publisher, year")
          .in("id", sourceIds)
          .order("author");
        sources = srcs ?? [];
      }
    }
  }

  const lessonsComplete = courseDone ? 1 : 0;
  const moduleCount = modules?.length ?? 1;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {track.title}
        </h1>
        {activeLevel && (
          <p className="mt-2 text-sm text-muted-fg">
            Level {activeLevel.number} · {activeLevel.title} —{" "}
            {activeLevel.equipped_statement}
          </p>
        )}
      </header>

      <section className="mt-10">
        <LevelLadder
          levels={(levels ?? []).map((l) => ({
            number: l.number,
            title: l.title,
            equipped: l.equipped_statement,
            state:
              l.status === "live"
                ? ("active" as const)
                : ("locked" as const),
          }))}
          progressLabel={`${lessonsComplete} of ${moduleCount} module${moduleCount === 1 ? "" : "s"} complete`}
        />
      </section>

      {activeLevel && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Level {activeLevel.number} modules
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {(modules ?? []).map((m) => (
              <div
                key={m.id}
                className="rounded-card border border-line-soft bg-surface p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold">
                    {m.title}
                  </h3>
                  <Badge variant={lessonsComplete > 0 ? "gold" : "default"}>
                    {lessonsComplete > 0 ? "Complete" : "Active"}
                  </Badge>
                </div>
                {m.summary && (
                  <p className="mt-1 text-sm text-muted-fg">{m.summary}</p>
                )}
                <ul className="mt-4 flex flex-col gap-2">
                  {(m.module_lessons ?? [])
                    .sort((a, b) => a.sort - b.sort)
                    .map((ml) => {
                      const lesson = ml.lessons as unknown as {
                        id: string;
                        title: string;
                        est_minutes: number;
                      } | null;
                      if (!lesson) return null;
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/learn/${lesson.id}`}
                            className="flex items-center justify-between rounded-lg border border-line-soft px-4 py-3 text-sm font-medium transition-colors duration-150 hover:border-accent/40 hover:text-accent"
                          >
                            <span>{lesson.title}</span>
                            <span className="text-xs text-muted-fg">
                              ~{lesson.est_minutes} min
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-16 border-t border-line-soft pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-fg">
          Bibliography
        </h2>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-fg">
          {(sources ?? []).map((s) => (
            <li key={s.id}>
              {s.author ? `${s.author}, ` : ""}
              <em>{s.title}</em>
              {s.publisher ? ` (${s.publisher}${s.year ? `, ${s.year}` : ""})` : ""}
              {!s.publisher && s.year ? ` (${s.year})` : ""}
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
