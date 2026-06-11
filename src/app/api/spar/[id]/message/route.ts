import { NextResponse } from "next/server";
import { z } from "zod";
import { streamText } from "ai";
import { anthropic, logUsage } from "@/lib/ai/client";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { AI_TEMPERATURE, MODELS } from "@/lib/config";

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
});

/** User message in → streamed Haiku persona reply out, both persisted. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: simulationId } = await params;
  if (!z.string().uuid().safeParse(simulationId).success) {
    return NextResponse.json({ error: "Invalid simulation" }, { status: 400 });
  }

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

  const service = createServiceClient();
  const { data: simulation } = await service
    .from("simulations")
    .select("id, status, personas(system_prompt)")
    .eq("id", simulationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!simulation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (simulation.status !== "active") {
    return NextResponse.json({ error: "Conversation ended" }, { status: 409 });
  }

  const systemPrompt = (
    simulation.personas as unknown as { system_prompt: string }
  ).system_prompt;

  await service.from("simulation_messages").insert({
    simulation_id: simulationId,
    role: "user",
    content: parsed.data.message,
  });

  const { data: history } = await service
    .from("simulation_messages")
    .select("role, content")
    .eq("simulation_id", simulationId)
    .order("ts", { ascending: true });

  const result = streamText({
    model: anthropic(MODELS.opponent),
    system: systemPrompt,
    temperature: AI_TEMPERATURE.persona,
    messages: (history ?? []).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    })),
    onFinish: async ({ text, usage }) => {
      await service.from("simulation_messages").insert({
        simulation_id: simulationId,
        role: "opponent",
        content: text,
      });
      await logUsage(service, {
        userId: user.id,
        feature: "spar_message",
        model: MODELS.opponent,
        tokensIn: usage.inputTokens ?? 0,
        tokensOut: usage.outputTokens ?? 0,
      });
    },
  });

  return result.toTextStreamResponse();
}
