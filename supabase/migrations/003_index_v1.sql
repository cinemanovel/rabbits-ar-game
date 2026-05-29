alter table public.profiles
add column case_number text,
add column tier text not null default 'UNCLASSIFIED',
add column region text check (region is null or char_length(region) <= 64);

alter table public.profiles
add constraint profiles_tier_check
check (tier in ('UNCLASSIFIED', 'RESTRICTED'));

-- RBT-016-000001 is reserved for Solomon / a future authored legacy Index entry.
-- Real authenticated player profiles begin at RBT-016-000002.
create sequence public.profile_case_number_seq start with 2;

grant usage on sequence public.profile_case_number_seq to authenticated;

with numbered_profiles as (
  select
    id,
    row_number() over (order by created_at asc, id asc) as row_num
  from public.profiles
  where case_number is null
)
update public.profiles as profiles
set case_number = 'RBT-016-' || lpad((numbered_profiles.row_num + 1)::text, 6, '0')
from numbered_profiles
where profiles.id = numbered_profiles.id;

alter table public.profiles
alter column case_number set not null;

alter table public.profiles
add constraint profiles_case_number_format_check
check (case_number ~ '^RBT-[0-9]{3}-[0-9]{6}$');

create unique index profiles_case_number_unique_idx on public.profiles (case_number);

select setval(
  'public.profile_case_number_seq',
  coalesce(
    (
      select max(substring(case_number from 9)::bigint)
      from public.profiles
    ),
    1
  ) + 1,
  false
);

create or replace function public.assign_profile_case_number()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.case_number is null then
    new.case_number := 'RBT-016-' || lpad(nextval('public.profile_case_number_seq')::text, 6, '0');
  end if;

  return new;
end;
$$;

create trigger profiles_assign_case_number
before insert or update on public.profiles
for each row
when (new.case_number is null)
execute function public.assign_profile_case_number();

-- TODO(Index v1): Add Solomon as an authored legacy Index entry at RBT-016-000001
-- when a safe non-auth static index entry pattern exists. Not implemented in this pass.

create or replace view public.the_index
with (security_invoker = false)
as
select
  case_number,
  display_name,
  handle,
  tier,
  region,
  updated_at as last_active_at
from public.profiles
where onboarding_completed = true
  and case_number is not null;

grant select on public.the_index to authenticated;
