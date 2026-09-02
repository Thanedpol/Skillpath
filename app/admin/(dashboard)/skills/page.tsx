import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteSkill } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";

export default async function AdminSkillsPage() {
  const supabase = await createClient();
  const { data: skills } = await supabase.from("skills").select("*").order("key");

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>ทักษะ</h1>
          <p>ทักษะที่จับคู่กับรายวิชา + ตัวบ่งชี้ว่าเอกสารหลักสูตรใช้คำอื่นหรือไม่</p>
        </div>
        <Link href="/admin/skills/new" className="cta">
          + เพิ่มทักษะใหม่
        </Link>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ทักษะ</th>
              <th>วิชา</th>
              <th>สถานะ</th>
              <th>ประเภท</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!skills?.length ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              skills.map((s) => (
                <tr key={s.key}>
                  <td>
                    <b>{s.key}</b>
                    {s.note ? <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>{s.note}</div> : null}
                  </td>
                  <td className="mono">{s.code || "—"}</td>
                  <td>
                    {s.hidden ? <span className="aliaschip" style={{ marginRight: 4 }}>เอกสารใช้คำอื่น</span> : null}
                    {s.partial ? <span className="aliaschip" style={{ marginRight: 4 }}>บางส่วน</span> : null}
                    {s.early_in_term ? <span className="aliaschip">ได้เร็ว</span> : null}
                  </td>
                  <td>{s.kind === "work" ? "ต้องได้จากงานจริง" : s.kind === "course" ? "ไม่มีวิชาสอน" : "—"}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/skills/${encodeURIComponent(s.key)}`} className="admin-btn">
                        แก้ไข
                      </Link>
                      <DeleteButton action={deleteSkill.bind(null, s.key)} confirmText={`ลบทักษะ "${s.key}" ใช่ไหม?`} />
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
