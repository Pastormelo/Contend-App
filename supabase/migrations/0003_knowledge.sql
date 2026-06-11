-- 0003: knowledge base — sources, citations, glossary, verses cache

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in
    ('scripture', 'public_domain', 'melo_notes',
     'copyrighted_reference', 'opponent_publication')),
  title text not null,
  author text,
  publisher text,
  year int,
  edition text,
  url text,
  notes text
);

create table public.citations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources (id) on delete cascade,
  lesson_block_id uuid references public.lesson_blocks (id) on delete cascade,
  locator text,
  excerpt_text text,
  is_excerpt boolean not null default false,
  excerpt_words int
);

create table public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term text not null unique,
  short_blurb text not null,
  full_definition text,
  original_script text,
  transliteration text,
  language text
);

create table public.verses_cache (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  translation text not null default 'ESV',
  text text not null,
  fetched_at timestamptz not null default now(),
  unique (reference, translation)
);

alter table public.sources enable row level security;
alter table public.citations enable row level security;
alter table public.glossary_terms enable row level security;
alter table public.verses_cache enable row level security;

create policy "sources: read" on public.sources
  for select to authenticated using (true);
create policy "citations: read" on public.citations
  for select to authenticated using (true);
create policy "glossary: read" on public.glossary_terms
  for select to authenticated using (true);
create policy "verses_cache: read" on public.verses_cache
  for select to authenticated using (true);

create policy "sources: admin write" on public.sources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "citations: admin write" on public.citations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "glossary: admin write" on public.glossary_terms
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
