import { createClient } from "@/lib/supabase/server";
import SkillForm from "../SkillForm";

export default async function NewSkillPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from("courses").select("major_id,code,name").order("ord");

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
