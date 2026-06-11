import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { REVIEW_QUEUE_CAP } from "@/lib/config";

/** Today's due cards — overdue first, capped at 30. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const { data: rows, error } = await service
    .from("card_reviews")
    .select("card_id, mode, state, cards(id, type, front, back, skeleton)")
    .eq("user_id", user.id)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true })
    .limit(REVIEW_QUEUE_CAP);

  if (error) {
    return NextResponse.json({ error: "Queue unavailable" }, { status: 500 });
  }

  return NextResponse.json({
    cards: (rows ?? []).map((r) => {
      const card = r.cards as unknown as {
        id: string;
        type: string;
        front: unknown;
        back: unknown;
        skeleton: unknown;
      };
      return {
        cardId: r.card_id,
        mode: r.mode,
        state: r.state,
        type: card.type,
        front: card.front,
        back: card.back,
        skeleton: card.skeleton,
      };
    }),
  });
}
