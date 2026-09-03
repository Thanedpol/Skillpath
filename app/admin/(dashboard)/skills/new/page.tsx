import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses as coursesT } from "@/lib/db/schema";
import SkillForm from "../SkillForm";

export default async function NewSkillPage() {
  const courses = await db
    .select({ major_id: coursesT.major_id, code: coursesT.code, name: coursesT.name })
    .from(coursesT)
    .orderBy(asc(coursesT.ord));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>เพิ่มทักษะใหม่</h1>
        </div>
      </div>
      <SkillForm courses={courses || []} />
    </>
  );
}
