import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CourseForm from "../CourseForm";

export default async function EditCoursePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);
  const supabase = await createClient();

  const { data: course } = await supabase.from("courses").select("*").eq("code", decodedCode).maybeSingle();

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
