import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  game: z.enum(["gauntlet", "match", "creed"]),
  score: z.number().int().min(0).max(100000),
});

/** Record a game score, keeping the user's best (powers the leaderboard). */
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
  const { data: existing } = await service
    .from("game_scores")
    .select("best_score")
    .eq("user_id", user.id)
    .eq("game", parsed.data.game)
    .maybeSingle();

  const prevBest = existing?.best_score ?? 0;
  if (parsed.data.score > prevBest) {
    await service.from("game_scores").upsert(
      {
        user_id: user.id,
        game: parsed.data.game,
        best_score: parsed.data.score,
        best_at: new Date().toISOString(),
      },
      { onConflict: "user_id,game" },
    );
    return NextResponse.json({ best: parsed.data.score, improved: true });
  }
  return NextResponse.json({ best: prevBest, improved: false });
}
