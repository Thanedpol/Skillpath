import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { roles as rolesT } from "@/lib/db/schema";
import { deleteRole } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";
import SearchableTable from "../SearchableTable";

export default async function AdminRolesPage() {
  const roles = await db.select().from(rolesT).orderBy(asc(rolesT.fit));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>อาชีพ</h1>
          <p>ตำแหน่งงานที่เปรียบเทียบให้นักศึกษาได้ — กดแก้ไขเพื่อจัดการความต้องการทักษะรายอาชีพ</p>
        </div>
        <Link href="/admin/roles/new" className="cta">
          + เพิ่มอาชีพใหม่
        </Link>
      </div>

      <SearchableTable
        placeholder="ค้นหาชื่ออาชีพ หรือรหัส…"
        unit="อาชีพ"
        colSpan={5}
        head={
          <tr>
            <th>อาชีพ</th>
            <th>ประกาศทั้งหมด</th>
            <th>ระดับ junior</th>
            <th>fit</th>
            <th></th>
          </tr>
        }
        rows={roles.map((r) => ({
          key: r.id,
          text: [r.name, r.id].join(" "),
          node: (
            <tr>
              <td>
                <b>{r.name}</b>
                <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  {r.id}
                </div>
              </td>
              <td className="num">{r.posts.toLocaleString()}</td>
              <td className="num">{r.jr_posts.toLocaleString()}</td>
              <td className="num">{r.fit}</td>
              <td>
                <div className="admin-actions">
                  <Link href={`/admin/roles/${r.id}`} className="admin-btn">
                    แก้ไข / ความต้องการทักษะ
                  </Link>
                  <DeleteButton
                    action={deleteRole.bind(null, r.id)}
                    confirmText={`ลบอาชีพ "${r.name}" ใช่ไหม? (ความต้องการทักษะที่ผูกไว้จะถูกลบด้วย)`}
                  />
                </div>
              </td>
            </tr>
          ),
        }))}
      />
    </>
  );
}
