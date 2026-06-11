-- 0007: progress — track progress, XP ledger, streaks, badges, intake

create table public.user_track_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  track_id uuid not null references public.tracks (id) on delete cascade,
  current_level int not null default 1,
  gates_passed jsonb not null default '{}'::jsonb,
  gate_attempt_locks jsonb not null default '{}'::jsonb,
  primary key (user_id, track_id)
);

-- Append-only ledger: all XP totals derive from this table
create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount int not null,
  reason text not null,
  ref_id uuid,
  created_at timestamptz not null default now()
);

create index xp_events_user_idx on public.xp_events (user_id, created_at desc);

create table public.streaks (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  current int not null default 0,
  longest int not null default 0,
  grace_days int not null default 0,
  last_active date
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tier text,
  criteria jsonb not null default '{}'::jsonb,
  hidden boolean not null default false
);

create table public.user_badges (
  user_id uuid not null references public.profiles (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table public.intake_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  placements jsonb not null default '{}'::jsonb,
  rationale text,
  created_at timestamptz not null default now()
);

alter table public.user_track_progress enable row level security;
alter table public.xp_events enable row level security;
alter table public.streaks enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.intake_attempts enable row level security;

create policy "user_track_progress: read own" on public.user_track_progress
  for select to authenticated using (user_id = auth.uid());
create policy "xp_events: read own" on public.xp_events
  for select to authenticated using (user_id = auth.uid());
create policy "streaks: read own" on public.streaks
  for select to authenticated using (user_id = auth.uid());
create policy "badges: read" on public.badges
  for select to authenticated using (true);
create policy "user_badges: read own" on public.user_badges
  for select to authenticated using (user_id = auth.uid());
create policy "intake_attempts: read own" on public.intake_attempts
  for select to authenticated using (user_id = auth.uid());

create policy "badges: admin write" on public.badges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
