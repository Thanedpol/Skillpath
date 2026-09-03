import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses as coursesT, demand as demandT, feedback as feedbackT, majors as majorsT, roles as rolesT, skills as skillsT } from "@/lib/db/schema";

export default async function AdminHomePage() {
  const [majors, courses, skills, roles, demand, feedback, feedbackUp] = await Promise.all([
    db.$count(majorsT),
    db.$count(coursesT),
    db.$count(skillsT),
    db.$count(rolesT),
    db.$count(demandT),
    db.$count(feedbackT),
    db.$count(feedbackT, eq(feedbackT.vote, "up")),
  ]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>ภาพรวม</h1>
          <p>ข้อมูลในฐานข้อมูล — ยังไม่เชื่อมกับหน้าเว็บสาธารณะ (ตอนนี้หน้าเว็บอ่านจาก lib/data.ts เหมือนเดิม)</p>
        </div>
      </div>

      <div className="admin-cards">
        <Link href="/admin/majors" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{majors}</div>
          <div className="l">สาขา</div>
        </Link>
        <Link href="/admin/courses" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{courses}</div>
          <div className="l">รายวิชา</div>
        </Link>
        <Link href="/admin/skills" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{skills}</div>
          <div className="l">ทักษะ</div>
        </Link>
        <Link href="/admin/roles" className="admin-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="n">{roles}</div>
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
