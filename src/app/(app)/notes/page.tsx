import { createClient } from "@/lib/supabase/server";
import { NotesManager, type Note } from "@/components/notes/notes-manager";
import { Kicker } from "@/components/ui/editorial";

export const metadata = { title: "Notes" };

export default async function NotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, body, track_slug, lesson_id, lesson_title, section, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6">
      <Kicker tone="muted">Your journal</Kicker>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Notes
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-fg">
        Everything you jot down, organized by course and lesson. Notes you take
        inside a lesson file themselves here automatically.
      </p>
      <div className="mt-10">
        <NotesManager notes={(notes ?? []) as Note[]} />
      </div>
    </main>
  );
}
