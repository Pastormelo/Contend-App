import { notFound } from "next/navigation";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { QuizRunner, type ClientQuestion } from "@/components/quiz/quiz-runner";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  if (!z.string().uuid().safeParse(lessonId).success) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id")
    .eq("lesson_id", lessonId)
    .eq("kind", "checkpoint")
    .maybeSingle();
  if (!quiz) notFound();

  // Question prompts/options via the service client — the question_bank
  // table has no user read policy because it holds the answers. Only the
  // safe columns are selected and serialized here.
  const service = createServiceClient();
  const { data: questions } = await service
    .from("question_bank")
    .select("id, type, prompt, options")
    .eq("quiz_id", quiz.id)
    .eq("status", "published")
    .order("sort");

  if (!questions?.length) notFound();

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-12 sm:px-6">
      <h1 className="text-center font-display text-2xl font-semibold tracking-tight">
        Checkpoint
      </h1>
      <p className="mt-2 text-center text-sm text-muted-fg">
        Pass at 70% or better. Wrong answers point you back to the text.
      </p>
      <div className="mt-10">
        <QuizRunner
          quizId={quiz.id}
          questions={questions.map((q) => ({
            id: q.id,
            type: q.type as ClientQuestion["type"],
            prompt: q.prompt,
            options: q.options as string[] | null,
          }))}
        />
      </div>
    </main>
  );
}
