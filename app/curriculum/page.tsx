"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Drawer from "@/components/Drawer";
import TrustPanel from "@/components/TrustPanel";
import { COURSES, POSTS, SK, STATE, demandFor, postKeyFor, skillsForCourse } from "@/lib/data";
import { getSkillState, useProfile } from "@/lib/profile";
import type { Course, Profile, SkillResolved } from "@/lib/types";

/* ---------- course list, grouped by year (static — no profile dependency) ---------- */
function courseYearGroups(): { year: string; courses: [string, Course][] }[] {
  const byYear: Record<string, [string, Course][]> = {};
  Object.entries(COURSES).forEach(([code, c]) => {
    const y = c.when.split(" · ")[0];
    (byYear[y] = byYear[y] || []).push([code, c]);
  });
  return Object.keys(byYear)
    .sort()
    .map((year) => ({
      year,
      courses: byYear[year].slice().sort((a, b) => a[1].ord - b[1].ord),
    }));
}

function subtitleFor(skill: string): string {
  const d = demandFor(skill);
  return d.n
    ? `พบใน ${d.n} ประกาศ ทั่ว ${d.roles} ตำแหน่งงานที่เราติดตาม`
    : "ยังไม่มีในชุดข้อมูลประกาศงานตัวอย่างของเรา";
}

function StatusGlyph({ m }: { m: SkillResolved }) {
  const st = STATE[m.st];
  const bg =
    m.st === "covered" || m.st === "hidden"
      ? "var(--ink)"
      : m.st === "progress"
      ? "repeating-linear-gradient(135deg,var(--ink) 0 2px,transparent 2px 4px)"
      : m.st === "available"
      ? "transparent"
      : "var(--rust)";
  return (
    <>
      <span
        className="dot"
        style={m.st === "available" ? { background: bg, border: "1.5px solid var(--accent)" } : { background: bg }}
      />
      {st.t}
    </>
  );
}

/* ---------- drawer: same evidence pattern as app.html, keyed by skill only ---------- */
function CurriculumDrawerBody({ skill, profile }: { skill: string; profile: Profile }) {
  const m = getSkillState(skill, profile);
  const d = demandFor(skill);
  const key = postKeyFor(skill);
  const posts = key ? POSTS[key] : null;

  return (
    <>
      {m.alias ? (
        <div className="aliasbox">
          <b>ฝั่งหลักสูตรเขียนคนละคำ</b>
          <br />
          {m.alias}
          {m.src ? (
            <>
              <br />
              <span style={{ fontSize: 11.5, opacity: 0.8 }}>ที่มา: {m.src}</span>
            </>
          ) : null}
        </div>
      ) : null}
      <div className="dnote">
        <b style={{ color: "var(--ink)" }}>สถานะของคุณตอนนี้:</b> {STATE[m.st].t}
        {m.note ? ` — ${m.note}` : ""}
      </div>
      {!posts ? (
        <div className="dnone">
          เดโมนี้ยังไม่ได้เตรียมตัวอย่างประกาศของทักษะนี้
          <br />
          <span>เราเลือกไม่แสดงข้อความของทักษะอื่นมาแทน — ในระบบจริงทุกทักษะจะมีประกาศต้นทางของตัวเอง</span>
        </div>
      ) : (
        <>
          {posts.map((p, i) => (
            <div className="post" key={i}>
              <div className="postco">{p.co}</div>
              <div className="postmeta">{p.meta}</div>
              <div className="postq" dangerouslySetInnerHTML={{ __html: p.q }} />
            </div>
          ))}
          <div className="dnote">
            ตัวอย่าง {posts.length} จาก {d.n} ประกาศ · ในระบบจริงทุกข้อความจะยกมาจากประกาศต้นทางโดยไม่เขียนใหม่
          </div>
        </>
      )}
      <TrustPanel skillKey={skill} />
    </>
  );
}

