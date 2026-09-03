import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { faculties as facultiesT, universities as universitiesT } from "@/lib/db/schema";
import { deleteUniversity } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";

export default async function AdminUniversitiesPage() {
  const rows = await db
    .select({
      id: universitiesT.id,
      name: universitiesT.name,
      short_name: universitiesT.short_name,
      facultyCount: sql<number>`count(${facultiesT.id})::int`,
    })
    .from(universitiesT)
    .leftJoin(facultiesT, eq(facultiesT.university_id, universitiesT.id))
    .groupBy(universitiesT.id, universitiesT.name, universitiesT.short_name)
    .orderBy(asc(universitiesT.name));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>มหาวิทยาลัย</h1>
          <p>ระดับบนสุดของลำดับชั้นข้อมูล — มหาวิทยาลัย → คณะ → สาขา → รายวิชา → ทักษะ</p>
        </div>
        <Link href="/admin/universities/new" className="cta">
          + เพิ่มมหาวิทยาลัย
        </Link>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>ชื่อย่อ</th>
              <th>จำนวนคณะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr>
                <td colSpan={4} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b>{u.name}</b>
                    <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {u.id}
                    </div>
                  </td>
                  <td>{u.short_name}</td>
                  <td className="num">{u.facultyCount}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/universities/${encodeURIComponent(u.id)}`} className="admin-btn">
                        แก้ไข
                      </Link>
                      <DeleteButton
                        action={deleteUniversity.bind(null, u.id)}
                        confirmText={`ลบ "${u.name}" ใช่ไหม? คณะ สาขา รายวิชา และทักษะทั้งหมดที่อยู่ใต้มหาวิทยาลัยนี้จะถูกลบไปด้วย`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
