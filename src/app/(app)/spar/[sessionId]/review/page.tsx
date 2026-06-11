import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { CoachReport } from "@/components/spar/coach-report";
import type { Rubric } from "@/lib/ai/schemas";

export const metadata = { title: "Coach Report" };

export default async function CoachReportPage({
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
    .select("id, status")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!simulation) notFound();

  const { data: review } = await service
    .from("simulation_reviews")
    .select("*")
    .eq("simulation_id", sessionId)
    .maybeSingle();

  if (!review) redirect(`/spar/${sessionId}`);

  const { data: sources } = await service.from("sources").select("id, title");
  const sourceTitles = new Map((sources ?? []).map((s) => [s.id, s.title]));

  type Moment = { quote: string; note: string };

  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Coach report
        </h1>
        <p className="mt-2 text-sm text-muted-fg">
          Game film from your conversation — what held, what slipped, what to
          sharpen.
        </p>
        <div className="mt-10">
          <CoachReport
            rubric={review.rubric_scores as Rubric}
            moments={[
              review.best_moment as Moment | null,
              review.weak_moment as Moment | null,
              review.missed_opportunity as Moment | null,
            ]}
            suggestions={
              (review.suggestions as { point: string; citation_source_id: string | null }[]) ?? []
            }
            sourceTitles={sourceTitles}
            remediationLessonIds={(review.remediation_lesson_ids as string[]) ?? []}
          />
        </div>
      </main>
    </div>
  );
}
