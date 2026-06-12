import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Account" };

async function updateName(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  if (!name) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ name }).eq("id", user.id);
  revalidatePath("/account");
  revalidatePath("/dashboard");
}

const REASON_LABELS: Record<string, string> = {
  lesson_complete: "Lessons finished",
  checkpoint_pass: "Quizzes passed",
  queue_complete: "Review days completed",
  respond_drill: "Drills taken",
  simulation_complete: "Sparring sessions",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: xpRows }, { data: streak }] =
    await Promise.all([
      supabase.from("profiles").select("name, created_at").eq("id", user.id).single(),
      supabase.from("xp_events").select("amount, reason").eq("user_id", user.id),
      supabase
        .from("streaks")
        .select("current, longest")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  const xp = (xpRows ?? []).reduce((sum, r) => sum + r.amount, 0);
  const counts = new Map<string, number>();
  for (const row of xpRows ?? []) {
    counts.set(row.reason, (counts.get(row.reason) ?? 0) + 1);
  }
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
        Account
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {profile?.name ?? "Defender"}
      </h1>
      {memberSince && (
        <p className="mt-1 text-sm text-muted-fg">
          {user.email} · Training since {memberSince}
        </p>
      )}

      <section className="mt-10 grid grid-cols-3 gap-3">
        {[
          { label: "Experience", value: xp.toLocaleString() + " XP" },
          { label: "Current streak", value: `${streak?.current ?? 0} days` },
          { label: "Longest streak", value: `${streak?.longest ?? 0} days` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-line-soft bg-surface p-4"
          >
            <p className="font-display text-xl font-semibold tabular-nums tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-fg">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-card border border-line-soft bg-surface p-5">
        <h2 className="text-sm font-semibold">Your training record</h2>
        <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {Object.entries(REASON_LABELS).map(([reason, label]) => (
            <div key={reason} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted-fg">{label}</dt>
              <dd className="text-sm font-medium tabular-nums">
                {counts.get(reason) ?? 0}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Profile
        </h2>
        <form action={updateName} className="mt-4 flex max-w-sm items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-muted-fg"
            >
              Display name
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={profile?.name ?? ""}
              maxLength={80}
              required
            />
          </div>
          <Button type="submit" variant="outline">
            Save
          </Button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          What these numbers mean
        </h2>
        <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted-fg">
          <p>
            <strong className="font-semibold text-foreground">
              Experience points (XP)
            </strong>{" "}
            measure the training you have actually done. Finishing a lesson
            earns 50, passing a quiz earns 25, clearing your daily review
            queue earns 15, and drills and sparring sessions are scored — a
            strong performance earns far more than a weak one, and a
            non-answer earns nothing. XP never goes down; it is the record of
            your work.
          </p>
          <p>
            <strong className="font-semibold text-foreground">
              Your streak
            </strong>{" "}
            (the flame) counts consecutive days with at least one piece of
            training completed. Defending the faith well is a skill, and
            skills are built daily — ten minutes every day beats two hours
            once a week. Miss a day and the streak resets to one the next
            time you train.
          </p>
          <p>
            <strong className="font-semibold text-foreground">Levels</strong>{" "}
            mark what you are equipped to do in a real conversation, from
            Beginner ("can explain the basics in plain language") up through
            Defender and beyond. You advance by completing a course&apos;s
            lessons and proving it under pressure.
          </p>
        </div>
      </section>

      <form action="/auth/signout" method="post" className="mt-12 border-t border-line-soft pt-6">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}
