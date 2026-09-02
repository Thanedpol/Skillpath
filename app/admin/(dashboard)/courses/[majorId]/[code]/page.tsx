import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CourseForm from "../../CourseForm";

export default async function EditCoursePage({ params }: { params: Promise<{ majorId: string; code: string }> }) {
  const { majorId, code } = await params;
  const decodedMajorId = decodeURIComponent(majorId);
  const decodedCode = decodeURIComponent(code);
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("major_id", decodedMajorId)
    .eq("code", decodedCode)
    .maybeSingle();

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
