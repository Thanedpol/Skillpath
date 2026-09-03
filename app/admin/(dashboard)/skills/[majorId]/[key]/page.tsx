import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses as coursesT, skills as skillsT } from "@/lib/db/schema";
import SkillForm from "../../SkillForm";

export default async function EditSkillPage({ params }: { params: Promise<{ majorId: string; key: string }> }) {
  const { majorId, key } = await params;
  const decodedMajorId = decodeURIComponent(majorId);
  const decodedKey = decodeURIComponent(key);

  const [courses, skill] = await Promise.all([
    db
      .select({ major_id: coursesT.major_id, code: coursesT.code, name: coursesT.name })
      .from(coursesT)
      .orderBy(asc(coursesT.ord)),
    db
      .select()
      .from(skillsT)
      .where(and(eq(skillsT.major_id, decodedMajorId), eq(skillsT.key, decodedKey)))
      .then((r) => r[0]),
  ]);

  if (!skill) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>แก้ไขทักษะ — {decodedKey}</h1>
        </div>
      </div>
      <SkillForm courses={courses || []} skill={skill} />
    </>
  );
}
