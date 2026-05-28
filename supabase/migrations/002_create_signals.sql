create table public.signals (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 2000),
  signal_type text not null default 'signal',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  available_at timestamptz not null default now(),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index signals_targeted_read_idx
on public.signals (sort_order, available_at)
where player_id is not null and status = 'published';

create index signals_global_read_idx
on public.signals (sort_order, available_at)
where player_id is null and status = 'published';

alter table public.signals enable row level security;

create policy "Signals are readable by authenticated players"
on public.signals for select
to authenticated
using (
  status = 'published'
  and available_at <= now()
  and (
    player_id is null
    or player_id = auth.uid()
  )
);

grant select on table public.signals to authenticated;
grant select on table public.signals to anon;

create trigger signals_set_updated_at
before update on public.signals
for each row
execute function public.set_updated_at();
