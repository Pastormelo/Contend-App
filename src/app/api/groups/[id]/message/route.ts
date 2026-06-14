import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  body: z.string().trim().min(1).max(2000),
  lessonId: z.string().uuid().nullable().optional(),
});

/** Post a message to a group thread (general, or scoped to a lesson). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: groupId } = await params;
  if (!z.string().uuid().safeParse(groupId).success) {
    return NextResponse.json({ error: "Invalid group" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const service = createServiceClient();

  // Must be a member to post.
  const { data: membership } = await service
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const { error } = await service.from("group_messages").insert({
    group_id: groupId,
    user_id: user.id,
    lesson_id: parsed.data.lessonId ?? null,
    body: parsed.data.body,
  });
  if (error) {
    return NextResponse.json({ error: "Could not post" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
