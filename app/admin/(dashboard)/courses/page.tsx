import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses as coursesT } from "@/lib/db/schema";
import { deleteCourse } from "@/lib/actions/admin";
import { MAJORS } from "@/lib/data";
import DeleteButton from "../DeleteButton";

export default async function AdminCoursesPage() {
  const courses = await db.select().from(coursesT).orderBy(asc(coursesT.major_id), asc(coursesT.ord));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>รายวิชา</h1>
          <p>รายวิชาทั้งหมดที่ใช้ผูกกับทักษะ — เรียงตามสาขา แล้วตามปี/เทอม</p>
        </div>
        <Link href="/admin/courses/new" className="cta">
          + เพิ่มรายวิชาใหม่
        </Link>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>สาขา</th>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>ช่วงเวลา</th>
              <th>ord</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!courses?.length ? (
              <tr>
                <td colSpan={6} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={`${c.major_id}/${c.code}`}>
                  <td>{MAJORS.find((m) => m.id === c.major_id)?.name ?? c.major_id}</td>
                  <td className="mono">{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.when_label}</td>
                  <td className="num">{c.ord}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        href={`/admin/courses/${encodeURIComponent(c.major_id)}/${encodeURIComponent(c.code)}`}
                        className="admin-btn"
                      >
                        แก้ไข
                      </Link>
                      <DeleteButton
                        action={deleteCourse.bind(null, c.major_id, c.code)}
                        confirmText={`ลบรายวิชา "${c.code}" ใช่ไหม?`}
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
