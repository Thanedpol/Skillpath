import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { skills as skillsT } from "@/lib/db/schema";
import { deleteSkill } from "@/lib/actions/admin";
import { MAJORS } from "@/lib/data";
import DeleteButton from "../DeleteButton";
import SearchableTable from "../SearchableTable";

export default async function AdminSkillsPage() {
  const skills = await db.select().from(skillsT).orderBy(asc(skillsT.major_id), asc(skillsT.key));

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

      <SearchableTable
        placeholder="ค้นหาชื่อทักษะ สาขา รหัสวิชา หรือคำอธิบาย…"
        unit="ทักษะ"
        colSpan={6}
        head={
          <tr>
            <th>สาขา</th>
            <th>ทักษะ</th>
            <th>วิชา</th>
            <th>สถานะ</th>
            <th>ประเภท</th>
            <th></th>
          </tr>
        }
        rows={skills.map((s) => {
          const majorName = MAJORS.find((m) => m.id === s.major_id)?.name ?? s.major_id;
          return {
            key: `${s.major_id}/${s.key}`,
            /* รวม alias เข้าไปด้วย เพราะเวลาเทียบกับเอกสารหลักสูตร คนมักค้น
               ด้วยคำที่เอกสารเขียน ไม่ใช่ชื่อทักษะที่เราตั้ง */
            text: [majorName, s.major_id, s.key, s.code, s.note, s.alias, s.kind === "work" ? "ต้องได้จากงานจริง" : ""]
              .filter(Boolean)
              .join(" "),
            node: (
              <tr>
                <td>{majorName}</td>
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
                    <Link
                      href={`/admin/skills/${encodeURIComponent(s.major_id)}/${encodeURIComponent(s.key)}`}
                      className="admin-btn"
                    >
                      แก้ไข
                    </Link>
                    <DeleteButton
                      action={deleteSkill.bind(null, s.major_id, s.key)}
                      confirmText={`ลบทักษะ "${s.key}" ใช่ไหม?`}
                    />
                  </div>
                </td>
              </tr>
            ),
          };
        })}
      />
    </>
  );
}
