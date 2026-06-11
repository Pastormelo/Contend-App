import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { ScenarioCard } from "@/components/spar/scenario-card";
import { ChatThread, type ChatMessage } from "@/components/spar/chat-thread";

export const metadata = { title: "Sparring" };

export default async function SparSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  if (!z.string().uuid().safeParse(sessionId).success) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const service = createServiceClient();
  const { data: simulation } = await service
    .from("simulations")
    .select("id, status, user_id, personas(name, difficulty, scenario_card)")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!simulation) notFound();
  if (simulation.status !== "active") redirect(`/spar/${sessionId}/review`);

  const persona = simulation.personas as unknown as {
    name: string;
    difficulty: string;
    scenario_card: string;
  };

  const { data: messages } = await service
    .from("simulation_messages")
    .select("role, content")
    .eq("simulation_id", sessionId)
    .order("ts", { ascending: true });

  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-5 py-6 sm:px-6">
        <div className="sticky top-14 z-30 bg-background pb-1 pt-2">
          <ScenarioCard
            name={persona.name}
            difficulty={persona.difficulty}
            scenario={persona.scenario_card}
          />
        </div>
        <ChatThread
          simulationId={sessionId}
          initialMessages={(messages ?? []) as ChatMessage[]}
        />
      </main>
    </div>
  );
}
