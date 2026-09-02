-- ============================================================
-- SkillPath — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- before running seed.sql.
-- ============================================================

create table if not exists majors (
  id text primary key,
  name text not null,
  school text not null,
  ready boolean not null default false,
  note text
);

-- ทุกวิชาผูกกับ major_id เสมอ — รหัสวิชาซ้ำกันได้ข้ามสาขา (เช่น มีวิชา "211" ทั้งใน CS และสถิติ)
-- primary key จึงเป็น (major_id, code) ไม่ใช่ code เดี่ยว ๆ
create table if not exists courses (
  major_id text not null references majors(id) on delete cascade,
  code text not null,
  name text not null,
  when_label text not null,
  ord integer not null,
  primary key (major_id, code)
);

-- ทักษะก็ผูกกับ major_id เช่นกัน — คีย์เดียวกัน (เช่น "SQL") มีได้หลาย major
-- โดยแต่ละ major เห็น note/code ของตัวเอง
create table if not exists skills (
  major_id text not null references majors(id) on delete cascade,
  key text not null,
  code text,
  note text not null,
  alias text,
  src text,
  hidden boolean not null default false,
  early_in_term boolean not null default false,
  partial boolean not null default false,
  kind text check (kind in ('course','work')),
  proof text,
  act text,
  time_estimate text,
  route text,
  primary key (major_id, key),
  foreign key (major_id, code) references courses(major_id, code) on delete set null
);

create table if not exists roles (
  id text primary key,
  name text not null,
  posts integer not null,
  jr_posts integer not null,
  fit integer not null
);

create table if not exists demand (
  id bigint generated always as identity primary key,
  role_id text not null references roles(id) on delete cascade,
  level text not null check (level in ('jr','sr')),
  skill_key text not null,
  count integer not null,
  unique (role_id, level, skill_key)
);
create index if not exists demand_role_idx on demand(role_id);

-- centralizes what used to live only in each visitor's localStorage
create table if not exists feedback (
  id bigint generated always as identity primary key,
  skill_key text not null,
  vote text not null check (vote in ('up','down')),
  client_id text,               -- anonymous id generated client-side, lets us track "latest vote per browser" without accounts
  page text,                    -- 'explore' | 'curriculum' — where the vote was cast
  created_at timestamptz not null default now()
);
create index if not exists feedback_skill_key_idx on feedback(skill_key);
create index if not exists feedback_created_at_idx on feedback(created_at desc);

-- ---------- row level security ----------
alter table majors  enable row level security;
alter table courses enable row level security;
alter table skills  enable row level security;
alter table roles   enable row level security;
alter table demand  enable row level security;
alter table feedback enable row level security;

-- public (anon key) can read the reference data — this is what will power
-- the public-facing pages once they're switched over from static data
drop policy if exists "public read majors" on majors;
create policy "public read majors" on majors for select using (true);

drop policy if exists "public read courses" on courses;
create policy "public read courses" on courses for select using (true);

drop policy if exists "public read skills" on skills;
create policy "public read skills" on skills for select using (true);

drop policy if exists "public read roles" on roles;
create policy "public read roles" on roles for select using (true);

drop policy if exists "public read demand" on demand;
create policy "public read demand" on demand for select using (true);

-- public can INSERT feedback (anonymous voting from the TrustPanel) but
-- cannot read/update/delete anyone's votes — only the admin (service role,
-- used server-side only) can read feedback in aggregate
drop policy if exists "public insert feedback" on feedback;
create policy "public insert feedback" on feedback for insert with check (true);

-- no public write policy on majors/courses/skills/roles/demand — those are
-- only writable via the service-role key, used server-side from /admin
