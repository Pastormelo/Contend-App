-- 0001: identity — profiles, signup trigger, admin helper

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  role text not null default 'user'
    check (role in ('admin', 'editor', 'reviewer', 'instructor', 'user')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: is the current user an admin? (security definer so RLS on
-- profiles does not recurse)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Create a profile row for every new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
