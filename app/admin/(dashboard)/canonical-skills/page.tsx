import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { deleteCanonicalSkill } from "@/lib/actions/admin";
import DeleteButton from "../DeleteButton";
import SearchableTable from "../SearchableTable";

/* ============================================================
   ชุดรหัสสกิลกลาง — หน้ารวม
   จุดประสงค์คือให้เห็น "ช่องว่าง" ได้ในหน้าจอเดียว: สกิลไหนตลาดต้องการ
   แต่ไม่มีสาขาไหนสอน และสกิลไหนสอนอยู่แต่ตลาดยังไม่ได้ระบุถึง
   ตัวเลขทุกช่องนับจากแถวจริงในฐานข้อมูล ไม่มีค่าประมาณ
   ============================================================ */

type Row = {
  id: string;
  name: string;
  name_en: string | null;
  category: string | null;
  esco_id: string | null;
  majors: number;
  roles: number;
  jr_posts: number;
  aliases: number;
};

const FILTERS: { key: string; label: string; hint: string }[] = [
  { key: "all", label: "ทั้งหมด", hint: "สกิลกลางทุกตัวในระบบ" },
  { key: "gap", label: "ตลาดต้องการ แต่ยังไม่มีสาขาไหนสอน", hint: "ช่องว่างที่นักศึกษาต้องไปหาเองนอกหลักสูตร" },
  { key: "unused", label: "สอนอยู่ แต่ยังไม่พบในความต้องการตลาด", hint: "อาจยังไม่ได้เก็บข้อมูลประกาศงานของสายนี้" },
  { key: "noalias", label: "ยังไม่มีคำที่ใช้เรียกอื่น", hint: "ยิ่งเก็บคำเรียกมาก การจับคู่กับเอกสารใหม่ยิ่งแม่น" },
];

export default async function CanonicalSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string }>;
}) {
  const { f } = await searchParams;
  const filter = FILTERS.some((x) => x.key === f) ? f! : "all";

  const result = await db.execute(sql`
    select
      c.id, c.name, c.name_en, c.category, c.esco_id,
      (select count(distinct s.major_id) from skills s where s.canonical_id = c.id)::int as majors,
      (select count(distinct d.role_id) from demand d where d.canonical_id = c.id)::int as roles,
      (select coalesce(sum(d.count), 0) from demand d where d.canonical_id = c.id and d.level = 'jr')::int as jr_posts,
      (select count(*) from skill_aliases a where a.canonical_id = c.id)::int as aliases
    from canonical_skills c
    order by c.id asc
  `);
  const all = result.rows as unknown as Row[];

  const rows =
    filter === "gap"
      ? all.filter((r) => r.majors === 0 && r.roles > 0)
      : filter === "unused"
        ? all.filter((r) => r.majors > 0 && r.roles === 0)
        : filter === "noalias"
          ? all.filter((r) => r.aliases === 0)
          : all;

  /* เรียงตามจำนวนประกาศงานระดับเริ่มต้น เพราะเป็นตัวชี้ว่าควรลงแรงกับสกิลไหนก่อน */
  const sorted = [...rows].sort((a, b) => b.jr_posts - a.jr_posts || a.id.localeCompare(b.id, "th"));

  const gapCount = all.filter((r) => r.majors === 0 && r.roles > 0).length;
  const linkedCount = all.filter((r) => r.majors > 0 && r.roles > 0).length;
  const aliasCount = all.reduce((n, r) => n + r.aliases, 0);
  const active = FILTERS.find((x) => x.key === filter)!;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>สกิลกลาง</h1>
          <p>
            รหัสกลางที่ใช้เชื่อมทักษะฝั่งหลักสูตรกับทักษะฝั่งประกาศงานให้เป็นตัวเดียวกัน —
            แม้เอกสารสองฝั่งจะเขียนคนละคำ
          </p>
        </div>
        <Link href="/admin/canonical-skills/new" className="cta">
          + เพิ่มสกิลกลาง
        </Link>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <div className="n">{all.length}</div>
          <div className="l">สกิลกลางทั้งหมด</div>
        </div>
        <div className="admin-card">
          <div className="n">{linkedCount}</div>
          <div className="l">เชื่อมทั้งสองฝั่งแล้ว</div>
        </div>
        <div className="admin-card">
          <div className="n">{gapCount}</div>
          <div className="l">ตลาดต้องการ แต่ไม่มีสาขาสอน</div>
        </div>
        <div className="admin-card">
          <div className="n">{aliasCount}</div>
          <div className="l">คำที่ใช้เรียกที่เก็บไว้</div>
        </div>
      </div>

      <div className="admin-filters">
        {FILTERS.map((x) => (
          <Link
            key={x.key}
            href={x.key === "all" ? "/admin/canonical-skills" : `/admin/canonical-skills?f=${x.key}`}
            className="admin-filter"
            aria-current={x.key === filter ? "true" : undefined}
          >
            {x.label}
          </Link>
        ))}
      </div>
      <p className="admin-filterhint">{active.hint}</p>

      <SearchableTable
        placeholder="ค้นหาชื่อสกิล ชื่ออังกฤษ หมวด หรือรหัส ESCO…"
        unit="สกิล"
        colSpan={7}
        emptyLabel="ไม่มีสกิลที่เข้าเงื่อนไขนี้"
        head={
          <tr>
            <th>สกิล</th>
            <th>หมวด</th>
            <th>สาขาที่สอน</th>
            <th>อาชีพที่ต้องการ</th>
            <th>ประกาศ junior</th>
            <th>คำที่ใช้เรียก</th>
            <th></th>
          </tr>
        }
        rows={sorted.map((r) => ({
          key: r.id,
          text: [r.name, r.name_en, r.category, r.esco_id, r.id].filter(Boolean).join(" "),
          node: (
            <tr>
              <td>
                <b>{r.name}</b>
                {r.name_en ? (
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>{r.name_en}</div>
                ) : null}
              </td>
              <td>{r.category || "—"}</td>
              <td className="num">
                {r.majors === 0 && r.roles > 0 ? <span className="aliaschip">ไม่มีสาขาสอน</span> : r.majors}
              </td>
              <td className="num">{r.roles}</td>
              <td className="num">{r.jr_posts ? r.jr_posts.toLocaleString() : "—"}</td>
              <td className="num">{r.aliases}</td>
              <td>
                <div className="admin-actions">
                  <Link href={`/admin/canonical-skills/${encodeURIComponent(r.id)}`} className="admin-btn">
                    แก้ไข / คำเรียก
                  </Link>
                  <DeleteButton
                    action={deleteCanonicalSkill.bind(null, r.id)}
                    confirmText={`ลบสกิลกลาง "${r.name}" ใช่ไหม? ทักษะในหลักสูตรและความต้องการตลาดจะไม่ถูกลบ แต่จะกลายเป็นยังไม่ผูกรหัสกลาง`}
                  />
                </div>
              </td>
            </tr>
          ),
        }))}
      />
    </>
  );
}
