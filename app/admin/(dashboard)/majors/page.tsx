import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { majors as majorsT } from "@/lib/db/schema";
import { deleteMajor } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";

export default async function AdminMajorsPage() {
  const majors = await db.select().from(majorsT).orderBy(asc(majorsT.name));

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
              <th>สถานะ</th>
              <th>หมายเหตุ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!majors?.length ? (
              <tr>
                <td colSpan={4} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              majors.map((m) => (
                <tr key={m.id}>
                  <td>
                    <b>{m.name}</b>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>{m.school}</div>
                  </td>
                  <td>{m.ready ? "พร้อมใช้งาน" : <span className="soonchip">เร็วๆ นี้</span>}</td>
                  <td>{m.note || "—"}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/majors/${encodeURIComponent(m.id)}`} className="admin-btn">
                        แก้ไข
                      </Link>
                      <DeleteButton action={deleteMajor.bind(null, m.id)} confirmText={`ลบสาขา "${m.name}" ใช่ไหม?`} />
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
