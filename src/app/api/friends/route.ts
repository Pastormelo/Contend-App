import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/** GET ?q= — search profiles by name to add as friends. */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const { data } = await supabase
    .from("profiles")
    .select("id, name")
    .ilike("name", `%${q}%`)
    .neq("id", user.id)
    .limit(8);

  return NextResponse.json({ results: data ?? [] });
}

const bodySchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("request"), addresseeId: z.string().uuid() }),
  z.object({ op: z.literal("accept"), friendshipId: z.string().uuid() }),
  z.object({ op: z.literal("remove"), friendshipId: z.string().uuid() }),
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

  if (parsed.data.op === "request") {
    if (parsed.data.addresseeId === user.id) {
      return NextResponse.json({ error: "Can't friend yourself" }, { status: 400 });
    }
    // If a friendship already exists either direction, do nothing noisy.
    const { data: existing } = await supabase
      .from("friendships")
      .select("id, status, requester_id, addressee_id")
      .or(
        `and(requester_id.eq.${user.id},addressee_id.eq.${parsed.data.addresseeId}),and(requester_id.eq.${parsed.data.addresseeId},addressee_id.eq.${user.id})`,
      )
      .maybeSingle();
    if (existing) return NextResponse.json({ ok: true, already: true });

    const { error } = await supabase.from("friendships").insert({
      requester_id: user.id,
      addressee_id: parsed.data.addresseeId,
    });
    if (error) return NextResponse.json({ error: "Could not send request" }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.op === "accept") {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", parsed.data.friendshipId)
      .eq("addressee_id", user.id);
    if (error) return NextResponse.json({ error: "Could not accept" }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  // remove / decline
  await supabase.from("friendships").delete().eq("id", parsed.data.friendshipId);
  return NextResponse.json({ ok: true });
}
