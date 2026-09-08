"use client";

/* ============================================================
   ภาพประกอบหน้าแรก — จอโน้ตบุ๊กที่แสดง "เส้นทาง" จริงของ SkillPath
   พร้อมการ์ดลอยที่หยิบข้อความสำคัญออกมาจากหน้าจอเดียวกัน

   ตัวเลข ชื่อวิชา และคำที่หลักสูตรใช้เรียกทักษะ ทั้งหมดคำนวณจาก route()
   ตัวเดียวกับที่หน้า /explore ใช้ ไม่ได้เขียนค่าตายตัวไว้ — ภาพจึงเปลี่ยน
   ตามข้อมูลจริงเสมอ และไม่มีทางที่ภาพหน้าแรกจะไม่ตรงกับสิ่งที่แอปคำนวณได้
   ============================================================ */

import { COURSES_BY_MAJOR, ROLES } from "@/lib/data";
import { DEFAULT_PROFILE, courseGroups, getSkillState, route } from "@/lib/profile";
import type { CourseGroup, DemandPair } from "@/lib/types";

/* ดึงคำที่อยู่ในเครื่องหมายคำพูดออกจากหมายเหตุ เช่น
   'เอกสารหลักสูตรเขียนว่า “คอนเทนเนอร์” — ชื่อหมวดหมู่…' → 'คอนเทนเนอร์'
   ใช้ข้อความจากเอกสารจริง ไม่ได้เรียบเรียงใหม่ */
function quotedTerm(s?: string): string | null {
  const m = s?.match(/[“"]([^”"]+)[”"]/);
  return m ? m[1] : null;
}

/* ชื่อวิชาในเอกสารเขียนเป็น "ไทย · English" — ในจอเล็กใช้ครึ่งไทยพอ */
function thaiName(name?: string): string {
  return (name ?? "").split(" · ")[0];
}

const EXAMPLE_ROLE = "de";

export default function HeroArt() {
  const role = ROLES.find((r) => r.id === EXAMPLE_ROLE);
  const R = route(EXAMPLE_ROLE, DEFAULT_PROFILE);
  if (!role || !R) return null;

  const courses = COURSES_BY_MAJOR[DEFAULT_PROFILE.major] || {};
  const meta = (k: string) => getSkillState(k, DEFAULT_PROFILE);
  const firstGroup = (pairs: DemandPair[]): CourseGroup | null =>
    courseGroups(pairs, DEFAULT_PROFILE.major).find((g) => g.code !== "__") ?? null;

  const coverage = R.P.done + R.P.now;
  /* "ถึงตรงนี้กี่ %" สะสมทีละช่วง — ตัวเลขชุดเดียวกับหน้าแผนจริง */
  const reach = {
    done: R.P.done,
    now: R.P.done + R.P.now,
    next: R.P.done + R.P.now + R.P.next,
  };

  const stages = [
    { key: "done", label: "เรียนมาแล้ว", pct: reach.done, group: firstGroup(R.done) },
    { key: "now", label: "กำลังเรียน", pct: reach.now, group: firstGroup(R.now) },
    { key: "next", label: "ลงทะเบียนเทอมหน้า", pct: reach.next, group: firstGroup(R.next) },
  ].filter((s) => s.group);

  const segs: [string, number][] = [
    ["done", R.P.done],
    ["now", R.P.now],
    ["next", R.P.next],
    ["out", R.P.out],
    ["rest", R.P.opt + R.P.stuck],
  ];

  /* การ์ดลอยใบที่ 1 — แก่นของผลิตภัณฑ์: คำเดียวกัน สองฝั่งเขียนคนละอย่าง */
  const renamed = R.hid.find(([k]) => !!quotedTerm(meta(k).alias))?.[0] ?? null;
  const renamedTerm = renamed ? quotedTerm(meta(renamed).alias) : null;

  /* การ์ดลอยใบที่ 2 — สิ่งที่ทำได้พรุ่งนี้: ลงวิชานี้แล้วขยับกี่ % */
  const nextGroup = firstGroup(R.next);
  const nextGain = nextGroup ? R.pct(nextGroup.n) : 0;

  return (
    <div className="heroart">
      <figure className="laptop">
        <div className="laptop-screen">
          <div className="mini">
            <div className="mini-bar">
              <span className="mini-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="mini-tab">เส้นทางของฉัน</span>
            </div>

            <div className="mini-body">
              <div className="mini-head">
                <div>
                  <b>เส้นทางสู่ {role.name}</b>
                  <span>
                    {role.posts.toLocaleString()} ประกาศงาน · {role.jrPosts.toLocaleString()} ระดับ junior
                  </span>
                </div>
                <div className="mini-cov">
                  <b className="mono">{coverage}%</b>
                  <span>ครอบคลุมแล้ว</span>
                </div>
              </div>

              <div className="mini-meter" role="presentation">
                {segs.map(([k, v], i) =>
                  v > 0 ? (
                    <span
                      key={k}
                      className={`ms ms-${k}`}
                      style={{ width: `${v}%`, animationDelay: `${0.45 + i * 0.09}s` }}
                    />
                  ) : null
                )}
              </div>

              {/* เส้นทางเป็นช่วง ๆ — รูปทรงเดียวกับหน้าแผนจริง ไม่ใช่รายการทักษะเรียงกัน */}
              <ol className="mini-route">
                {stages.map((s, i) => (
                  <li key={s.key} className={`mr-step mr-${s.key}`} style={{ animationDelay: `${0.7 + i * 0.13}s` }}>
                    <span className="mr-node" />
                    <div className="mr-body">
                      <div className="mr-top">
                        <b>{s.label}</b>
                        <span className="mr-pct mono">ถึงตรงนี้ {s.pct}%</span>
                      </div>
                      <div className="mr-chip">
                        <em className="mono">{s.group!.code}</em>
                        <span>{thaiName(courses[s.group!.code]?.name)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="laptop-base" />
        <figcaption className="sr-only">
          ตัวอย่างหน้าจอ SkillPath — เส้นทางสู่ {role.name} ครอบคลุมแล้ว {coverage}% แบ่งเป็นช่วง
          {stages.map((s) => ` ${s.label} ${s.pct}%`).join(" ·")}
        </figcaption>
      </figure>

      {/* ---------- การ์ดลอย ---------- */}
      {renamed && renamedTerm ? (
        <div className="float float-gap">
          <div className="floatcard gapcard">
            <div className="gc-side">
              <span className="gc-lbl">ประกาศงานเขียนว่า</span>
              <b>{renamed}</b>
            </div>
            <span className="gc-link" aria-hidden="true">
              =
            </span>
            <div className="gc-side">
              <span className="gc-lbl">หลักสูตรเขียนว่า</span>
              <b>{renamedTerm}</b>
            </div>
          </div>
        </div>
      ) : null}

      {nextGroup && nextGain > 0 ? (
        <div className="float float-next">
          <div className="floatcard nextcard">
            <span className="nc-gain mono">+{nextGain}%</span>
            <span className="nc-txt">
              ถ้าลง <b className="mono">{nextGroup.code}</b> เทอมหน้า
            </span>
          </div>
        </div>
      ) : null}

      <div className="float float-honest">
        <div className="floatcard honestcard">
          <span className="hc-dot" aria-hidden="true" />
          <span>ข้อมูลไม่ถึงเกณฑ์ เราจะไม่ให้ตัวเลข</span>
        </div>
      </div>
    </div>
  );
}
