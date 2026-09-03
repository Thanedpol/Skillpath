import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { demand as demandT, roles as rolesT } from "@/lib/db/schema";
import RoleForm from "../RoleForm";
import DemandManager from "../DemandManager";

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [role, demand] = await Promise.all([
    db.select().from(rolesT).where(eq(rolesT.id, id)).then((r) => r[0]),
    db.select().from(demandT).where(eq(demandT.role_id, id)),
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
