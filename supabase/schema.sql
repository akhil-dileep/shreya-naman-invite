-- Shreya & Naman invitation backend (Supabase/Postgres)
-- Run this entire script in Supabase Dashboard -> SQL Editor.
-- Public visitors can INSERT submissions only. Only the explicitly allow-listed admin can read them.

create extension if not exists pgcrypto;

create table if not exists public.invitation_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wedding_rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(btrim(full_name)) between 1 and 120),
  email text null check (email is null or char_length(email) <= 254),
  phone text null check (phone is null or char_length(phone) <= 40),
  attendance text not null check (attendance in ('yes','no','maybe')),
  guest_count integer not null default 1 check (guest_count between 1 and 20),
  message text null check (message is null or char_length(message) <= 1200)
);

create table if not exists public.wedding_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sender_name text not null check (char_length(btrim(sender_name)) between 1 and 120),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  approved boolean not null default false
);

create index if not exists wedding_rsvps_created_at_idx on public.wedding_rsvps (created_at desc);
create index if not exists wedding_notes_created_at_idx on public.wedding_notes (created_at desc);

alter table public.invitation_admins enable row level security;
alter table public.wedding_rsvps enable row level security;
alter table public.wedding_notes enable row level security;

-- No browser role is allowed to list the admin allow-list.
revoke all on table public.invitation_admins from anon, authenticated;
revoke all on table public.wedding_rsvps from anon, authenticated;
revoke all on table public.wedding_notes from anon, authenticated;
grant insert on table public.wedding_rsvps to anon, authenticated;
grant insert on table public.wedding_notes to anon, authenticated;
grant select, update, delete on table public.wedding_rsvps to authenticated;
grant select, update, delete on table public.wedding_notes to authenticated;

create or replace function public.is_invitation_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.invitation_admins a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_invitation_admin() from public;
grant execute on function public.is_invitation_admin() to authenticated;

drop policy if exists "public can submit RSVP" on public.wedding_rsvps;
create policy "public can submit RSVP"
  on public.wedding_rsvps for insert to anon, authenticated
  with check (
    char_length(btrim(full_name)) between 1 and 120
    and (email is null or char_length(email) <= 254)
    and (phone is null or char_length(phone) <= 40)
    and attendance in ('yes','no','maybe')
    and guest_count between 1 and 20
    and (message is null or char_length(message) <= 1200)
  );

drop policy if exists "admins can read RSVPs" on public.wedding_rsvps;
create policy "admins can read RSVPs"
  on public.wedding_rsvps for select to authenticated
  using (public.is_invitation_admin());

drop policy if exists "admins can update RSVPs" on public.wedding_rsvps;
create policy "admins can update RSVPs"
  on public.wedding_rsvps for update to authenticated
  using (public.is_invitation_admin())
  with check (public.is_invitation_admin());

drop policy if exists "admins can delete RSVPs" on public.wedding_rsvps;
create policy "admins can delete RSVPs"
  on public.wedding_rsvps for delete to authenticated
  using (public.is_invitation_admin());

drop policy if exists "public can submit wishes" on public.wedding_notes;
create policy "public can submit wishes"
  on public.wedding_notes for insert to anon, authenticated
  with check (
    char_length(btrim(sender_name)) between 1 and 120
    and char_length(btrim(message)) between 1 and 2000
    and approved = false
  );

drop policy if exists "admins can read wishes" on public.wedding_notes;
create policy "admins can read wishes"
  on public.wedding_notes for select to authenticated
  using (public.is_invitation_admin());

drop policy if exists "admins can moderate wishes" on public.wedding_notes;
create policy "admins can moderate wishes"
  on public.wedding_notes for update to authenticated
  using (public.is_invitation_admin())
  with check (public.is_invitation_admin());

drop policy if exists "admins can delete wishes" on public.wedding_notes;
create policy "admins can delete wishes"
  on public.wedding_notes for delete to authenticated
  using (public.is_invitation_admin());

-- After creating your admin user in Supabase Authentication -> Users, copy its UUID
-- and run the following (replace the placeholder):
-- insert into public.invitation_admins (user_id) values ('YOUR_AUTH_USER_UUID');
-- Disable public sign-ups in Supabase Authentication settings. Do not expose service_role keys.
