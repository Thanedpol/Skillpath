import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { faculties as facultiesT, majors as majorsT, universities as universitiesT } from "@/lib/db/schema";
import { deleteFaculty } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";

export default async function AdminFacultiesPage() {
  const rows = await db
    .select({
      id: facultiesT.id,
      name: facultiesT.name,
      campus: facultiesT.campus,
      universityName: universitiesT.name,
      majorCount: sql<number>`count(${majorsT.id})::int`,
    })
    .from(facultiesT)
    .innerJoin(universitiesT, eq(facultiesT.university_id, universitiesT.id))
    .leftJoin(majorsT, eq(majorsT.faculty_id, facultiesT.id))
    .groupBy(facultiesT.id, facultiesT.name, facultiesT.campus, universitiesT.name)
    .orderBy(asc(universitiesT.name), asc(facultiesT.name));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>คณะ</h1>
          <p>คณะอยู่ใต้มหาวิทยาลัย และเป็นที่อยู่ของสาขา — ชื่อคณะที่แสดงในเว็บมาจากตรงนี้ที่เดียว</p>
        </div>
        <Link href="/admin/faculties/new" className="cta">
          + เพิ่มคณะ
        </Link>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>คณะ</th>
              <th>มหาวิทยาลัย</th>
              <th>วิทยาเขต</th>
              <th>จำนวนสาขา</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              rows.map((f) => (
                <tr key={f.id}>
                  <td>
                    <b>{f.name}</b>
                    <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {f.id}
                    </div>
                  </td>
                  <td>{f.universityName}</td>
                  <td>{f.campus || "—"}</td>
                  <td className="num">{f.majorCount}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/faculties/${encodeURIComponent(f.id)}`} className="admin-btn">
                        แก้ไข
                      </Link>
                      <DeleteButton
                        action={deleteFaculty.bind(null, f.id)}
                        confirmText={`ลบ "${f.name}" ใช่ไหม? สาขา รายวิชา และทักษะทั้งหมดที่อยู่ใต้คณะนี้จะถูกลบไปด้วย`}
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
