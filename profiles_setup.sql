npm -- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text,
  company_name text,
  phone text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- It fetches data from the metadata we'll pass during the signUp call.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, company_name, phone, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'role', 
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
