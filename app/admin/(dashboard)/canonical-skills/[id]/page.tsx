import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  canonical_skills as canonicalT,
  demand as demandT,
  majors as majorsT,
  roles as rolesT,
  skill_aliases as aliasesT,
  skills as skillsT,
} from "@/lib/db/schema";
import AliasManager from "../AliasManager";
import CanonicalSkillForm from "../CanonicalSkillForm";

export default async function EditCanonicalSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const skill = await db
    .select()
    .from(canonicalT)
    .where(eq(canonicalT.id, decodedId))
    .then((r) => r[0]);

  if (!skill) notFound();

  const [aliases, taughtIn, demandedBy] = await Promise.all([
    db.select().from(aliasesT).where(eq(aliasesT.canonical_id, decodedId)).orderBy(asc(aliasesT.alias)),
    /* ฝั่งหลักสูตร: สาขาไหนสอนสกิลนี้ และเรียกมันว่าอะไรในสาขานั้น */
    db
      .select({ major_id: skillsT.major_id, major_name: majorsT.name, key: skillsT.key, code: skillsT.code })
      .from(skillsT)
      .leftJoin(majorsT, eq(majorsT.id, skillsT.major_id))
      .where(eq(skillsT.canonical_id, decodedId))
      .orderBy(asc(skillsT.major_id)),
    /* ฝั่งตลาดงาน: อาชีพไหนต้องการ และกี่ประกาศ */
    db
      .select({ role_id: demandT.role_id, role_name: rolesT.name, level: demandT.level, count: demandT.count })
      .from(demandT)
      .leftJoin(rolesT, eq(rolesT.id, demandT.role_id))
      .where(eq(demandT.canonical_id, decodedId))
      .orderBy(desc(demandT.count)),
  ]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>สกิลกลาง — {skill.name}</h1>
          <p>
            แก้ชื่อและหมวดได้ที่นี่ พร้อมเก็บ &quot;คำที่ใช้เรียก&quot; ทุกแบบที่เจอในเอกสารจริง
            เพื่อให้จับคู่เอกสารชุดใหม่ได้โดยไม่ต้องเดา
          </p>
        </div>
        <Link href="/admin/canonical-skills" className="admin-btn">
          ← กลับไปหน้ารวม
        </Link>
      </div>

      <CanonicalSkillForm skill={skill} />

      <div className="admin-panel">
        <div className="admin-panel-head">
          <span>สาขาที่สอนสกิลนี้</span>
          <span style={{ fontWeight: 400, fontSize: 12, color: "var(--muted)" }}>{taughtIn.length} รายการ</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>สาขา</th>
              <th>ชื่อทักษะในสาขานั้น</th>
              <th>วิชา</th>
            </tr>
          </thead>
          <tbody>
            {!taughtIn.length ? (
              <tr>
                <td colSpan={3} className="admin-empty">
                  ยังไม่มีสาขาไหนในระบบสอนสกิลนี้
                </td>
              </tr>
            ) : (
              taughtIn.map((t) => (
                <tr key={`${t.major_id}/${t.key}`}>
                  <td>{t.major_name ?? t.major_id}</td>
                  <td>
                    <Link
                      href={`/admin/skills/${encodeURIComponent(t.major_id)}/${encodeURIComponent(t.key)}`}
                      className="admin-link"
                    >
                      {t.key}
                    </Link>
                  </td>
                  <td className="mono">{t.code || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <span>อาชีพที่ต้องการสกิลนี้</span>
          <span style={{ fontWeight: 400, fontSize: 12, color: "var(--muted)" }}>{demandedBy.length} รายการ</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>อาชีพ</th>
              <th>ระดับ</th>
              <th>จำนวนประกาศ</th>
            </tr>
          </thead>
          <tbody>
            {!demandedBy.length ? (
              <tr>
                <td colSpan={3} className="admin-empty">
                  ยังไม่พบสกิลนี้ในความต้องการของอาชีพใดในระบบ
                </td>
              </tr>
            ) : (
              demandedBy.map((d, i) => (
                <tr key={`${d.role_id}/${d.level}/${i}`}>
                  <td>
                    <Link href={`/admin/roles/${encodeURIComponent(d.role_id)}`} className="admin-link">
                      {d.role_name ?? d.role_id}
                    </Link>
                  </td>
                  <td>{d.level === "jr" ? "Junior" : "Senior"}</td>
                  <td className="num">{d.count.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AliasManager canonicalId={skill.id} aliases={aliases} />
    </>
  );
}
