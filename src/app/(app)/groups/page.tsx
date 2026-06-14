import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GroupsLauncher } from "@/components/social/groups-launcher";
import { COURSES, course } from "@/lib/courses";

export const metadata = { title: "Study Groups" };

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id, role")
    .eq("user_id", user.id);

  const groupIds = (memberships ?? []).map((m) => m.group_id);
  const { data: groups } = groupIds.length
    ? await supabase
        .from("study_groups")
        .select("id, name, track_slug, invite_code")
        .in("id", groupIds)
    : { data: [] };

  // Member counts
  const { data: allMembers } = groupIds.length
    ? await supabase.from("group_members").select("group_id").in("group_id", groupIds)
    : { data: [] };
  const countOf = new Map<string, number>();
  for (const m of allMembers ?? []) {
    countOf.set(m.group_id, (countOf.get(m.group_id) ?? 0) + 1);
  }

  const courseChoices = COURSES.filter((c) => c.hasContent).map((c) => ({
    slug: c.slug,
    title: c.title,
    number: c.number,
  }));

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
        Train together
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Study groups
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-fg">
        Take a course together. Everyone&apos;s progress is visible to the
        group, and each lesson has a discussion box for what stood out. Invite
        people with a code — only signed-in members can see a group.
      </p>

      <div className="mt-8">
        <GroupsLauncher courses={courseChoices} />
      </div>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Your groups
        </h2>
        {(groups ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted-fg">
            You&apos;re not in a group yet. Create one or join with a code.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {(groups ?? []).map((g) => {
              const c = g.track_slug ? course(g.track_slug) : undefined;
              return (
                <Link
                  key={g.id}
                  href={`/groups/${g.id}`}
                  className="card-interactive flex items-center justify-between rounded-card border border-line-soft bg-surface p-5 hover:border-accent/40"
                >
                  <span>
                    <span className="block font-display text-lg font-semibold tracking-tight">
                      {g.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-fg">
                      {c ? `Studying ${c.title}` : "No course selected"} ·{" "}
                      {countOf.get(g.id) ?? 1} member
                      {(countOf.get(g.id) ?? 1) === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span className="font-display text-xl text-muted-fg" aria-hidden>→</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
