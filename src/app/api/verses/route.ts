import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getVerse } from "@/lib/esv";

const querySchema = z.object({
  ref: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[\w\s.:\-–;,]+$/u),
});

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ ref: searchParams.get("ref") });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
  }

  const verse = await getVerse(parsed.data.ref);
  if (!verse) {
    return NextResponse.json(
      { error: "Verse unavailable" },
      { status: 502 },
    );
  }

  return NextResponse.json(verse);
}
