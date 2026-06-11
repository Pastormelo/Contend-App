import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { gradeCard, type CardType, type ReviewGrade, type SrsState } from "@/lib/srs";
import { awardXp } from "@/lib/xp";
import { XP } from "@/lib/config";

const bodySchema = z.object({
  cardId: z.string().uuid(),
  grade: z.enum(["again", "hard", "good", "easy"]),
});

/** SM-2 update for one card; credits streak + 15 XP when the queue empties. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { cardId, grade } = parsed.data;

  const service = createServiceClient();
  const { data: review } = await service
    .from("card_reviews")
    .select("ease, interval_days, due_at, mode, state, streak, cards(type)")
    .eq("user_id", user.id)
    .eq("card_id", cardId)
    .maybeSingle();

  if (!review) {
    return NextResponse.json({ error: "Card not in your queue" }, { status: 404 });
  }

  const cardType = (review.cards as unknown as { type: CardType }).type;
  const next = gradeCard(
    {
      ease: review.ease,
      interval_days: review.interval_days,
      due_at: review.due_at,
      mode: review.mode,
      state: review.state,
      streak: review.streak,
    } as SrsState,
    grade as ReviewGrade,
    cardType,
  );

  await service
    .from("card_reviews")
    .update({
      ease: next.ease,
      interval_days: next.interval_days,
      due_at: next.due_at,
      mode: next.mode,
      state: next.state,
      streak: next.streak,
    })
    .eq("user_id", user.id)
    .eq("card_id", cardId);

  // Queue completion: all due cards graded → +15 XP once per day + streak
  const { count: remaining } = await service
    .from("card_reviews")
    .select("card_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("due_at", new Date().toISOString());

  let xpAwarded = 0;
  if ((remaining ?? 0) === 0) {
    const todayStart = `${new Date().toISOString().slice(0, 10)}T00:00:00Z`;
    const { data: todayAward } = await service
      .from("xp_events")
      .select("id")
      .eq("user_id", user.id)
      .eq("reason", "queue_complete")
      .gte("created_at", todayStart)
      .limit(1);
    if (!todayAward?.length) {
      xpAwarded = XP.queueComplete;
      await awardXp(service, user.id, xpAwarded, "queue_complete");
    }
  }

  return NextResponse.json({
    next: {
      interval_days: next.interval_days,
      due_at: next.due_at,
      mode: next.mode,
      state: next.state,
    },
    remaining: remaining ?? 0,
    xpAwarded,
  });
}
