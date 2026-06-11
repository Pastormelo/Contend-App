import { createServiceClient } from "@/lib/supabase/server";
import { ESV_TRANSLATION } from "@/lib/config";

const ESV_API_URL = "https://api.esv.org/v3/passage/text/";

/**
 * Fetch a passage, serving from verses_cache when present and writing
 * through to the cache on a miss.
 */
export async function getVerse(
  reference: string,
): Promise<{ reference: string; text: string; cached: boolean } | null> {
  const supabase = createServiceClient();

  const { data: cached } = await supabase
    .from("verses_cache")
    .select("reference, text")
    .eq("reference", reference)
    .eq("translation", ESV_TRANSLATION)
    .maybeSingle();

  if (cached) {
    return { reference: cached.reference, text: cached.text, cached: true };
  }

  const apiKey = process.env.ESV_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    q: reference,
    "include-passage-references": "false",
    "include-verse-numbers": "false",
    "include-first-verse-numbers": "false",
    "include-footnotes": "false",
    "include-headings": "false",
    "include-short-copyright": "false",
    "indent-paragraphs": "0",
    "indent-poetry": "false",
  });

  const res = await fetch(`${ESV_API_URL}?${params}`, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as { passages?: string[] };
  const text = json.passages?.[0]?.trim();
  if (!text) return null;

  await supabase
    .from("verses_cache")
    .upsert(
      { reference, translation: ESV_TRANSLATION, text },
      { onConflict: "reference,translation" },
    );

  return { reference, text, cached: false };
}
