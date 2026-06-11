import { RespondDrill } from "@/components/respond/respond-drill";
import { objectionOfTheDay } from "@/lib/ai/prompts/respond";

export const metadata = { title: "Respond" };

export default function RespondPage() {
  const objection = objectionOfTheDay();

  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Respond
        </h1>
        <p className="mt-2 text-sm text-muted-fg">
          The drill of the day. Answer clearly, biblically, and briefly — the
          coach scores all five rubric categories.
        </p>
        <div className="mt-8">
          <RespondDrill objection={objection} />
        </div>
      </main>
    </div>
  );
}
