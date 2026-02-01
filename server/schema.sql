
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: coaches
create table coaches (
  id text primary key, -- Keeping text id to match current frontend data (e.g. 'coach001'), usually uuid is better but this minimizes refactoring.
  name text not null,
  avatar text,
  age int,
  gender text,
  rating numeric,
  phone text,
  title text,
  specialty text,
  experience int,
  "currentCourses" int,
  "studentCount" int,
  "monthlyClasses" int,
  "monthlyHours" int,
  "themeColor" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: leads
create table leads (
  id text primary key,
  name text not null,
  age int,
  phone text,
  wechat text,
  "courseType" text,
  source text, -- '地推' | '转介绍' | '线上咨询' | '其他'
  intention text, -- '高' | '中' | '低'
  status text, -- '待联系' | '已试听' | '已报价' | '已签约' | '已流失'
  "nextFollowUp" text,
  budget text,
  "sportsFoundation" text, -- '零基础' | '有基础' | '专业级'
  "expectedTime" text,
  history jsonb default '[]'::jsonb, -- Store history as JSON for simplicity
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: students
create table students (
  id text primary key,
  name text not null,
  avatar text,
  gender text,
  age int,
  parent text,
  phone text,
  level text,
  "courseName" text,
  "remainingTimes" int,
  "totalTimes" int,
  "joinDate" text,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: courses
create table courses (
  id text primary key,
  name text not null,
  level text,
  coach text, -- Storing name for now as per frontend, ideal: references coaches(id)
  schedule text,
  location text,
  enrollment text,
  capacity int,
  progress int,
  fee numeric,
  status text,
  "themeGradient" text,
  "studentNames" text[], -- Array of strings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: records (attendance)
create table records (
  id text primary key default uuid_generate_v4()::text,
  "studentName" text,
  "courseName" text,
  coach text,
  date text,
  time text,
  times int,
  attendance text,
  performance text,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: renewals
create table renewals (
  id text primary key default uuid_generate_v4()::text,
  "studentName" text,
  "courseName" text,
  amount numeric,
  times int,
  "startDate" text,
  "endDate" text,
  payment text,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: todos
create table todos (
  id text primary key,
  text text not null,
  completed boolean default false,
  "createdAt" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Open for now as requested/implied simpler setup, but enable RLS is best practice)
-- For simplicity in this demo, we will allow all operations.
alter table coaches enable row level security;
create policy "Public coaches are viewable by everyone." on coaches for select using (true);
create policy "Public coaches are insertable by everyone." on coaches for insert with check (true);
create policy "Public coaches are updateable by everyone." on coaches for update using (true);

alter table leads enable row level security;
create policy "Public leads are viewable by everyone." on leads for select using (true);
create policy "Public leads are insertable by everyone." on leads for insert with check (true);
create policy "Public leads are updateable by everyone." on leads for update using (true);

alter table students enable row level security;
create policy "Public students are viewable by everyone." on students for select using (true);
create policy "Public students are insertable by everyone." on students for insert with check (true);
create policy "Public students are updateable by everyone." on students for update using (true);

alter table courses enable row level security;
create policy "Public courses are viewable by everyone." on courses for select using (true);
create policy "Public courses are insertable by everyone." on courses for insert with check (true);
create policy "Public courses are updateable by everyone." on courses for update using (true);

alter table records enable row level security;
create policy "Public records are viewable by everyone." on records for select using (true);
create policy "Public records are insertable by everyone." on records for insert with check (true);
create policy "Public records are updateable by everyone." on records for update using (true);

alter table renewals enable row level security;
create policy "Public renewals are viewable by everyone." on renewals for select using (true);
create policy "Public renewals are insertable by everyone." on renewals for insert with check (true);
create policy "Public renewals are updateable by everyone." on renewals for update using (true);

alter table todos enable row level security;
create policy "Public todos are viewable by everyone." on todos for select using (true);
create policy "Public todos are insertable by everyone." on todos for insert with check (true);
create policy "Public todos are updateable by everyone." on todos for update using (true);
