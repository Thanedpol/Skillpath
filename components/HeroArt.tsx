"use client";

/* ============================================================
   ภาพประกอบหน้าแรก — จอโน้ตบุ๊กที่แสดงหน้าจอจริงของ SkillPath
   พร้อมการ์ดที่อธิบายแก่นของผลิตภัณฑ์ (คำเดียวกันแต่เขียนคนละภาษา)

   ตัวเลขและชื่อวิชาทุกตัวในภาพนี้คำนวณจาก route() ตัวเดียวกับที่หน้า
   /explore ใช้ ไม่ได้เขียนค่าตายตัวไว้ — ภาพจึงเปลี่ยนตามข้อมูลจริงเสมอ
   และไม่มีทางที่ภาพโฆษณาจะไม่ตรงกับสิ่งที่แอปคำนวณได้จริง
   ============================================================ */

import { COURSES_BY_MAJOR, ROLES } from "@/lib/data";
import { DEFAULT_PROFILE, getSkillState, route } from "@/lib/profile";
import type { DemandPair } from "@/lib/types";

/* ดึงคำที่อยู่ในเครื่องหมายคำพูดออกจากหมายเหตุ เช่น
   'เอกสารหลักสูตรเขียนว่า “คอนเทนเนอร์” — ชื่อหมวดหมู่…' → 'คอนเทนเนอร์'
   ใช้ข้อความจากเอกสารจริง ไม่ได้เรียบเรียงใหม่ */
function quotedTerm(s?: string): string | null {
  const m = s?.match(/[“"]([^”"]+)[”"]/);
  return m ? m[1] : null;
}

const EXAMPLE_ROLE = "de";

export default function HeroArt() {
  const role = ROLES.find((r) => r.id === EXAMPLE_ROLE);
  const R = route(EXAMPLE_ROLE, DEFAULT_PROFILE);
  if (!role || !R) return null;

  const courses = COURSES_BY_MAJOR[DEFAULT_PROFILE.major] || {};
  const meta = (k: string) => getSkillState(k, DEFAULT_PROFILE);
  const firstWith = (pairs: DemandPair[], ok: (k: string) => boolean) => pairs.find(([k]) => ok(k))?.[0] ?? null;

  const coverage = R.P.done + R.P.now;
  const covered = firstWith(R.done, (k) => !!meta(k).code && !meta(k).hidden);
  const renamed = firstWith(R.hid, (k) => !!quotedTerm(meta(k).alias));
  const upcoming = firstWith(R.next, (k) => !!meta(k).code);

  const segs: [string, number][] = [
    ["done", R.P.done],
    ["now", R.P.now],
    ["next", R.P.next],
    ["out", R.P.out],
    ["rest", R.P.opt + R.P.stuck],
  ];

  const renamedMeta = renamed ? meta(renamed) : null;
  const renamedTerm = renamedMeta ? quotedTerm(renamedMeta.alias) : null;

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
                  <b>{role.name}</b>
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
                {segs.map(([k, v]) => (v > 0 ? <span key={k} className={`ms ms-${k}`} style={{ width: `${v}%` }} /> : null))}
              </div>

              <ul className="mini-rows">
                {covered ? (
                  <li>
                    <i className="mk mk-done" />
                    <span className="mr-name">{covered}</span>
                    <span className="mr-meta mono">{meta(covered).code}</span>
                  </li>
                ) : null}

                {renamed && renamedTerm ? (
                  <li>
                    <i className="mk mk-done" />
                    <span className="mr-name">
                      {renamed}
                      <em>หลักสูตรเขียนว่า “{renamedTerm}”</em>
                    </span>
                    <span className="mr-meta mono">{renamedMeta?.code}</span>
                  </li>
                ) : null}

                {upcoming ? (
                  <li>
                    <i className="mk mk-next" />
                    <span className="mr-name">
                      {upcoming}
                      <em>{courses[meta(upcoming).code ?? ""]?.when ?? ""}</em>
                    </span>
                    <span className="mr-meta mono">{meta(upcoming).code}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
        <div className="laptop-base" />
        <figcaption className="sr-only">
          ตัวอย่างหน้าจอ SkillPath — เส้นทางสู่ {role.name} ครอบคลุมแล้ว {coverage}% พร้อมรายการทักษะที่ได้จากรายวิชาจริง
        </figcaption>
      </figure>

      {/* แก่นของผลิตภัณฑ์ในภาพเดียว — คำเดียวกัน แต่สองฝั่งเขียนคนละอย่าง */}
      {renamed && renamedTerm ? (
        <div className="gapcard">
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
      ) : null}
    </div>
  );
}
