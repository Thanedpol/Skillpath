import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { canonical_skills as canonicalT, courses as coursesT, demand as demandT, faculties as facultiesT, feedback as feedbackT, majors as majorsT, roles as rolesT, skills as skillsT, universities as universitiesT } from "@/lib/db/schema";
import GlobalSearch, { type SearchEntry } from "./GlobalSearch";

export default async function AdminHomePage() {
  const [universities, faculties, majors, courses, skills, canonical, roles, demand, feedback, feedbackUp] =
    await Promise.all([
      db.select().from(universitiesT).orderBy(asc(universitiesT.name)),
      db.select().from(facultiesT).orderBy(asc(facultiesT.name)),
      db.select().from(majorsT).orderBy(asc(majorsT.name)),
      db.select().from(coursesT).orderBy(asc(coursesT.major_id), asc(coursesT.ord)),
      db.select().from(skillsT).orderBy(asc(skillsT.major_id), asc(skillsT.key)),
      db.select().from(canonicalT).orderBy(asc(canonicalT.id)),
      db.select().from(rolesT).orderBy(asc(rolesT.fit)),
      db.$count(demandT),
      db.$count(feedbackT),
      db.$count(feedbackT, eq(feedbackT.vote, "up")),
    ]);

  /* ทำดัชนีค้นหาจากแถวจริงในฐานข้อมูล ไม่ใช่รายการที่เขียนตายตัว —
     เพิ่มข้อมูลใหม่แล้วค้นเจอทันทีโดยไม่ต้องแก้หน้านี้
     ชื่อคณะ/มหาวิทยาลัยถูกแมปไว้ล่วงหน้า เพื่อให้พิมพ์ชื่อคณะแล้วเจอสาขาในคณะนั้น */
  const uniName = new Map(universities.map((u) => [u.id, u.name]));
  const facName = new Map(faculties.map((f) => [f.id, f.name]));
  const majorName = new Map(majors.map((m) => [m.id, m.name]));

  const entries: SearchEntry[] = [
    ...universities.map((u) => ({
      type: "มหาวิทยาลัย",
      label: u.name,
      sub: u.short_name,
      href: `/admin/universities/${encodeURIComponent(u.id)}`,
      text: [u.name, u.short_name, u.id].join(" "),
    })),
    ...faculties.map((f) => ({
      type: "คณะ",
      label: f.name,
      sub: [uniName.get(f.university_id), f.campus].filter(Boolean).join(" · "),
      href: `/admin/faculties/${encodeURIComponent(f.id)}`,
      text: [f.name, f.id, uniName.get(f.university_id), f.campus].filter(Boolean).join(" "),
    })),
    ...majors.map((m) => ({
      type: "สาขา",
      label: m.name,
      sub: [m.faculty_id ? facName.get(m.faculty_id) : "ยังไม่ระบุคณะ", uniName.get(m.university_id)]
        .filter(Boolean)
        .join(" · "),
      href: `/admin/majors/${encodeURIComponent(m.id)}`,
      text: [
        m.name,
        m.id,
        m.faculty_id ? facName.get(m.faculty_id) : "",
        uniName.get(m.university_id),
        m.curriculum_id,
        m.level,
        m.isced_field,
      ]
        .filter(Boolean)
        .join(" "),
    })),
    ...courses.map((c) => ({
      type: "รายวิชา",
      label: `${c.code} ${c.name}`,
      sub: [majorName.get(c.major_id) ?? c.major_id, c.when_label].join(" · "),
      href: `/admin/courses/${encodeURIComponent(c.major_id)}/${encodeURIComponent(c.code)}`,
      text: [c.code, c.name, majorName.get(c.major_id) ?? c.major_id, c.when_label].join(" "),
    })),
    ...skills.map((s) => ({
      type: "ทักษะ",
      label: s.key,
      sub: [majorName.get(s.major_id) ?? s.major_id, s.code].filter(Boolean).join(" · "),
      href: `/admin/skills/${encodeURIComponent(s.major_id)}/${encodeURIComponent(s.key)}`,
      text: [s.key, s.code, s.note, s.alias, majorName.get(s.major_id) ?? s.major_id].filter(Boolean).join(" "),
    })),
    ...canonical.map((c) => ({
      type: "สกิลกลาง",
      label: c.name,
      sub: [c.name_en, c.category].filter(Boolean).join(" · "),
      href: `/admin/canonical-skills/${encodeURIComponent(c.id)}`,
      text: [c.name, c.name_en, c.category, c.esco_id, c.id].filter(Boolean).join(" "),
    })),
    ...roles.map((r) => ({
      type: "อาชีพ",
      label: r.name,
      sub: `${r.posts.toLocaleString()} ประกาศ · ${r.jr_posts.toLocaleString()} ระดับ junior`,
      href: `/admin/roles/${encodeURIComponent(r.id)}`,
      text: [r.name, r.id].join(" "),
    })),
  ];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>ภาพรวม</h1>
          <p>ข้อมูลในฐานข้อมูล — ยังไม่เชื่อมกับหน้าเว็บสาธารณะ (ตอนนี้หน้าเว็บอ่านจาก lib/data.ts เหมือนเดิม)</p>
        </div>
      </div>

      <GlobalSearch entries={entries} />

      <div className="admin-cards">
        <Link href="/admin/universities" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{universities.length}</div>
          <div className="l">มหาวิทยาลัย</div>
        </Link>
        <Link href="/admin/faculties" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{faculties.length}</div>
          <div className="l">คณะ</div>
        </Link>
        <Link href="/admin/majors" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{majors.length}</div>
          <div className="l">สาขา</div>
        </Link>
        <Link href="/admin/courses" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{courses.length}</div>
          <div className="l">รายวิชา</div>
        </Link>
        <Link href="/admin/skills" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{skills.length}</div>
          <div className="l">ทักษะ</div>
        </Link>
        <Link href="/admin/canonical-skills" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{canonical.length}</div>
          <div className="l">สกิลกลาง</div>
        </Link>
        <Link href="/admin/roles" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{roles.length}</div>
          <div className="l">อาชีพ</div>
        </Link>
        <Link href="/admin/roles" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{demand}</div>
          <div className="l">แถวความต้องการทักษะ</div>
        </Link>
        <Link href="/admin/feedback" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{feedback}</div>
          <div className="l">
            ฟีดแบ็กทั้งหมด {feedback ? `(${feedbackUp} ตรง)` : ""}
          </div>
        </Link>
      </div>
    </>
  );
}
