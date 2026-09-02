import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MajorForm from "../MajorForm";

export default async function EditMajorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const supabase = await createClient();

  const { data: major } = await supabase.from("majors").select("*").eq("id", decodedId).maybeSingle();

  if (!major) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>แก้ไขสาขา — {major.name}</h1>
        </div>
      </div>
      <MajorForm major={major} />
    </>
  );
}
