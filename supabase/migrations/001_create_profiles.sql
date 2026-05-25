create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 48),
  handle text not null check (
    char_length(handle) between 3 and 24
    and handle = lower(handle)
    and handle ~ '^[a-z0-9_]+$'
  ),
  bio text not null default '' check (char_length(bio) <= 160),
  avatar_placeholder text not null default 'signal' check (char_length(avatar_placeholder) between 1 and 32),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_handle_unique_idx on public.profiles (lower(handle));

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Profiles are insertable by owner"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Profiles are updateable by owner"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Profiles are deleteable by owner"
on public.profiles for delete
to authenticated
using (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();
