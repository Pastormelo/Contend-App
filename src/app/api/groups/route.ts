import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { course } from "@/lib/courses";

function makeCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

const bodySchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("create"),
    name: z.string().trim().min(2).max(60),
    trackSlug: z.string().max(60).optional(),
  }),
  z.object({ op: z.literal("join"), code: z.string().trim().min(4).max(12) }),
  z.object({ op: z.literal("leave"), groupId: z.string().uuid() }),
]);

export async function POST(request: Request) {
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

  if (parsed.data.op === "create") {
    const trackSlug =
      parsed.data.trackSlug && course(parsed.data.trackSlug)
        ? parsed.data.trackSlug
        : null;

    // Generate a unique invite code (retry a few times)
    let code = makeCode();
    for (let i = 0; i < 5; i++) {
      const { data: clash } = await service
        .from("study_groups")
        .select("id")
        .eq("invite_code", code)
        .maybeSingle();
      if (!clash) break;
      code = makeCode();
    }

    const { data: group, error } = await service
      .from("study_groups")
      .insert({
        name: parsed.data.name,
        track_slug: trackSlug,
        invite_code: code,
        owner_id: user.id,
      })
      .select("id")
      .single();
    if (error || !group) {
      return NextResponse.json({ error: "Could not create group" }, { status: 400 });
    }

    await service.from("group_members").insert({
      group_id: group.id,
      user_id: user.id,
      role: "owner",
    });
    return NextResponse.json({ ok: true, groupId: group.id, code });
  }

  if (parsed.data.op === "join") {
    const { data: group } = await service
      .from("study_groups")
      .select("id")
      .eq("invite_code", parsed.data.code.toUpperCase())
      .maybeSingle();
    if (!group) {
      return NextResponse.json({ error: "No group with that code" }, { status: 404 });
    }
    await service
      .from("group_members")
      .upsert(
        { group_id: group.id, user_id: user.id, role: "member" },
        { onConflict: "group_id,user_id", ignoreDuplicates: true },
      );
    return NextResponse.json({ ok: true, groupId: group.id });
  }

  // leave
  await service
    .from("group_members")
    .delete()
    .eq("group_id", parsed.data.groupId)
    .eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
