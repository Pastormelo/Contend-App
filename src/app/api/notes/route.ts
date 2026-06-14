import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/** GET ?lessonId= — list the user's notes (optionally for one lesson). */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lessonId = new URL(request.url).searchParams.get("lessonId");
  let query = supabase
    .from("notes")
    .select("id, title, body, track_slug, lesson_id, lesson_title, section, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (lessonId) query = query.eq("lesson_id", lessonId);

  const { data } = await query;
  return NextResponse.json({ notes: data ?? [] });
}

const createSchema = z.object({
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(1).max(20000),
  trackSlug: z.string().max(60).nullable().optional(),
  lessonId: z.string().uuid().nullable().optional(),
  lessonTitle: z.string().max(200).nullable().optional(),
  section: z.string().max(200).nullable().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: parsed.data.title || "Untitled note",
      body: parsed.data.body,
      track_slug: parsed.data.trackSlug ?? null,
      lesson_id: parsed.data.lessonId ?? null,
      lesson_title: parsed.data.lessonTitle ?? null,
      section: parsed.data.section ?? null,
    })
    .select("id, title, body, track_slug, lesson_id, lesson_title, section, updated_at")
    .single();

  if (error) return NextResponse.json({ error: "Could not save" }, { status: 400 });
  return NextResponse.json({ note: data });
}
