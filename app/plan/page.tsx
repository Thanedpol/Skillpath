"use client";

/* ============================================================
   เอกสารแผนทักษะรายบุคคล — หน้าสำหรับอ่านและบันทึกเป็น PDF

   ทำไมใช้การพิมพ์ของเบราว์เซอร์แทนไลบรารีสร้าง PDF:
   ภาษาไทยต้องจัดวางสระบน-ล่างและวรรณยุกต์ด้วย text shaping (GPOS)
   ไลบรารีฝั่ง JS อย่าง pdf-lib/jsPDF ไม่ทำ shaping ให้ ตัวอักษรจะเพี้ยน
   ส่วนเบราว์เซอร์จัดไทยถูกต้องอยู่แล้ว การพิมพ์ผ่านเบราว์เซอร์จึงได้
   PDF ที่ตัวอักษรถูกต้อง เลือกคัดลอกได้ และไม่ต้องเพิ่ม dependency ใด ๆ
   ============================================================ */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import { COURSES_BY_MAJOR, MIN_POSTS, ROLES, schoolLabel, MAJORS } from "@/lib/data";
import {
  courseGroups,
  getSkillState,
  isCustomMajor,
  profileGoalLabel,
  profileMajorLabel,
  route as computeRoute,
  termLabel,
  useProfile,
  CUSTOM_ROLE_ID,
} from "@/lib/profile";
import type { CourseGroup, DemandPair, Profile } from "@/lib/types";

