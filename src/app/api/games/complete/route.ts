import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { awardXp } from "@/lib/xp";
import { XP } from "@/lib/config";

const bodySchema = z.object({
  game: z.enum(["gauntlet", "match", "creed"]),
});

/** Award game XP — once per game per day (no farming). */
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

  const reason = `game_${parsed.data.game}`;
  const service = createServiceClient();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { data: existing } = await service
    .from("xp_events")
    .select("id")
    .eq("user_id", user.id)
    .eq("reason", reason)
    .gte("created_at", startOfDay.toISOString())
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ xpAwarded: 0 });
  }

  await awardXp(service, user.id, XP.gameComplete, reason);
  return NextResponse.json({ xpAwarded: XP.gameComplete });
}
