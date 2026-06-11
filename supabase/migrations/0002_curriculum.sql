-- 0002: curriculum — tracks, levels, modules, lessons, blocks

create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type text not null check (type in ('doctrinal', 'opponent')),
  status text not null default 'coming'
    check (status in ('live', 'locked', 'coming')),
  sort int not null default 0
);

create table public.track_prereqs (
  track_id uuid not null references public.tracks (id) on delete cascade,
  requires_track_id uuid not null references public.tracks (id) on delete cascade,
  requires_level int not null,
  primary key (track_id, requires_track_id)
);

create table public.levels (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.tracks (id) on delete cascade,
  number int not null check (number between 1 and 6),
  title text not null,
  equipped_statement text not null,
  gate_config jsonb not null default '{}'::jsonb,
  status text not null default 'coming'
    check (status in ('live', 'coming')),
  unique (track_id, number)
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.levels (id) on delete cascade,
  title text not null,
  summary text,
  sort int not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'published'))
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  est_minutes int not null default 15,
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'published')),
  version int not null default 1,
  author_id uuid references public.profiles (id),
  reviewer_id uuid references public.profiles (id),
  published_at timestamptz
);

-- Join table: shared lessons can appear in multiple modules
create table public.module_lessons (
  module_id uuid not null references public.modules (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  sort int not null default 0,
  primary key (module_id, lesson_id)
);

create table public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  sort int not null default 0,
  type text not null check (type in
    ('prose', 'scripture', 'word_study', 'objection', 'term_callout',
     'citation', 'model_answer')),
  content jsonb not null default '{}'::jsonb
);

create index lesson_blocks_lesson_idx on public.lesson_blocks (lesson_id, sort);

-- RLS: authenticated users read curriculum content; admins manage everything
alter table public.tracks enable row level security;
alter table public.track_prereqs enable row level security;
alter table public.levels enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.module_lessons enable row level security;
alter table public.lesson_blocks enable row level security;

create policy "tracks: read" on public.tracks
  for select to authenticated using (true);
create policy "track_prereqs: read" on public.track_prereqs
  for select to authenticated using (true);
create policy "levels: read" on public.levels
  for select to authenticated using (true);
create policy "modules: read published" on public.modules
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "lessons: read published" on public.lessons
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "module_lessons: read" on public.module_lessons
  for select to authenticated using (true);
create policy "lesson_blocks: read published" on public.lesson_blocks
  for select to authenticated using (
    exists (
      select 1 from public.lessons l
      where l.id = lesson_id and (l.status = 'published' or public.is_admin())
    )
  );

create policy "tracks: admin write" on public.tracks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "track_prereqs: admin write" on public.track_prereqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "levels: admin write" on public.levels
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "modules: admin write" on public.modules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "lessons: admin write" on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "module_lessons: admin write" on public.module_lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "lesson_blocks: admin write" on public.lesson_blocks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
