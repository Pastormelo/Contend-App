import { NextResponse } from "next/server";
import { z } from "zod";
import { getVerse } from "@/lib/esv";

const querySchema = z.object({
  ref: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[\w\s.:\-–;,]+$/u),
});

// Public on purpose: scripture popovers render on the marketing pages too.
// References are strictly validated and responses come from verses_cache
// after the first fetch, so ESV API usage stays minimal.
export async function GET(request: Request) {
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

  return NextResponse.json(verse, {
    headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400" },
  });
}
