import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses as coursesT } from "@/lib/db/schema";
import CourseForm from "../../CourseForm";

export default async function EditCoursePage({ params }: { params: Promise<{ majorId: string; code: string }> }) {
  const { majorId, code } = await params;
  const decodedMajorId = decodeURIComponent(majorId);
  const decodedCode = decodeURIComponent(code);

  const course = await db
    .select()
    .from(coursesT)
    .where(and(eq(coursesT.major_id, decodedMajorId), eq(coursesT.code, decodedCode)))
    .then((r) => r[0]);

  if (!course) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>แก้ไขรายวิชา — {decodedCode}</h1>
        </div>
      </div>
      <CourseForm course={course} />
    </>
  );
}
