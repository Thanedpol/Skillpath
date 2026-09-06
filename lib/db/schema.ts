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

/* faculty_id เป็น null ได้โดยตั้งใจ — ชุดข้อมูลหลักสูตรเปิดของ data.go.th
   ไม่มีคอลัมน์คณะเลย มีแค่ชื่อหลักสูตรกับมหาวิทยาลัย การเดาคณะจากชื่อหลักสูตร
   จะเป็นการแต่งข้อมูล จึงปล่อยว่างไว้จนกว่าจะมีคนยืนยัน */
export const majors = pgTable("majors", {
  id: text("id").primaryKey(),
  faculty_id: text("faculty_id").references(() => faculties.id, { onDelete: "set null" }),
  university_id: text("university_id").notNull().references(() => universities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ready: boolean("ready").notNull().default(false),
  note: text("note"),
  /* รหัสหลักสูตรทางการ (CURR_ID) — ใช้ยืนยันว่าเป็นหลักสูตรที่ขึ้นทะเบียนจริง */
  curriculum_id: text("curriculum_id"),
  level: text("level"),
  isced_field: text("isced_field"),
  /* ที่มาของข้อมูลแถวนี้ — ต้องระบุเสมอว่ามาจากไหน */
  source: text("source"),
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
    /* ผูกกับสกิลกลาง — null ได้ เพราะสกิลที่ยังไม่ได้ทบทวนต้องเห็นว่ายังไม่ผูก
       ไม่ใช่ผูกมั่วไว้ก่อน การจับคู่เดิมด้วย key ยังทำงานเหมือนเดิมทุกประการ */
    canonical_id: text("canonical_id").references(() => canonical_skills.id, { onDelete: "set null" }),
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

/* ============================================================
   ชุดรหัสสกิลกลาง (canonical skills)
   ปัญหาที่แก้: ฝั่งหลักสูตรเขียน "การจัดการข้อมูลด้วยเอสคิวแอล" ฝั่งประกาศงาน
   เขียน "SQL" — คนละคำแต่คือสกิลเดียวกัน ถ้าไม่มีรหัสกลาง การจับคู่จะเดาตลอดไป

   id ใช้ชื่อสกิลเดิมที่ระบบใช้อยู่ (เช่น "SQL", "สถิติเชิงพรรณนา") โดยตั้งใจ —
   ระบบเดิมจับคู่ด้วย string เท่ากันอยู่แล้ว การใช้ค่าเดิมเป็นรหัสจึงย้ายข้อมูล
   ได้โดยไม่กำกวมและไม่ทำให้หน้าเว็บที่ใช้อยู่พัง
   ============================================================ */
export const canonical_skills = pgTable("canonical_skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  /* ชื่ออังกฤษไว้เชื่อมกับ taxonomy สากลภายหลัง (ESCO/O*NET ไม่มีภาษาไทย) */
  name_en: text("name_en"),
  category: text("category"),
  esco_id: text("esco_id"),
  note: text("note"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ทุกวิธีเขียนของสกิลเดียวกัน — สินทรัพย์ตัวจริงของการจับคู่
   ยิ่งเก็บมาก การ map คำใหม่จากหลักสูตร/JD เข้ารหัสกลางยิ่งแม่น */
export const skill_aliases = pgTable(
  "skill_aliases",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    canonical_id: text("canonical_id").notNull().references(() => canonical_skills.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    /* คำนี้มาจากไหน — เอกสารหลักสูตร ประกาศงาน หรือทีมใส่เอง */
    source: text("source", { enum: ["curriculum", "jd", "manual"] }).notNull().default("manual"),
    lang: text("lang", { enum: ["th", "en"] }),
    note: text("note"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    /* กันคำซ้ำในสกิลเดียวกัน (ตัวพิมพ์เล็ก/ใหญ่ต่างกันถือว่าคนละคำ จัดการที่ชั้นค้นหา) */
    uniqueIndex("skill_aliases_canonical_alias_idx").on(t.canonical_id, t.alias),
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
    /* ฝั่งตลาดงานผูกกับสกิลกลางตัวเดียวกับฝั่งหลักสูตร — จุดที่ทำให้
       "SQL" ในประกาศงาน กับ "การจัดการฐานข้อมูล" ในหลักสูตร นับเป็นสกิลเดียวกันได้ */
    canonical_id: text("canonical_id").references(() => canonical_skills.id, { onDelete: "set null" }),
  },
  (t) => [
    uniqueIndex("demand_role_level_skill_idx").on(t.role_id, t.level, t.skill_key),
    check("demand_level_check", sql`${t.level} in ('jr','sr')`),
  ]
);

/* สาขา/อาชีพที่ผู้ใช้พิมพ์เองตอนตั้งโปรไฟล์ เพราะไม่พบในรายการ —
   เก็บไว้ให้ทีมเห็นว่ามีคนต้องการหลักสูตรหรืออาชีพไหนบ้าง ใช้จัดลำดับ
   ว่าจะไปสกัดทักษะจากเอกสารหลักสูตรของสาขาไหนต่อ */
export const profile_requests = pgTable(
  "profile_requests",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    kind: text("kind", { enum: ["major", "role"] }).notNull(),
    /* kind = 'major' — เก็บตามที่ผู้ใช้พิมพ์ทุกช่อง ไม่จับคู่กับหลักสูตรในระบบเอง */
    university: text("university"),
    faculty: text("faculty"),
    program: text("program"),
    major_name: text("major_name"),
    /* kind = 'role' */
    role_name: text("role_name"),
    client_id: text("client_id"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("profile_requests_kind_check", sql`${t.kind} in ('major','role')`)]
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
