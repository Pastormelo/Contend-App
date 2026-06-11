import { ReviewSession } from "@/components/cards/review-session";

export const metadata = { title: "Review" };

export default function ReviewPage() {
  return (
    <div data-mode="focus" className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-12 sm:px-6">
        <ReviewSession />
      </main>
    </div>
  );
}