/* กลุ่มรายวิชา → แถวเดียวในตาราง "ทักษะที่มีอยู่แล้ว" */
function HaveRows({ groups, profile }: { groups: CourseGroup[]; profile: Profile }) {
  const courses = COURSES_BY_MAJOR[profile.major] || {};
  return (
    <>
      {groups.map((g) => {
        const c = courses[g.code];
        return (
          <tr key={g.code}>
            <td className="pd-code mono">{g.code === "__" ? "—" : g.code}</td>
            <td>
              <b>{c?.name ?? "นอกหลักสูตร"}</b>
              {c?.when ? <div className="pd-sub">{c.when}</div> : null}
            </td>
            <td>
              <ul className="pd-skills">
                {g.skills.map(([k]) => {
                  const m = getSkillState(k, profile);
                  return (
                    <li key={k}>
                      {k}
                      {m.partial ? <span className="pd-tag">ครอบคลุมบางส่วน</span> : null}
                      {/* จุดขายจริงของเอกสารนี้ — บอกว่าใบเกรดเรียกทักษะนี้ว่าอะไร
                          เวลาเขียนเรซูเม่จะได้กล้าเคลมและอ้างวิชาได้ถูก */}
                      {m.hidden && m.alias ? <div className="pd-alias">{m.alias}</div> : null}
                    </li>
                  );
                })}
              </ul>
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default function PlanPage() {
  const { profile, hasProfile, ready } = useProfile();
  const [printedAt, setPrintedAt] = useState("");
  const [roleId, setRoleId] = useState<string | null>(null);

  /* วันที่ต้องคำนวณหลัง mount — ไม่งั้น HTML ฝั่งเซิร์ฟเวอร์กับฝั่งเบราว์เซอร์จะไม่ตรงกัน */
  useEffect(() => {
    setPrintedAt(
      new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })
    );
  }, []);

  useEffect(() => {
    if (!ready) return;
    const goal = profile.goalRole;
    setRoleId(goal && goal !== CUSTOM_ROLE_ID && ROLES.some((r) => r.id === goal) ? goal : null);
  }, [ready, profile.goalRole]);

  const role = ROLES.find((r) => r.id === roleId) || null;
  const R = useMemo(() => (role ? computeRoute(role.id, profile) : null), [role, profile]);

  const usingCustomMajor = isCustomMajor(profile);
  const curriMajor = MAJORS.find((m) => m.id === profile.major);
  /* ต่ำกว่าเกณฑ์ = ไม่พิมพ์เปอร์เซ็นต์ ใช้กติกาเดียวกับหน้าเว็บ ไม่ผ่อนปรนเพราะเป็นเอกสาร */
  const showPct = !!role && role.jrPosts >= MIN_POSTS;

  /* รวม "เรียนจบแล้ว" กับ "กำลังเรียน" เข้าตารางเดียว — วิชาเดียวอาจให้ทักษะ
     ทั้งสองสถานะ (เช่น วิชาที่จบแล้วแต่ครอบคลุมทักษะหนึ่งไม่เต็ม) แยกสองตาราง
     แล้วรหัสวิชาเดิมจะโผล่ซ้ำในเอกสาร ป้าย "ครอบคลุมบางส่วน" ทำหน้าที่แยกให้อยู่แล้ว */
  const haveG = R ? courseGroups([...R.done, ...R.now], profile.major) : [];
  const nextG = R ? courseGroups(R.next, profile.major) : [];
  const courses = COURSES_BY_MAJOR[profile.major] || {};
  const goalLabel = profileGoalLabel(profile);

  const pctOf = (n: number) => (R ? Math.round((n / R.denom) * 100) : 0);
  const outAll: DemandPair[] = R ? [...R.out, ...R.more] : [];

  if (!ready) return null;

  return (
    <>
      <Nav />

      <div className="wrap plandocwrap">
        {/* แถบเครื่องมือ — ไม่ถูกพิมพ์ลงกระดาษ */}
        <div className="planbar">
          <div>
            <h1 className="planbar-title">แผนทักษะของคุณ</h1>
            <p className="planbar-sub">
              บันทึกเก็บไว้เป็นไฟล์ PDF ได้เลย ไม่ต้องสมัครสมาชิก — เอกสารสรุปว่าคุณมีทักษะอะไรแล้ว
              และเหลืออะไรต้องพัฒนา พร้อมคำที่หลักสูตรใช้เรียกทักษะนั้น สำหรับใช้อ้างอิงตอนเขียนเรซูเม่
            </p>
          </div>
          <div className="planbar-actions">
            {ROLES.length > 1 ? (
              <label className="planpick">
                <span>ตำแหน่ง</span>
                <select value={roleId ?? ""} onChange={(e) => setRoleId(e.target.value || null)}>
                  <option value="">— เลือกตำแหน่ง —</option>
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <button
              type="button"
              className="cta"
              disabled={!R}
              onClick={() => window.print()}
            >
              บันทึกเป็น PDF
            </button>
          </div>
        </div>

        {!hasProfile ? (
          <div className="plannotice">
            <b>ยังไม่ได้ตั้งโปรไฟล์</b>
            <p>
              เอกสารนี้สร้างจากสาขา ชั้นปี และเป้าหมายอาชีพของคุณ ตั้งค่าครั้งเดียวใช้เวลาไม่ถึงนาที
            </p>
            <Link className="cta" href="/onboarding">
              ตั้งค่าโปรไฟล์ →
            </Link>
          </div>
        ) : usingCustomMajor ? (
          <div className="plannotice">
            <b>สาขาที่คุณกรอกเองยังไม่มีข้อมูลรายวิชาในระบบ</b>
            <p>
              เราจึงยังสร้างเอกสารแผนให้ไม่ได้ เพราะจะต้องเดารายวิชาที่คุณเรียน ซึ่งเราไม่ทำ —
              คำขอของคุณถูกบันทึกไว้แล้ว และสาขาที่มีคนขอมากจะถูกนำเข้าก่อน
            </p>
            <Link className="cta ghost" href="/onboarding">
              เปลี่ยนเป็นสาขาที่มีข้อมูล →
            </Link>
          </div>
        ) : !role ? (
          <div className="plannotice">
            <b>เลือกตำแหน่งที่ต้องการก่อน</b>
            <p>เอกสารจะสรุปทักษะที่มีแล้วและที่ต้องพัฒนา เทียบกับตำแหน่งที่เลือกไว้ด้านบน</p>
          </div>
        ) : !R ? (
          <div className="plannotice">
            <b>ยังไม่มีข้อมูลความต้องการทักษะของตำแหน่งนี้</b>
            <p>ลองเลือกตำแหน่งอื่นที่มีข้อมูลพอให้อ้างอิงได้</p>
          </div>
        ) : (
          /* ---------- ตัวเอกสารจริง ---------- */
          <article className="plandoc">
            <header className="pd-head">
              <span className="pd-brand">
                Skill<span>Path</span>
              </span>
              <span className="pd-issued">
                แผนทักษะรายบุคคล{printedAt ? ` · ออกเอกสารเมื่อ ${printedAt}` : ""}
              </span>
            </header>

            <h2 className="pd-title">เส้นทางสู่ {role.name}</h2>

            <table className="pd-profile">
              <tbody>
                <tr>
                  <th>สาขา</th>
                  <td>
                    {profileMajorLabel(profile)}
                    {curriMajor ? <div className="pd-sub">{schoolLabel(curriMajor.id)}</div> : null}
                  </td>
                  <th>ชั้นปี</th>
                  <td>{termLabel(profile.ord)}</td>
                </tr>
                <tr>
                  <th>เป้าหมาย</th>
                  <td>{goalLabel ?? role.name}</td>
                  <th>ประกาศงานอ้างอิง</th>
                  <td>
                    {/* mono เฉพาะตัวเลข — ฟอนต์ mono ทำให้ข้อความไทยอ่านแปลกตา */}
                    <span className="mono">{role.jrPosts.toLocaleString()}</span> รายการ (ระดับ junior)
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ---------- สรุปความพร้อม ---------- */}
            <section className="pd-section">
              <h3>สรุปความพร้อม</h3>
              {showPct ? (
                <>
                  <p className="pd-lead">
                    วันนี้คุณครอบคลุมสิ่งที่ประกาศงานระดับ junior ตำแหน่งนี้ขอไปแล้ว{" "}
                    <b className="pd-big mono">{R.P.done + R.P.now}%</b> และถ้าทำตามแผนในเอกสารนี้จนครบ
                    จะขึ้นไปถึง <b className="mono">{R.P.done + R.P.now + R.P.next + R.P.out}%</b>
                  </p>
                  <table className="pd-table pd-breakdown">
                    <thead>
                      <tr>
                        <th>สถานะ</th>
                        <th className="pd-num">สัดส่วน</th>
                        <th>ความหมาย</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>เรียนมาแล้ว</td>
                        <td className="pd-num mono">{R.P.done}%</td>
                        <td>วิชาที่เรียนจบและตรงกับที่ตลาดขอ</td>
                      </tr>
                      <tr>
                        <td>กำลังเรียน</td>
                        <td className="pd-num mono">{R.P.now}%</td>
                        <td>วิชาเทอมนี้ จบแล้วนับเป็นของคุณ</td>
                      </tr>
                      <tr>
                        <td>เทอมหน้า</td>
                        <td className="pd-num mono">{R.P.next}%</td>
                        <td>ได้เพิ่มถ้าลงวิชาตามที่แนะนำ</td>
                      </tr>
                      <tr>
                        <td>ทำเองได้</td>
                        <td className="pd-num mono">{R.P.out}%</td>
                        <td>ไม่มีวิชาสอน แต่ปิดเองได้ก่อนสมัครงาน</td>
                      </tr>
                      <tr>
                        <td>ยังไม่อยู่ในแผน</td>
                        <td className="pd-num mono">{R.P.opt}%</td>
                        <td>ปรากฏต่ำกว่า 25% ของประกาศ ทำเพิ่มได้ถ้ามีเวลา</td>
                      </tr>
                      <tr>
                        <td>ต้องได้จากงานจริง</td>
                        <td className="pd-num mono">{R.P.stuck}%</td>
                        <td>การเรียนไม่ช่วย ต้องเจอในงานจริง</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="pd-lead pd-warn">
                  ตำแหน่งนี้มีประกาศระดับ junior เพียง <b className="mono">{role.jrPosts}</b> รายการ
                  ต่ำกว่าเกณฑ์ขั้นต่ำ {MIN_POSTS} รายการที่เราตั้งไว้ เอกสารนี้จึงไม่ระบุเปอร์เซ็นต์ความครอบคลุม
                  เพราะตัวเลขจะดูแม่นยำเกินกว่าที่ข้อมูลรองรับ — รายการทักษะด้านล่างยังใช้อ้างอิงได้ตามปกติ
                </p>
              )}
            </section>

            {/* ---------- 1. ทักษะที่มีอยู่แล้ว ---------- */}
            <section className="pd-section">
              <h3>1 · ทักษะที่คุณมีอยู่แล้ว</h3>
              <p className="pd-lead">
                มาจากวิชาที่เรียนจบและวิชาที่กำลังเรียนอยู่ ทุกบรรทัดอ้างอิงรหัสวิชาจริงในหลักสูตร
                ใช้ยืนยันกับผู้สัมภาษณ์ได้
              </p>
              {haveG.length === 0 ? (
                <p className="pd-empty">
                  ยังไม่มีวิชาที่เรียนจบหรือกำลังเรียนที่ตรงกับตำแหน่งนี้ — เส้นทางเริ่มจากส่วนที่ 2
                </p>
              ) : (
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th style={{ width: "16%" }}>รหัสวิชา</th>
                      <th style={{ width: "38%" }}>รายวิชา</th>
                      <th>ทักษะที่ได้</th>
                    </tr>
                  </thead>
                  <tbody>
                    <HaveRows groups={haveG} profile={profile} />
                  </tbody>
                </table>
              )}
              {R.hid.length ? (
                <p className="pd-note">
                  ในจำนวนนี้มี {R.hid.length} ทักษะที่เอกสารหลักสูตรเรียกด้วยคำอื่น
                  (ข้อความตัวเอียงใต้ชื่อทักษะ) — คุณมีทักษะนั้นแล้วจริง แต่ค้นจากใบเกรดด้วยชื่อสากลจะไม่เจอ
                </p>
              ) : null}
            </section>

            {/* ---------- 2. ทักษะที่ต้องพัฒนา ---------- */}
            <section className="pd-section">
              <h3>2 · ทักษะที่ต้องพัฒนาต่อ</h3>

              <h4 className="pd-sub-h">2.1 ลงทะเบียนเทอมหน้า</h4>
              {nextG.length ? (
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th style={{ width: "16%" }}>รหัสวิชา</th>
                      <th style={{ width: "38%" }}>รายวิชา</th>
                      <th>ปิดช่องว่างทักษะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nextG.map((g) => {
                      const c = courses[g.code];
                      return (
                        <tr key={g.code}>
                          <td className="pd-code mono">{g.code === "__" ? "—" : g.code}</td>
                          <td>
                            <b>{c?.name ?? "นอกหลักสูตร"}</b>
                            {c?.when ? <div className="pd-sub">{c.when}</div> : null}
                          </td>
                          <td>
                            {g.skills.map(([k]) => k).join(" · ")}
                            {showPct ? (
                              <div className="pd-sub">เพิ่มความครอบคลุมอีก {R.pct(g.n)}%</div>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="pd-empty">ไม่มีวิชาในหลักสูตรที่ปิดช่องว่างของตำแหน่งนี้ได้</p>
              )}

              <h4 className="pd-sub-h">2.2 ทำเองได้ · ไม่ต้องรอวิชา</h4>
              {outAll.length ? (
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th style={{ width: "26%" }}>ทักษะ</th>
                      <th style={{ width: "12%" }} className="pd-num">
                        พบในประกาศ
                      </th>
                      <th>สิ่งที่ต้องทำ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outAll.map(([k, n]) => {
                      const m = getSkillState(k, profile);
                      return (
                        <tr key={k}>
                          <td>
                            <b>{k}</b>
                          </td>
                          <td className="pd-num mono">{pctOf(n)}%</td>
                          <td>
                            {m.act || m.proof || "ตลาดงานถามหาบ่อย แต่ไม่มีวิชาไหนในหลักสูตรสอนตรง ๆ"}
                            {m.time ? <div className="pd-sub">ใช้เวลาโดยประมาณ: {m.time}</div> : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="pd-empty">ไม่มีทักษะนอกหลักสูตรที่ปรากฏถึงเกณฑ์ 25% ของประกาศ</p>
              )}

              <h4 className="pd-sub-h">2.3 ต้องได้จากงานจริงเท่านั้น</h4>
              {R.stuck.length ? (
                <>
                  <p className="pd-lead">
                    ไม่ใช่เพราะคุณขาดอะไร — ทักษะกลุ่มนี้ไม่มีห้องเรียนไหนสอนให้ได้จริง
                    รู้ไว้ล่วงหน้าเพื่อไม่ต้องโทษตัวเองตอนอ่านประกาศงาน
                  </p>
                  <table className="pd-table">
                    <thead>
                      <tr>
                        <th style={{ width: "26%" }}>ทักษะ</th>
                        <th style={{ width: "12%" }} className="pd-num">
                          พบในประกาศ
                        </th>
                        <th>ได้มาจากไหน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {R.stuck.map(([k, n]) => {
                        const m = getSkillState(k, profile);
                        return (
                          <tr key={k}>
                            <td>
                              <b>{k}</b>
                            </td>
                            <td className="pd-num mono">{pctOf(n)}%</td>
                            <td>{m.route || "ต้องได้จากการอยู่ในสถานการณ์ทำงานจริง"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="pd-empty">ทักษะทั้งหมดของตำแหน่งนี้ปิดได้ก่อนเรียนจบ ซึ่งพบไม่บ่อย</p>
              )}
            </section>

            <footer className="pd-foot">
              <b>ที่มาของข้อมูล</b>
              <p>
                หลักสูตร = เอกสารหลักสูตรฉบับจริง{" "}
                {curriMajor ? `${curriMajor.name} (ปรับปรุง 2566) ${schoolLabel(curriMajor.id)}` : "มธ. ปรับปรุง 2566"}{" "}
                · รหัสวิชาและถ้อยคำอธิบายรายวิชายกมาจากเอกสารต้นฉบับ ไม่ได้แต่งขึ้น
              </p>
              <p>
                ประกาศงาน = ชุดข้อมูลตัวอย่างสำหรับสาธิต ยังไม่ใช่ผลจากการวิเคราะห์ประกาศงานจริง —
                ใช้ตัวเลขเป็นทิศทาง ไม่ใช่ข้อสรุป
              </p>
              <p className="pd-url">ดูวิธีคำนวณทั้งหมดได้ที่หน้า &ldquo;เกี่ยวกับ&rdquo; ของ SkillPath</p>
            </footer>
          </article>
        )}
      </div>
    </>
  );
}
