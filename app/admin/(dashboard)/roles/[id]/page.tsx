import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RoleForm from "../RoleForm";
import DemandManager from "../DemandManager";

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: role }, { data: demand }] = await Promise.all([
    supabase.from("roles").select("*").eq("id", id).maybeSingle(),
    supabase.from("demand").select("*").eq("role_id", id),
  ]);

  if (!role) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>แก้ไขอาชีพ — {role.name}</h1>
        </div>
      </div>
      <RoleForm role={role} />
      <div style={{ height: 28 }} />
      <DemandManager roleId={id} demand={demand || []} />
    </>
  );
}
