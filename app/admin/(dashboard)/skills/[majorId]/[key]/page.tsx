import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SkillForm from "../../SkillForm";

export default async function EditSkillPage({ params }: { params: Promise<{ majorId: string; key: string }> }) {
  const { majorId, key } = await params;
  const decodedMajorId = decodeURIComponent(majorId);
  const decodedKey = decodeURIComponent(key);
  const supabase = await createClient();

  const [{ data: courses }, { data: skill }] = await Promise.all([
    supabase.from("courses").select("major_id,code,name").order("ord"),
    supabase.from("skills").select("*").eq("major_id", decodedMajorId).eq("key", decodedKey).maybeSingle(),
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
