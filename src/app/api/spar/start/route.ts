import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  personaId: z.string().uuid(),
});

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

  const service = createServiceClient();
  const { data: persona } = await service
    .from("personas")
    .select("id, difficulty, status")
    .eq("id", parsed.data.personaId)
    .eq("status", "published")
    .maybeSingle();

  if (!persona) {
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });
  }
  // v1: only Civil personas are unlocked
  if (persona.difficulty !== "civil") {
    return NextResponse.json({ error: "Difficulty locked" }, { status: 403 });
  }

  const { data: simulation, error } = await service
    .from("simulations")
    .insert({
      user_id: user.id,
      persona_id: persona.id,
      mode: "text",
      toggles: {},
      status: "active",
    })
    .select("id")
    .single();

  if (error || !simulation) {
    return NextResponse.json({ error: "Could not start" }, { status: 500 });
  }

  return NextResponse.json({ simulationId: simulation.id });
}
