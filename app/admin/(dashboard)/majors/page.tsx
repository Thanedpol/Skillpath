import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { faculties as facultiesT, majors as majorsT, universities as universitiesT } from "@/lib/db/schema";
import { deleteMajor } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";

export default async function AdminMajorsPage() {
  const majors = await db
    .select({
      id: majorsT.id,
      name: majorsT.name,
      ready: majorsT.ready,
      note: majorsT.note,
      facultyName: facultiesT.name,
      campus: facultiesT.campus,
      universityShort: universitiesT.short_name,
    })
    .from(majorsT)
    .innerJoin(facultiesT, eq(majorsT.faculty_id, facultiesT.id))
    .innerJoin(universitiesT, eq(facultiesT.university_id, universitiesT.id))
    .orderBy(asc(universitiesT.name), asc(facultiesT.name), asc(majorsT.name));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>สาขา</h1>
          <p>สาขาที่เปิดให้เลือกในหน้าตั้งค่าโปรไฟล์ + สถานะว่าข้อมูลหลักสูตรพร้อมใช้งานหรือยัง</p>
        </div>
        <Link href="/admin/majors/new" className="cta">
          + เพิ่มสาขาใหม่
        </Link>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>สาขา</th>
              <th>คณะ</th>
              <th>สถานะ</th>
              <th>หมายเหตุ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!majors.length ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              majors.map((m) => (
                <tr key={m.id}>
                  <td>
                    <b>{m.name}</b>
                    <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {m.id}
                    </div>
                  </td>
                  <td>
                    {[m.facultyName, m.universityShort, m.campus].filter(Boolean).join(" ")}
                  </td>
                  <td>{m.ready ? "พร้อมใช้งาน" : <span className="soonchip">เร็วๆ นี้</span>}</td>
                  <td>{m.note || "—"}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/majors/${encodeURIComponent(m.id)}`} className="admin-btn">
                        แก้ไข
                      </Link>
                      <DeleteButton
                        action={deleteMajor.bind(null, m.id)}
                        confirmText={`ลบสาขา "${m.name}" ใช่ไหม? รายวิชาและทักษะของสาขานี้จะถูกลบไปด้วย`}
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
