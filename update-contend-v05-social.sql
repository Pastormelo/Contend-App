-- CONTEND v0.5 — social features (friends, leaderboard, study groups + chat)
-- Paste this whole file into the Supabase SQL Editor and click Run.
-- Safe to run once (creates new tables).

-- 0009: social — friends, leaderboard scores, study groups, group chat

-- ----------------------------------------------------------------------------
-- Minimal public profile visibility (display name) so leaderboards and
-- friend lists can show who's who. profiles holds only id/name/role/created_at.
-- ----------------------------------------------------------------------------
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read all authenticated" on public.profiles
  for select to authenticated using (true);

-- ----------------------------------------------------------------------------
-- Friendships (request → accept), symmetric once accepted
-- ----------------------------------------------------------------------------
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
create index friendships_addressee_idx on public.friendships (addressee_id, status);
create index friendships_requester_idx on public.friendships (requester_id, status);

alter table public.friendships enable row level security;

create policy "friendships: read own" on public.friendships
  for select to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());
create policy "friendships: request" on public.friendships
  for insert to authenticated
  with check (requester_id = auth.uid());
create policy "friendships: respond" on public.friendships
  for update to authenticated
  using (addressee_id = auth.uid() or requester_id = auth.uid())
  with check (addressee_id = auth.uid() or requester_id = auth.uid());
create policy "friendships: remove" on public.friendships
  for delete to authenticated
  using (addressee_id = auth.uid() or requester_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Game scores (best per user per game) — the leaderboard
-- ----------------------------------------------------------------------------
create table public.game_scores (
  user_id uuid not null references public.profiles (id) on delete cascade,
  game text not null check (game in ('gauntlet', 'match', 'creed')),
  best_score int not null default 0,
  best_at timestamptz not null default now(),
  primary key (user_id, game)
);

alter table public.game_scores enable row level security;

-- Leaderboard is visible to all signed-in users; writes go through the
-- service client in the game-completion route.
create policy "game_scores: read all" on public.game_scores
  for select to authenticated using (true);

-- ----------------------------------------------------------------------------
-- Study groups + membership + lesson-scoped discussion
-- ----------------------------------------------------------------------------
create table public.study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  track_slug text,
  invite_code text not null unique,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.study_groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete set null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index group_messages_idx on public.group_messages (group_id, lesson_id, created_at);

-- Membership helper (security definer to avoid policy recursion)
create or replace function public.is_group_member(g uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = g and user_id = auth.uid()
  );
$$;

alter table public.study_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_messages enable row level security;

create policy "study_groups: read if member" on public.study_groups
  for select to authenticated
  using (owner_id = auth.uid() or public.is_group_member(id));

create policy "group_members: read if member" on public.group_members
  for select to authenticated
  using (public.is_group_member(group_id));

create policy "group_messages: read if member" on public.group_messages
  for select to authenticated
  using (public.is_group_member(group_id));
-- Group creation, joining, and posting all go through server routes
-- (service client), so no INSERT/UPDATE/DELETE policies are granted here.
