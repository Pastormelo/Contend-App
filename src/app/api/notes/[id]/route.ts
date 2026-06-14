import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(20000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const update: { title?: string; body?: string; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.title !== undefined) update.title = parsed.data.title || "Untitled note";
  if (parsed.data.body !== undefined) update.body = parsed.data.body;

  const { error } = await supabase
    .from("notes")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Could not update" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
