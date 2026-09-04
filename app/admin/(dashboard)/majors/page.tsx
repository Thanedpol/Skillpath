import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { faculties as facultiesT, majors as majorsT, universities as universitiesT } from "@/lib/db/schema";
import { deleteMajor } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";

export default async function AdminMajorsPage() {
  /* leftJoin กับคณะ เพราะหลักสูตรที่มาจากทะเบียนหลักสูตรเปิดไม่มีคณะ
     (ชุดข้อมูลไม่มีคอลัมน์นั้น) — innerJoin จะทำให้หายไปทั้งหมด */
  const majors = await db
    .select({
      id: majorsT.id,
      name: majorsT.name,
      ready: majorsT.ready,
      note: majorsT.note,
      curriculumId: majorsT.curriculum_id,
      level: majorsT.level,
      iscedField: majorsT.isced_field,
      source: majorsT.source,
      facultyName: facultiesT.name,
      campus: facultiesT.campus,
      universityName: universitiesT.name,
      universityShort: universitiesT.short_name,
    })
    .from(majorsT)
    .innerJoin(universitiesT, eq(majorsT.university_id, universitiesT.id))
    .leftJoin(facultiesT, eq(majorsT.faculty_id, facultiesT.id))
    .orderBy(asc(universitiesT.name), asc(majorsT.name));

  const ready = majors.filter((m) => m.ready);
  const notReady = majors.filter((m) => !m.ready);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>สาขา</h1>
          <p>
            สาขาที่เปิดให้เลือกในหน้าตั้งค่าโปรไฟล์ — {ready.length} สาขามีข้อมูลรายวิชาและทักษะพร้อมใช้
            ส่วนอีก {notReady.length} สาขานำเข้าจากทะเบียนหลักสูตร ยังไม่มีข้อมูลทักษะจึงแสดงเป็น &quot;เร็วๆ นี้&quot;
          </p>
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
              <th>คณะ / มหาวิทยาลัย</th>
              <th>รหัสหลักสูตร</th>
              <th>สถานะ</th>
              <th>แหล่งที่มา</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!majors.length ? (
              <tr>
                <td colSpan={6} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              [...ready, ...notReady].map((m) => (
                <tr key={m.id}>
                  <td>
                    <b>{m.name}</b>
                    <div className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {m.id}
                    </div>
                  </td>
                  <td>
                    {m.facultyName ? (
                      [m.facultyName, m.universityShort, m.campus].filter(Boolean).join(" ")
                    ) : (
                      <>
                        {m.universityName}
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>ยังไม่ระบุคณะ</div>
                      </>
                    )}
                  </td>
                  <td className="mono" style={{ fontSize: 12 }}>
                    {m.curriculumId || "—"}
                  </td>
                  <td>{m.ready ? "พร้อมใช้งาน" : <span className="soonchip">เร็วๆ นี้</span>}</td>
                  <td style={{ fontSize: 11.5, color: "var(--muted)", maxWidth: 220 }}>{m.source || "—"}</td>
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
