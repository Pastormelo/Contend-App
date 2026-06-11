-- 0006: simulation — personas, simulations, messages, coach reviews

-- personas.system_prompt must never reach the client: no user read policy.
-- Display fields (name, scenario_card) are served by server components.
create table public.personas (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.tracks (id) on delete set null,
  name text not null,
  difficulty text not null default 'civil'
    check (difficulty in ('civil', 'standard', 'hostile', 'academic')),
  system_prompt text not null,
  source_refs jsonb not null default '[]'::jsonb,
  scenario_card text not null,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  version int not null default 1
);

create table public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  persona_id uuid not null references public.personas (id) on delete cascade,
  mode text not null default 'text' check (mode in ('text', 'voice')),
  toggles jsonb not null default '{}'::jsonb,
  status text not null default 'active'
    check (status in ('active', 'ended', 'reviewed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create index simulations_user_idx on public.simulations (user_id, started_at desc);

create table public.simulation_messages (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null references public.simulations (id) on delete cascade,
  role text not null check (role in ('user', 'opponent')),
  content text not null,
  ts timestamptz not null default now()
);

create index simulation_messages_sim_idx on public.simulation_messages (simulation_id, ts);

create table public.simulation_reviews (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null unique references public.simulations (id) on delete cascade,
  rubric_scores jsonb not null,
  best_moment jsonb,
  weak_moment jsonb,
  missed_opportunity jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  remediation_lesson_ids jsonb not null default '[]'::jsonb,
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.personas enable row level security;
alter table public.simulations enable row level security;
alter table public.simulation_messages enable row level security;
alter table public.simulation_reviews enable row level security;

-- personas: admin only via RLS; user-facing fields served server-side
create policy "personas: admin only" on public.personas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "simulations: read own" on public.simulations
  for select to authenticated using (user_id = auth.uid());
create policy "simulation_messages: read own" on public.simulation_messages
  for select to authenticated using (
    exists (
      select 1 from public.simulations s
      where s.id = simulation_id and s.user_id = auth.uid()
    )
  );
create policy "simulation_reviews: read own" on public.simulation_reviews
  for select to authenticated using (
    exists (
      select 1 from public.simulations s
      where s.id = simulation_id and s.user_id = auth.uid()
    )
  );
