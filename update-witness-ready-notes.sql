-- WITNESS READY — notes/journal feature
-- Paste into the Supabase SQL Editor and click Run (creates the notes table).

-- 0010: notes — personal journal, auto-organized by course and section

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  track_slug text,
  lesson_id uuid references public.lessons (id) on delete set null,
  lesson_title text,
  section text,
  title text not null default 'Untitled note',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_user_idx on public.notes (user_id, updated_at desc);
create index notes_user_lesson_idx on public.notes (user_id, lesson_id);

alter table public.notes enable row level security;

-- Notes are private to their owner (full CRUD on own rows).
create policy "notes: select own" on public.notes
  for select to authenticated using (user_id = auth.uid());
create policy "notes: insert own" on public.notes
  for insert to authenticated with check (user_id = auth.uid());
create policy "notes: update own" on public.notes
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notes: delete own" on public.notes
  for delete to authenticated using (user_id = auth.uid());
