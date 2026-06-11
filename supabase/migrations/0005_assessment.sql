-- 0005: assessment — quizzes, question bank, attempts, written responses

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('checkpoint', 'gate', 'intake')),
  lesson_id uuid references public.lessons (id) on delete cascade,
  level_id uuid references public.levels (id) on delete cascade,
  config jsonb not null default '{}'::jsonb
);

-- Answers live here and are NEVER selectable by regular users (no read
-- policy below) — all grading happens server-side via the service client.
create table public.question_bank (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes (id) on delete cascade,
  type text not null check (type in
    ('mc', 'mc_multi', 'tfq', 'cloze', 'verse_match', 'written')),
  prompt text not null,
  options jsonb,
  answer jsonb not null,
  source_block_id uuid references public.lesson_blocks (id) on delete set null,
  difficulty int not null default 1 check (difficulty between 1 and 3),
  model_answer text,
  status text not null default 'published'
    check (status in ('draft', 'published')),
  stats jsonb not null default '{}'::jsonb,
  sort int not null default 0
);

create index question_bank_quiz_idx on public.question_bank (quiz_id, sort);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  score float not null,
  passed boolean not null default false,
  answers jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index quiz_attempts_user_idx on public.quiz_attempts (user_id, quiz_id);

create table public.written_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null check (source in ('gate', 'drill', 'lesson')),
  ref_id uuid,
  response_text text not null,
  rubric_scores jsonb,
  ai_feedback text,
  stronger_answer text,
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.quizzes enable row level security;
alter table public.question_bank enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.written_responses enable row level security;

create policy "quizzes: read" on public.quizzes
  for select to authenticated using (true);

-- question_bank: NO user select policy — answers are server-side only
create policy "question_bank: admin only" on public.question_bank
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "quiz_attempts: read own" on public.quiz_attempts
  for select to authenticated using (user_id = auth.uid());
create policy "written_responses: read own" on public.written_responses
  for select to authenticated using (user_id = auth.uid());

create policy "quizzes: admin write" on public.quizzes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
