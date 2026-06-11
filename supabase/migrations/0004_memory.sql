-- 0004: memory — decks, cards, card_reviews (SM-2 state)

create table public.decks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  scope text not null default 'core' check (scope in ('core', 'user')),
  level_id uuid references public.levels (id) on delete set null,
  owner_id uuid references public.profiles (id) on delete cascade
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks (id) on delete cascade,
  type text not null check (type in ('scripture', 'term', 'argument')),
  front jsonb not null default '{}'::jsonb,
  back jsonb not null default '{}'::jsonb,
  skeleton jsonb
);

create table public.card_reviews (
  user_id uuid not null references public.profiles (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  ease float not null default 2.3,
  interval_days int not null default 0,
  due_at timestamptz not null default now(),
  mode text not null default 'read'
    check (mode in ('read', 'first_letter', 'cloze', 'typed')),
  state text not null default 'new'
    check (state in ('new', 'learning', 'learned', 'mature')),
  streak int not null default 0,
  primary key (user_id, card_id)
);

create index card_reviews_due_idx on public.card_reviews (user_id, due_at);

alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.card_reviews enable row level security;

create policy "decks: read core or own" on public.decks
  for select to authenticated
  using (scope = 'core' or owner_id = auth.uid() or public.is_admin());
create policy "cards: read" on public.cards
  for select to authenticated using (
    exists (
      select 1 from public.decks d
      where d.id = deck_id
        and (d.scope = 'core' or d.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy "card_reviews: read own" on public.card_reviews
  for select to authenticated using (user_id = auth.uid());
-- Writes happen via server routes (service client)

create policy "decks: admin write" on public.decks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "cards: admin write" on public.cards
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
