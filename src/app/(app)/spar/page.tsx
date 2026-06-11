import { createClient, createServiceClient } from "@/lib/supabase/server";
import { SparConfig } from "@/components/spar/spar-config";

export const metadata = { title: "Spar" };

export default async function SparPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Persona display fields via the service client — system_prompt stays
  // server-side and is never selected here.
  const service = createServiceClient();
  const { data: persona } = await service
    .from("personas")
    .select("id, name, difficulty, scenario_card")
    .eq("status", "published")
    .eq("difficulty", "civil")
    .limit(1)
    .maybeSingle();

  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Spar
        </h1>
        <p className="mt-2 text-sm text-muted-fg">
          A live conversation against a real-feeling opponent. The coach
          watches every word.
        </p>
        <div className="mt-8">
          {persona ? (
            <SparConfig
              personaId={persona.id}
              personaName={persona.name}
              scenario={persona.scenario_card}
            />
          ) : (
            <p className="text-sm text-muted-fg">No opponents available yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
