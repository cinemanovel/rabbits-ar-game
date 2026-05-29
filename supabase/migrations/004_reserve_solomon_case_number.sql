-- Corrective migration: reserve RBT-016-000001 for Solomon.
--
-- 003_index_v1 was applied live before the Solomon reservation was enforced in SQL.
-- A real authenticated player profile may have received RBT-016-000001. Architecture
-- requires that slot stay reserved for a future authored legacy Index entry (Solomon).
-- Real player profiles must begin at RBT-016-000002.
--
-- If any real profile still holds RBT-016-000001, shift all RBT-016 case numbers up
-- by one suffix step in descending order to avoid unique-index collisions. If no real
-- profile holds 000001, existing case numbers are left unchanged.

do $$
declare
  r record;
begin
  if exists (
    select 1
    from public.profiles
    where case_number = 'RBT-016-000001'
  ) then
    for r in
      select
        id,
        substring(case_number from 9)::integer as suffix
      from public.profiles
      where case_number ~ '^RBT-016-[0-9]{6}$'
      order by substring(case_number from 9)::integer desc
    loop
      update public.profiles
      set case_number = 'RBT-016-' || lpad((r.suffix + 1)::text, 6, '0')
      where id = r.id;
    end loop;
  end if;
end $$;

-- Keep the sequence aligned with the highest assigned suffix. Floor at 2 so the
-- first generated real-player case number remains RBT-016-000002 when no profiles exist.
select setval(
  'public.profile_case_number_seq',
  greatest(
    coalesce(
      (
        select max(substring(case_number from 9)::bigint)
        from public.profiles
      ),
      1
    ) + 1,
    2
  ),
  false
);
