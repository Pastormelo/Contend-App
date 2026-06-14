import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { GroupChat, type ChatMessage } from "@/components/social/group-chat";
import { course, CHECKPOINT_QUIZ_ID, type CourseSlug } from "@/lib/courses";

export const metadata = { title: "Study Group" };

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Must be a member.
  const { data: myMembership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!myMembership) redirect("/groups");

  const { data: group } = await supabase
    .from("study_groups")
    .select("id, name, track_slug, invite_code, owner_id")
    .eq("id", id)
    .single();
  if (!group) notFound();

  const { data: members } = await supabase
    .from("group_members")
    .select("user_id, role")
    .eq("group_id", id);
  const memberIds = (members ?? []).map((m) => m.user_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name")
    .in("id", memberIds.length ? memberIds : ["00000000-0000-0000-0000-000000000000"]);
  const nameOf = new Map((profiles ?? []).map((p) => [p.id, p.name ?? "Defender"]));

  // Member progress for the group's course (service client — we've confirmed
  // the requester is a member, and only completion status is exposed).
  const node = group.track_slug ? course(group.track_slug) : undefined;
  const checkpointId = node ? CHECKPOINT_QUIZ_ID[node.slug as CourseSlug] : undefined;
  const completedBy = new Set<string>();
  if (checkpointId) {
    const service = createServiceClient();
    const { data: passes } = await service
      .from("quiz_attempts")
      .select("user_id")
      .eq("quiz_id", checkpointId)
      .eq("passed", true)
      .in("user_id", memberIds);
    for (const p of passes ?? []) completedBy.add(p.user_id);
  }

  // General discussion (lesson_id null)
  const { data: msgs } = await supabase
    .from("group_messages")
    .select("id, user_id, body, created_at")
    .eq("group_id", id)
    .is("lesson_id", null)
    .order("created_at", { ascending: true })
    .limit(200);
  const messages: ChatMessage[] = (msgs ?? []).map((m) => ({
    id: m.id,
    author: nameOf.get(m.user_id) ?? "Member",
    body: m.body,
    mine: m.user_id === user.id,
  }));

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6">
      <div className="flex items-baseline justify-between">
        <Link href="/groups" className="text-sm font-medium text-muted-fg hover:text-foreground">
          ← Groups
        </Link>
        {node && (
          <Link
            href={`/tracks/${node.slug}`}
            className="text-sm font-medium text-accent hover:text-accent-deep"
          >
            Go to course →
          </Link>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        {group.name}
      </h1>
      <p className="mt-2 text-sm text-muted-fg">
        {node ? `Studying ${node.title}` : "No course selected"}
      </p>

      {/* Invite */}
      <div className="mt-6 flex items-center justify-between rounded-card border border-line-soft bg-foreground/[0.02] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-fg">
            Invite code
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-[0.2em]">
            {group.invite_code}
          </p>
        </div>
        <p className="max-w-[12rem] text-right text-xs leading-relaxed text-muted-fg">
          Share this code. Anyone signed in can join the group with it.
        </p>
      </div>

      {/* Members + progress */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Members ({memberIds.length})
        </h2>
        <ul className="mt-4 flex flex-col divide-y divide-line-soft rounded-card border border-line-soft">
          {(members ?? []).map((m) => (
            <li key={m.user_id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium">
                {nameOf.get(m.user_id) ?? "Member"}
                {m.user_id === user.id && <span className="ml-2 text-xs text-muted-fg">you</span>}
                {m.role === "owner" && <span className="ml-2 text-xs text-accent">owner</span>}
              </span>
              {node ? (
                completedBy.has(m.user_id) ? (
                  <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
                    Completed
                  </span>
                ) : (
                  <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-xs font-medium text-muted-fg">
                    In progress
                  </span>
                )
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {/* Group discussion */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Group discussion
        </h2>
        <p className="mt-1 text-sm text-muted-fg">
          The group&apos;s open thread. Lesson-specific notes live at the end
          of each lesson.
        </p>
        <div className="mt-4">
          <GroupChat groupId={group.id} messages={messages} />
        </div>
      </section>
    </main>
  );
}
