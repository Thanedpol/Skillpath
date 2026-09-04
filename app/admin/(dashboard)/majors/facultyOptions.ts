import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { faculties as facultiesT, universities as universitiesT } from "@/lib/db/schema";

/* ตัวเลือกคณะสำหรับ dropdown — ประกอบ "คณะ + ชื่อย่อมหาวิทยาลัย + วิทยาเขต"
   ให้ตรงกับที่แสดงในเว็บฝั่งผู้ใช้ */
export async function getFacultyOptions() {
  const rows = await db
    .select({
      id: facultiesT.id,
      name: facultiesT.name,
      campus: facultiesT.campus,
      universityShort: universitiesT.short_name,
      universityName: universitiesT.name,
    })
    .from(facultiesT)
    .innerJoin(universitiesT, eq(facultiesT.university_id, universitiesT.id))
    .orderBy(asc(universitiesT.name), asc(facultiesT.name));

  return rows.map((f) => ({
    id: f.id,
    label: [f.name, f.universityShort, f.campus].filter(Boolean).join(" "),
  }));
}

export async function getUniversityOptions() {
  return db
    .select({ id: universitiesT.id, name: universitiesT.name })
    .from(universitiesT)
    .orderBy(asc(universitiesT.name));
}
