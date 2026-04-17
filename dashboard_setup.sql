-- ============================================================
-- TASK 1: Dashboard Backend — Projects + Alerts
-- ============================================================

-- ============================================================
-- 0. CREATE PROJECTS TABLE
-- ============================================================
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  status text default 'Active',
  total_income numeric default 0,
  total_expenses numeric default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS and add basic policies for projects
alter table public.projects enable row level security;
create policy "Authenticated users can view projects" on public.projects for select using (auth.role() = 'authenticated');
create policy "Authenticated users can update projects" on public.projects for update using (auth.role() = 'authenticated');
create policy "Authenticated users can insert projects" on public.projects for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- 1. CREATE ALERTS TABLE
-- ============================================================

create table if not exists public.alerts (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  severity text default 'warning' check (severity in ('critical', 'warning', 'info')),
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.alerts enable row level security;

-- Allow authenticated users to read alerts
create policy "Authenticated users can view alerts" on public.alerts
  for select using (auth.role() = 'authenticated');

-- Allow authenticated users to update alerts (e.g., mark as read)
create policy "Authenticated users can update alerts" on public.alerts
  for update using (auth.role() = 'authenticated');

-- Allow authenticated users to insert alerts
create policy "Authenticated users can insert alerts" on public.alerts
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- 2. SEED DEMO DATA — Active Project
-- ============================================================
-- Insert a demo project (skip if you already have one)
insert into public.projects (id, name, status, total_income, total_expenses)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'The Emerald Towers - NCR',
  'Active',
  4820500,
  2140200
)
on conflict (id) do update set
  name = excluded.name,
  total_income = excluded.total_income,
  total_expenses = excluded.total_expenses;

-- ============================================================
-- 3. SEED DEMO DATA — Critical Alerts
-- ============================================================
insert into public.alerts (project_id, title, description, severity) values
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Safety Incident Report Required',
  'Noida West - Block C • 14:05 PM',
  'critical'
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Concrete Pouring Delayed',
  'Traffic at IFFCO Chowk • Wait: 45m',
  'warning'
);