export default function CurriculumPage() {
  const { profile } = useProfile();
  const [drawerSkill, setDrawerSkill] = useState<string | null>(null);

  /* ---------- top stats ---------- */
  const total = Object.keys(COURSES).length;
  const mapped = Object.values(SK).filter((m) => m.code).length;
  const hiddenN = Object.values(SK).filter((m) => m.hidden).length;

  const yearGroups = courseYearGroups();

  return (
    <>
      <Nav />

      <div className="curriwrap">
        <div className="curriintro">
          <h1>หลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ (ปรับปรุง 2566) — ทีละวิชา</h1>
          <p>
            หน้านี้ยกระดับสิ่งที่ SkillPath พบระดับ &quot;รายอาชีพ&quot; มาดูทั้งหลักสูตรพร้อมกัน — ทุกวิชาสอนอะไรที่ตลาดงานต้องการบ้าง
            วิชาไหนสอนแล้วแต่เอกสารใช้คำที่ตลาดค้นไม่เจอ และวิชาไหนยังไม่ถูกจับคู่กับทักษะใดเลยในชุดข้อมูลตัวอย่างของเรา
            สีของสถานะจะเปลี่ยนตามโปรไฟล์ที่คุณตั้งไว้
          </p>
          <div className="curristats">
            <div className="cs-cell">
              <div className="n mono">{total}</div>
              <div className="l">รายวิชาที่ติดตาม</div>
            </div>
            <div className="cs-cell">
              <div className="n mono">{mapped}</div>
              <div className="l">ทักษะที่จับคู่กับตลาดงานได้</div>
            </div>
            <div className="cs-cell">
              <div className="n mono" style={{ color: "var(--rust)" }}>
                {hiddenN}
              </div>
              <div className="l">ทักษะที่ &quot;เอกสารใช้คำอื่น&quot; — สอนแล้วแต่ค้นไม่เจอ</div>
            </div>
          </div>
        </div>

        <div>
          {yearGroups.map(({ year, courses }) => (
            <div className="yeargroup" key={year}>
              <span className="seclbl">{year}</span>
              {courses.map(([code, c]) => {
                const skills = skillsForCourse(code);
                return (
                  <div className="coursecard" key={code}>
                    <div className="cctop">
                      <span className="code">{code}</span>
                      <span className="ccname">{c.name}</span>
                      <span className="ccwhen">{c.when}</span>
                    </div>
                    {skills.length ? (
                      <div className="ccskills">
                        {skills.map((k) => {
                          const m = getSkillState(k, profile);
                          const d = demandFor(k);
                          return (
                            <button className="ccskillchip" type="button" key={k} onClick={() => setDrawerSkill(k)}>
                              <StatusGlyph m={m} />
                              <span>{k}</span>
                              {m.hidden ? <em className="aliaschip">เอกสารใช้คำอื่น</em> : null}
                              {d.n ? <span className="rn">{d.n} ประกาศ</span> : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="ccempty">ยังไม่มีทักษะที่จับคู่ไว้กับวิชานี้ในชุดข้อมูลตัวอย่าง</p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <p className="foot" style={{ marginTop: 40 }}>
          <b>ฝั่งหลักสูตร = เอกสารจริง</b> — รหัสวิชา ชื่อวิชา และลำดับปี/เทอม ยกมาจากหลักสูตร วท.บ. วิทยาการคอมพิวเตอร์
          (ปรับปรุง พ.ศ. 2566) คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยธรรมศาสตร์ โดยตรง
          <br />
          <b>ทักษะที่จับคู่ไว้ = ชุดตัวอย่างของทีมสำหรับสาธิต UI</b> — วิชาจริงอาจครอบคลุมทักษะมากกว่าที่แสดงในเดโมนี้
          ยังไม่ใช่ผลจากการประมวลผลคำอธิบายรายวิชาแบบอัตโนมัติ
        </p>
      </div>

      <Drawer
        open={!!drawerSkill}
        onClose={() => setDrawerSkill(null)}
        title={drawerSkill ?? ""}
        subtitle={drawerSkill ? subtitleFor(drawerSkill) : ""}
      >
        {drawerSkill ? <CurriculumDrawerBody skill={drawerSkill} profile={profile} /> : null}
      </Drawer>
    </>
  );
}
