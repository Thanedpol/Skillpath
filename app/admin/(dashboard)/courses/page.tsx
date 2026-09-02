import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCourse } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from("courses").select("*").order("ord");

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>รายวิชา</h1>
          <p>รายวิชาทั้งหมดที่ใช้ผูกกับทักษะ — เรียงตามปี/เทอม</p>
        </div>
        <Link href="/admin/courses/new" className="cta">
          + เพิ่มรายวิชาใหม่
        </Link>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
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
                <td colSpan={5} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c.code}>
                  <td className="mono">{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.when_label}</td>
                  <td className="num">{c.ord}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/courses/${encodeURIComponent(c.code)}`} className="admin-btn">
                        แก้ไข
                      </Link>
                      <DeleteButton action={deleteCourse.bind(null, c.code)} confirmText={`ลบรายวิชา "${c.code}" ใช่ไหม?`} />
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
