"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ไม่ได้เข้าสู่ระบบ — กรุณาเข้าสู่ระบบใหม่");
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

/* ---------------- majors ---------------- */
export async function upsertMajor(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("majors").upsert({
    id: str(formData, "id"),
    name: str(formData, "name"),
    school: str(formData, "school"),
    ready: bool(formData, "ready"),
    note: strOrNull(formData, "note"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/majors");
}
export async function deleteMajor(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("majors").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/majors");
}

/* ---------------- courses ---------------- */
export async function upsertCourse(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("courses").upsert({
    code: str(formData, "code"),
    name: str(formData, "name"),
    when_label: str(formData, "when_label"),
    ord: num(formData, "ord"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/courses");
}
export async function deleteCourse(code: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("courses").delete().eq("code", code);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/courses");
}

/* ---------------- skills ---------------- */
export async function upsertSkill(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const kind = str(formData, "kind");
  const { error } = await admin.from("skills").upsert({
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
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
}
export async function deleteSkill(key: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("skills").delete().eq("key", key);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
}

/* ---------------- roles ---------------- */
export async function upsertRole(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("roles").upsert({
    id: str(formData, "id"),
    name: str(formData, "name"),
    posts: num(formData, "posts"),
    jr_posts: num(formData, "jr_posts"),
    fit: num(formData, "fit"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/roles");
}
export async function deleteRole(id: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("roles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/roles");
}

/* ---------------- demand ---------------- */
export async function upsertDemand(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const idRaw = str(formData, "id");
  const row = {
    role_id: str(formData, "role_id"),
    level: str(formData, "level"),
    skill_key: str(formData, "skill_key"),
    count: num(formData, "count"),
  };
  if (idRaw) {
    const { error } = await admin.from("demand").update(row).eq("id", Number(idRaw));
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("demand").upsert(row, { onConflict: "role_id,level,skill_key" });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/roles");
}
export async function deleteDemand(id: number) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("demand").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/roles");
}
