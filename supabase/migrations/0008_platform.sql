-- 0008: platform — rubric prompts, AI drafts, BYOK keys, usage log

create table public.rubric_prompts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  prompt_text text not null,
  version int not null default 1,
  active boolean not null default false
);

create table public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  accepted boolean not null default false,
  created_at timestamptz not null default now()
);

-- BYOK: encrypted at rest, never returned to the client after save
create table public.api_keys_user (
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null,
  encrypted_key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, provider)
);

create table public.usage_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  feature text not null,
  model text not null,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  est_cost numeric(10, 6) not null default 0,
  key_source text not null default 'shared' check (key_source in ('byok', 'shared')),
  created_at timestamptz not null default now()
);

create index usage_log_user_idx on public.usage_log (user_id, created_at desc);

alter table public.rubric_prompts enable row level security;
alter table public.ai_drafts enable row level security;
alter table public.api_keys_user enable row level security;
alter table public.usage_log enable row level security;

-- All four tables: server/service-role + admin only. No user policies —
-- prompts, drafts, keys, and the usage ledger never reach the client.
create policy "rubric_prompts: admin only" on public.rubric_prompts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "ai_drafts: admin only" on public.ai_drafts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "usage_log: admin read" on public.usage_log
  for select to authenticated using (public.is_admin());
