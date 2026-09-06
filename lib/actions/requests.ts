"use server";

import { db } from "@/lib/db";
import { profile_requests } from "@/lib/db/schema";
import type { CustomMajor } from "@/lib/types";

/* คำขอจากผู้ใช้ทั่วไป ไม่ต้องล็อกอิน — เหมือนโหวตฟีดแบ็ก
   เก็บไว้ให้ทีมเห็นว่ามีคนอยากได้หลักสูตร/อาชีพไหน จะได้จัดลำดับงานถูก */
export async function submitMajorRequest(data: CustomMajor, clientId: string) {
  const university = data.university.trim();
  const faculty = data.faculty.trim();
  const program = data.program.trim();
  const major = data.major.trim();
  if (!university && !faculty && !program && !major) return;

  await db.insert(profile_requests).values({
    kind: "major",
    university: university || null,
    faculty: faculty || null,
    program: program || null,
    major_name: major || null,
    client_id: clientId || null,
  });
}

export async function submitRoleRequest(roleName: string, clientId: string) {
  const name = roleName.trim();
  if (!name) return;

  await db.insert(profile_requests).values({
    kind: "role",
    role_name: name,
    client_id: clientId || null,
  });
}
