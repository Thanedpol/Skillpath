/* ============================================================
   SkillPath — Drizzle schema (Neon Postgres)
   Mirrors the previous supabase/schema.sql column-for-column —
   JS property names stay snake_case on purpose, matching the SQL
   column names, so every admin form/page that already expects
   e.g. row.jr_posts / row.major_id needs no changes here.
   ============================================================ */
import { boolean, check, foreignKey, integer, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* ลำดับชั้น: universities → faculties → majors → courses → skills
   ชื่อคณะ/มหาวิทยาลัยมาจากแหล่งเดียว ไม่ใช่ข้อความซ้ำในทุกสาขาแบบเดิม */
export const universities = pgTable("universities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  short_name: text("short_name").notNull(),
});

export const faculties = pgTable("faculties", {
  id: text("id").primaryKey(),
  university_id: text("university_id").notNull().references(() => universities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  campus: text("campus"),
});

export const majors = pgTable("majors", {
  id: text("id").primaryKey(),
  faculty_id: text("faculty_id").notNull().references(() => faculties.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ready: boolean("ready").notNull().default(false),
  note: text("note"),
});

/* ทุกวิชาผูกกับ major_id เสมอ — รหัสวิชาซ้ำกันได้ข้ามสาขา คีย์หลักจึงเป็น (major_id, code) */
export const courses = pgTable(
  "courses",
  {
    major_id: text("major_id").notNull().references(() => majors.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    when_label: text("when_label").notNull(),
    ord: integer("ord").notNull(),
  },
  (t) => [primaryKey({ columns: [t.major_id, t.code] })]
);

export const skills = pgTable(
  "skills",
  {
    major_id: text("major_id").notNull().references(() => majors.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    code: text("code"),
    note: text("note").notNull(),
    alias: text("alias"),
    src: text("src"),
    hidden: boolean("hidden").notNull().default(false),
    early_in_term: boolean("early_in_term").notNull().default(false),
    partial: boolean("partial").notNull().default(false),
    kind: text("kind"),
    proof: text("proof"),
    act: text("act"),
    time_estimate: text("time_estimate"),
    route: text("route"),
  },
  (t) => [
    primaryKey({ columns: [t.major_id, t.key] }),
    foreignKey({
      columns: [t.major_id, t.code],
      foreignColumns: [courses.major_id, courses.code],
      name: "skills_major_course_fk",
    }).onDelete("set null"),
    check("skills_kind_check", sql`${t.kind} in ('course','work')`),
  ]
);

export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  posts: integer("posts").notNull(),
  jr_posts: integer("jr_posts").notNull(),
  fit: integer("fit").notNull(),
});

export const demand = pgTable(
  "demand",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    role_id: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    level: text("level", { enum: ["jr", "sr"] }).notNull(),
    skill_key: text("skill_key").notNull(),
    count: integer("count").notNull(),
  },
  (t) => [
    uniqueIndex("demand_role_level_skill_idx").on(t.role_id, t.level, t.skill_key),
    check("demand_level_check", sql`${t.level} in ('jr','sr')`),
  ]
);

/* centralizes what used to live only in each visitor's localStorage */
export const feedback = pgTable(
  "feedback",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    skill_key: text("skill_key").notNull(),
    vote: text("vote").notNull(),
    client_id: text("client_id"),
    page: text("page"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("feedback_vote_check", sql`${t.vote} in ('up','down')`)]
);
