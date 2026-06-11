import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LevelLadder } from "@/components/progress/level-ladder";
import { Badge } from "@/components/ui/badge";

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

  if (!track || track.status !== "live") notFound();

  const [{ data: levels }, { data: passedAttempts }] = await Promise.all([
    supabase
      .from("levels")
      .select("id, number, title, equipped_statement, status")
      .eq("track_id", track.id)
      .order("number"),
    supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("passed", true)
      .limit(1),
  ]);

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

  // Bibliography: every source cited by this track's lessons
  const { data: sources } = await supabase
    .from("sources")
    .select("id, source_type, title, author, publisher, year")
    .order("author");

  const lessonsComplete = passedAttempts && passedAttempts.length > 0 ? 1 : 0;
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
