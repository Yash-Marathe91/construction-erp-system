-- ============================================================
-- TASK 2: Operations Backend — Workers + Attendance
-- ============================================================

-- ============================================================
-- 1. CREATE WORKERS TABLE
-- ============================================================
create table if not exists public.workers (
  id uuid default gen_random_uuid() primary key,
  site_id uuid references public.sites(id) on delete cascade,
  name text not null,
  role text not null,
  daily_wage numeric not null default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS and add basic policies
alter table public.workers enable row level security;
create policy "Authenticated users can view workers" on public.workers for select using (auth.role() = 'authenticated');
create policy "Authenticated users can update workers" on public.workers for update using (auth.role() = 'authenticated');
create policy "Authenticated users can insert workers" on public.workers for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can delete workers" on public.workers for delete using (auth.role() = 'authenticated');

-- ============================================================
-- 2. CREATE ATTENDANCE TABLE
-- ============================================================
create table if not exists public.attendance (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.workers(id) on delete cascade not null,
  date date not null default current_date,
  status text not null check (status in ('Present', 'Absent', 'Half-day')),
  hours_worked numeric default 8,
  check_in_time time,
  created_at timestamp with time zone default now(),
  unique(worker_id, date) -- A worker can only have one attendance record per day
);

-- Enable RLS and add basic policies
alter table public.attendance enable row level security;
create policy "Authenticated users can view attendance" on public.attendance for select using (auth.role() = 'authenticated');
create policy "Authenticated users can update attendance" on public.attendance for update using (auth.role() = 'authenticated');
create policy "Authenticated users can insert attendance" on public.attendance for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- 3. CREATE SITES TABLE (Dependency for workers)
-- ============================================================
create table if not exists public.sites (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  location text not null,
  status text default 'Active',
  created_at timestamp with time zone default now()
);
alter table public.sites enable row level security;
create policy "Authenticated users can view sites" on public.sites for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert sites" on public.sites for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- 4. SEED DEMO DATA
-- ============================================================
-- First, ensure a Site exists (linking to our Project from Task 1)
insert into public.sites (id, project_id, name, location, status)
values (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012', 
  (select id from public.projects limit 1), -- Fallback to first project
  'Sector 2A Hub', 
  'Noida', 
  'Active'
) on conflict (id) do nothing;

-- Now add workers
insert into public.workers (id, site_id, name, role, daily_wage) values
('c3d4e5f6-a7b8-9012-cdef-345678901234', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Rajesh Kumar', 'Mason', 650),
('d4e5f6a7-b8c9-0123-def0-456789012345', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Sanjay Singh', 'Carpenter', 700),
('e5f6a7b8-c9d0-1234-ef01-567890123456', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Deepika Rani', 'Helper', 450),
('f6a7b8c9-d0e1-2345-f012-678901234567', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Manoj Yadav', 'Plumber', 800)
on conflict (id) do nothing;

-- Log attendance for today
insert into public.attendance (worker_id, date, status, check_in_time) values
('c3d4e5f6-a7b8-9012-cdef-345678901234', current_date, 'Present', '08:00:00'),
('d4e5f6a7-b8c9-0123-def0-456789012345', current_date, 'Present', '08:15:00'),
('e5f6a7b8-c9d0-1234-ef01-567890123456', current_date, 'Absent', null),
('f6a7b8c9-d0e1-2345-f012-678901234567', current_date, 'Present', '08:30:00')
on conflict (worker_id, date) do nothing;
