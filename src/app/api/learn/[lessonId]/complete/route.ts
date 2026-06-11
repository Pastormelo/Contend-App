import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { awardXp } from "@/lib/xp";
import { XP } from "@/lib/config";

/**
 * Lesson completion: award 50 XP (once) and seed the lesson's deck into
 * the user's review queue (12 cards, due now).
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const { lessonId } = await params;
  if (!z.string().uuid().safeParse(lessonId).success) {
    return NextResponse.json({ error: "Invalid lesson" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  const { data: lesson } = await service
    .from("lessons")
    .select("id, status")
    .eq("id", lessonId)
    .eq("status", "published")
    .maybeSingle();
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // First completion only: XP + streak
  const { data: existing } = await service
    .from("xp_events")
    .select("id")
    .eq("user_id", user.id)
    .eq("reason", "lesson_complete")
    .eq("ref_id", lessonId)
    .limit(1);

  const firstCompletion = !existing?.length;
  if (firstCompletion) {
    await awardXp(service, user.id, XP.lessonComplete, "lesson_complete", lessonId);
  }

  // Seed the level's core deck into the review queue (due now)
  const { data: moduleRow } = await service
    .from("module_lessons")
    .select("modules(level_id)")
    .eq("lesson_id", lessonId)
    .limit(1)
    .maybeSingle();
  const levelId = (moduleRow?.modules as { level_id: string } | null)?.level_id;

  let seeded = 0;
  if (levelId) {
    const { data: decks } = await service
      .from("decks")
      .select("id")
      .eq("scope", "core")
      .eq("level_id", levelId);

    if (decks?.length) {
      const { data: cards } = await service
        .from("cards")
        .select("id")
        .in(
          "deck_id",
          decks.map((d) => d.id),
        );

      if (cards?.length) {
        const now = new Date().toISOString();
        const { error } = await service.from("card_reviews").upsert(
          cards.map((c) => ({
            user_id: user.id,
            card_id: c.id,
            due_at: now,
          })),
          { onConflict: "user_id,card_id", ignoreDuplicates: true },
        );
        if (!error) seeded = cards.length;
      }
    }
  }

  return NextResponse.json({
    awarded: firstCompletion ? XP.lessonComplete : 0,
    seeded,
  });
}
