create table public.field_reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text check (title is null or char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'private' check (status in ('private', 'submitted', 'visible', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index field_reports_profile_created_idx
on public.field_reports (profile_id, created_at desc);

alter table public.field_reports enable row level security;

create policy "Field reports are insertable by owner"
on public.field_reports for insert
to authenticated
with check (
  profile_id = auth.uid()
  and status in ('private', 'submitted')
);

create policy "Field reports are readable by owner or when visible"
on public.field_reports for select
to authenticated
using (
  profile_id = auth.uid()
  or status = 'visible'
);

grant select, insert on table public.field_reports to authenticated;

create trigger field_reports_set_updated_at
before update on public.field_reports
for each row
execute function public.set_updated_at();
