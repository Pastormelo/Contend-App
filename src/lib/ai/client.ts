// The single AI seam (build-plan §14): every model call goes through here
// so usage is always logged and models/keys stay configuration.

import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import type { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { MODEL_COSTS } from "@/lib/config";

export function estimateCost(
  model: string,
  tokensIn: number,
  tokensOut: number,
): number {
  const costs = MODEL_COSTS[model];
  if (!costs) return 0;
  return (tokensIn * costs.input + tokensOut * costs.output) / 1_000_000;
}

export async function logUsage(
  service: SupabaseClient<Database>,
  {
    userId,
    feature,
    model,
    tokensIn,
    tokensOut,
  }: {
    userId: string;
    feature: string;
    model: string;
    tokensIn: number;
    tokensOut: number;
  },
): Promise<void> {
  await service.from("usage_log").insert({
    user_id: userId,
    feature,
    model,
    tokens_in: tokensIn,
    tokens_out: tokensOut,
    est_cost: estimateCost(model, tokensIn, tokensOut),
    key_source: "shared",
  });
}

/** Structured (Zod-validated) generation with usage logging. */
export async function generateStructured<T>(
  service: SupabaseClient<Database>,
  {
    userId,
    feature,
    model,
    system,
    prompt,
    schema,
    temperature = 0.2,
  }: {
    userId: string;
    feature: string;
    model: string;
    system: string;
    prompt: string;
    schema: z.ZodType<T>;
    temperature?: number;
  },
): Promise<T> {
  const result = await generateObject({
    model: anthropic(model),
    system,
    prompt,
    schema,
    temperature,
  });

  await logUsage(service, {
    userId,
    feature,
    model,
    tokensIn: result.usage.inputTokens ?? 0,
    tokensOut: result.usage.outputTokens ?? 0,
  });

  return result.object;
}

export { anthropic };
