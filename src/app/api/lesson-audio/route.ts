import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { lessonReadable } from "@/lib/lesson-tts";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "lesson-audio";
const OPENAI_VOICE: Record<string, string> = { male: "onyx", female: "shimmer" };
const TTS_MODEL = "tts-1";
const MAX_CHARS = 3800;

const querySchema = z.object({
  lessonId: z.string().uuid(),
  voice: z.enum(["male", "female"]).default("male"),
});

/** Split into request-sized chunks at sentence boundaries (TTS caps input length). */
function chunkText(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let buf = "";
  for (const s of sentences) {
    if ((buf + s).length > MAX_CHARS && buf) {
      chunks.push(buf);
      buf = s;
    } else {
      buf += s;
    }
  }
  if (buf.trim()) chunks.push(buf);
  return chunks;
}

/** One OpenAI TTS call → mp3 bytes (throws with a readable reason). */
async function synthesize(apiKey: string, voice: string, input: string): Promise<Buffer> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: OPENAI_VOICE[voice] ?? "onyx",
      input,
      response_format: "mp3",
    }),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    throw new Error(`tts_${res.status}: ${detail}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const debug = url.searchParams.get("debug") === "1";
  const parsed = querySchema.safeParse({
    lessonId: url.searchParams.get("lessonId"),
    voice: url.searchParams.get("voice") ?? "male",
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { lessonId, voice } = parsed.data;

  const service = createServiceClient();
  const path = `${lessonId}/${voice}.mp3`;
  const apiKey = process.env.OPENAI_API_KEY;

  /* -------- Fast self-test: isolates the failing stage in ~2s -------- */
  if (debug) {
    const report: Record<string, unknown> = {
      studioEnabled: false,
      hasOpenAIKey: !!apiKey,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };
    if (!apiKey) {
      report.next = "OPENAI_API_KEY is not visible to this deployment. Add it in Vercel → Settings → Environment Variables, then REDEPLOY.";
      return NextResponse.json(report);
    }
    // a) tiny TTS test (cheap — proves the key + billing work)
    try {
      const sample = await synthesize(apiKey, voice, "Witness Ready audio test.");
      report.tts = { ok: true, bytes: sample.length };
      // b) tiny storage test (proves bucket + upload + public URL work)
      try {
        await service.storage.createBucket(BUCKET, { public: true }).catch(() => {});
        const testPath = `_selftest/${voice}.mp3`;
        const { error: upErr } = await service.storage
          .from(BUCKET)
          .upload(testPath, sample, { contentType: "audio/mpeg", upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = service.storage.from(BUCKET).getPublicUrl(testPath);
        const head = await fetch(pub.publicUrl, { method: "HEAD" });
        report.storage = { ok: head.ok, publicStatus: head.status };
        report.studioEnabled = head.ok;
        report.next = head.ok
          ? "Everything works. Press play on a lesson — the first play generates the audio (10–30s), then it's instant."
          : `Audio generates but the storage bucket isn't publicly readable (HTTP ${head.status}). Make the "lesson-audio" bucket public in Supabase → Storage.`;
      } catch (e) {
        report.storage = { ok: false, error: String(e).slice(0, 300) };
        report.next = "Audio generates, but saving it to Supabase Storage failed (see error).";
      }
    } catch (e) {
      report.tts = { ok: false, error: String(e).slice(0, 300) };
      report.next =
        "OpenAI rejected the request. If the error says 'insufficient_quota', add prepaid credits at platform.openai.com → Billing. If it says 'invalid_api_key', the key is wrong or wasn't redeployed.";
    }
    return NextResponse.json(report);
  }

  /* -------- Normal path -------- */

  // 1) Serve from cache if we've generated this voice before.
  const { data: existing } = await service.storage
    .from(BUCKET)
    .list(lessonId, { search: `${voice}.mp3` });
  if (existing?.some((f) => f.name === `${voice}.mp3`)) {
    const { data } = service.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  }

  // 2) No studio key configured → tell the client to use browser voices.
  if (!apiKey) return NextResponse.json({ fallback: true, reason: "no_api_key" });

  // 3) Build the lesson's read-aloud text.
  const [{ data: lesson }, { data: blocks }] = await Promise.all([
    service
      .from("lessons")
      .select("title")
      .eq("id", lessonId)
      .eq("status", "published")
      .maybeSingle(),
    service
      .from("lesson_blocks")
      .select("type, content")
      .eq("lesson_id", lessonId)
      .order("sort"),
  ]);
  if (!lesson || !blocks?.length) {
    return NextResponse.json({ fallback: true, reason: "no_lesson" });
  }

  const text = lessonReadable(lesson.title, blocks).join("\n");
  const chunks = chunkText(text);

  // 4) Generate each chunk, then store one mp3.
  try {
    const buffers: Buffer[] = [];
    for (const chunk of chunks) {
      buffers.push(await synthesize(apiKey, voice, chunk));
    }
    const audio = Buffer.concat(buffers);

    await service.storage.createBucket(BUCKET, { public: true }).catch(() => {});
    const { error: upErr } = await service.storage
      .from(BUCKET)
      .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
    if (upErr) throw upErr;

    // Usage ledger: TTS bills per character.
    const chars = text.length;
    await service.from("usage_log").insert({
      user_id: user.id,
      feature: "lesson_audio",
      model: TTS_MODEL,
      tokens_in: chars,
      tokens_out: 0,
      est_cost: (chars / 1_000_000) * 15,
      key_source: "shared",
    });

    const { data } = service.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    // Graceful fallback to browser voices — but log the real reason.
    console.error("[lesson-audio] generation failed:", e);
    return NextResponse.json({ fallback: true, reason: String(e).slice(0, 200) });
  }
}
