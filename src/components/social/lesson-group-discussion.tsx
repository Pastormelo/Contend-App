import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GroupChat, type ChatMessage } from "@/components/social/group-chat";

/**
 * Lesson-scoped group discussion, shown at the end of a lesson. If the user
 * belongs to a group studying this course, it surfaces that group's thread
 * for this specific lesson; otherwise it nudges them toward groups.
 */
export async function LessonGroupDiscussion({
  lessonId,
  trackSlug,
}: {
  lessonId: string;
  trackSlug?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);
  const groupIds = (memberships ?? []).map((m) => m.group_id);

  const { data: groups } = groupIds.length
    ? await supabase
        .from("study_groups")
        .select("id, name, track_slug")
        .in("id", groupIds)
    : { data: [] };

  const group = (groups ?? []).find((g) => g.track_slug === trackSlug);

  if (!group) {
    return (
      <section className="mt-16 border-t border-line-soft pt-8">
        <div className="rounded-card border border-line-soft bg-foreground/[0.02] p-5 text-sm leading-relaxed text-muted-fg">
          Studying this with others?{" "}
          <Link href="/groups" className="font-medium text-accent hover:text-accent-deep">
            Create or join a study group
          </Link>{" "}
          to discuss each lesson and see everyone&apos;s progress.
        </div>
      </section>
    );
  }

  const { data: msgs } = await supabase
    .from("group_messages")
    .select("id, user_id, body")
    .eq("group_id", group.id)
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: true })
    .limit(200);

  const authorIds = Array.from(new Set((msgs ?? []).map((m) => m.user_id)));
  const { data: profiles } = authorIds.length
    ? await supabase.from("profiles").select("id, name").in("id", authorIds)
    : { data: [] };
  const nameOf = new Map((profiles ?? []).map((p) => [p.id, p.name ?? "Member"]));

  const messages: ChatMessage[] = (msgs ?? []).map((m) => ({
    id: m.id,
    author: nameOf.get(m.user_id) ?? "Member",
    body: m.body,
    mine: m.user_id === user.id,
  }));

  return (
    <section className="mt-16 border-t border-line-soft pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {group.name}
      </p>
      <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">
        Discuss this lesson
      </h2>
      <p className="mt-1 text-sm text-muted-fg">
        What stood out to you? Leave a note for your group on this lesson.
      </p>
      <div className="mt-4">
        <GroupChat
          groupId={group.id}
          lessonId={lessonId}
          messages={messages}
          placeholder="What stood out in this lesson?"
        />
      </div>
    </section>
  );
}
