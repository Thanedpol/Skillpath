"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { courses, demand, faculties, majors, roles, skills, universities } from "@/lib/db/schema";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("ไม่ได้เข้าสู่ระบบ — กรุณาเข้าสู่ระบบใหม่");
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) || "").trim();
}
function strOrNull(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v ? v : null;
}
function num(fd: FormData, key: string): number {
  return Number(fd.get(key) || 0);
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

/* ---------------- universities ---------------- */
export async function upsertUniversity(formData: FormData) {
  await assertAdmin();
  const row = {
    id: str(formData, "id"),
    name: str(formData, "name"),
    short_name: str(formData, "short_name"),
  };
  await db.insert(universities).values(row).onConflictDoUpdate({ target: universities.id, set: row });
  revalidatePath("/admin/universities");
}
export async function deleteUniversity(id: string) {
  await assertAdmin();
  await db.delete(universities).where(eq(universities.id, id));
  revalidatePath("/admin/universities");
}

/* ---------------- faculties ---------------- */
export async function upsertFaculty(formData: FormData) {
  await assertAdmin();
  const row = {
    id: str(formData, "id"),
    university_id: str(formData, "university_id"),
    name: str(formData, "name"),
    campus: strOrNull(formData, "campus"),
  };
  await db.insert(faculties).values(row).onConflictDoUpdate({ target: faculties.id, set: row });
  revalidatePath("/admin/faculties");
}
export async function deleteFaculty(id: string) {
  await assertAdmin();
  await db.delete(faculties).where(eq(faculties.id, id));
  revalidatePath("/admin/faculties");
}

/* ---------------- majors ---------------- */
export async function upsertMajor(formData: FormData) {
  await assertAdmin();
  const row = {
    id: str(formData, "id"),
    faculty_id: str(formData, "faculty_id"),
    name: str(formData, "name"),
    ready: bool(formData, "ready"),
    note: strOrNull(formData, "note"),
  };
  await db.insert(majors).values(row).onConflictDoUpdate({ target: majors.id, set: row });
  revalidatePath("/admin/majors");
}
export async function deleteMajor(id: string) {
  await assertAdmin();
  await db.delete(majors).where(eq(majors.id, id));
  revalidatePath("/admin/majors");
}

/* ---------------- courses ---------------- */
export async function upsertCourse(formData: FormData) {
  await assertAdmin();
  const row = {
    major_id: str(formData, "major_id"),
    code: str(formData, "code"),
    name: str(formData, "name"),
    when_label: str(formData, "when_label"),
    ord: num(formData, "ord"),
  };
  await db
    .insert(courses)
    .values(row)
    .onConflictDoUpdate({ target: [courses.major_id, courses.code], set: row });
  revalidatePath("/admin/courses");
}
export async function deleteCourse(majorId: string, code: string) {
  await assertAdmin();
  await db.delete(courses).where(and(eq(courses.major_id, majorId), eq(courses.code, code)));
  revalidatePath("/admin/courses");
}

/* ---------------- skills ---------------- */
export async function upsertSkill(formData: FormData) {
  await assertAdmin();
  const kind = str(formData, "kind");
  const row = {
    major_id: str(formData, "major_id"),
    key: str(formData, "key"),
    code: strOrNull(formData, "code"),
    note: str(formData, "note"),
    alias: strOrNull(formData, "alias"),
    src: strOrNull(formData, "src"),
    hidden: bool(formData, "hidden"),
    early_in_term: bool(formData, "early_in_term"),
    partial: bool(formData, "partial"),
    kind: kind === "course" || kind === "work" ? kind : null,
    proof: strOrNull(formData, "proof"),
    act: strOrNull(formData, "act"),
    time_estimate: strOrNull(formData, "time_estimate"),
    route: strOrNull(formData, "route"),
  };
  await db
    .insert(skills)
    .values(row)
    .onConflictDoUpdate({ target: [skills.major_id, skills.key], set: row });
  revalidatePath("/admin/skills");
}
export async function deleteSkill(majorId: string, key: string) {
  await assertAdmin();
  await db.delete(skills).where(and(eq(skills.major_id, majorId), eq(skills.key, key)));
  revalidatePath("/admin/skills");
}

/* ---------------- roles ---------------- */
export async function upsertRole(formData: FormData) {
  await assertAdmin();
  const row = {
    id: str(formData, "id"),
    name: str(formData, "name"),
    posts: num(formData, "posts"),
    jr_posts: num(formData, "jr_posts"),
    fit: num(formData, "fit"),
  };
  await db.insert(roles).values(row).onConflictDoUpdate({ target: roles.id, set: row });
  revalidatePath("/admin/roles");
}
export async function deleteRole(id: string) {
  await assertAdmin();
  await db.delete(roles).where(eq(roles.id, id));
  revalidatePath("/admin/roles");
}

/* ---------------- demand ---------------- */
export async function upsertDemand(formData: FormData) {
  await assertAdmin();
  const idRaw = str(formData, "id");
  const levelRaw = str(formData, "level");
  if (levelRaw !== "jr" && levelRaw !== "sr") throw new Error('ระดับต้องเป็น "jr" หรือ "sr"');
  const level = levelRaw as "jr" | "sr";
  const row = {
    role_id: str(formData, "role_id"),
    level,
    skill_key: str(formData, "skill_key"),
    count: num(formData, "count"),
  };
  if (idRaw) {
    await db.update(demand).set(row).where(eq(demand.id, Number(idRaw)));
  } else {
    await db
      .insert(demand)
      .values(row)
      .onConflictDoUpdate({ target: [demand.role_id, demand.level, demand.skill_key], set: row });
  }
  revalidatePath("/admin/roles");
}
export async function deleteDemand(id: number) {
  await assertAdmin();
  await db.delete(demand).where(eq(demand.id, id));
  revalidatePath("/admin/roles");
}
