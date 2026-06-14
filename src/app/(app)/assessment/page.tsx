import { AssessmentRunner } from "@/components/assessment/assessment-runner";

export const metadata = { title: "Placement Assessment" };

export default function AssessmentPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
        Find your starting point
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Where should you start?
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-fg">
        A short, honest read on what you already know — and where on the path
        your training should begin.
      </p>
      <div className="mt-10">
        <AssessmentRunner />
      </div>
    </main>
  );
}
