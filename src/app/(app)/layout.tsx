import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: xpRows }, { data: streak }] =
    await Promise.all([
      supabase.from("profiles").select("name").eq("id", user.id).single(),
      supabase.from("xp_events").select("amount").eq("user_id", user.id),
      supabase.from("streaks").select("current").eq("user_id", user.id).maybeSingle(),
    ]);

  const xp = (xpRows ?? []).reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader
        name={profile?.name ?? "Defender"}
        email={user.email ?? ""}
        xp={xp}
        streak={streak?.current ?? 0}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
