"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { COURSES_BY_MAJOR, MAJORS, MIN_POSTS, ROLES, TERMS, schoolLabel, skillsForCourse } from "@/lib/data";
import { DEFAULT_PROFILE, loadProfile, roleCoverage, saveProfile } from "@/lib/profile";
import type { Course, Profile } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();

  /* ---------- draft state (ยังไม่บันทึกจนกว่าจะกด "บันทึกและเริ่มใช้งาน") ---------- */
  const [draft, setDraft] = useState<Profile>({ ...DEFAULT_PROFILE });
  const [step, setStep] = useState(1);
  const [advOpen, setAdvOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPending, setShowPending] = useState(false);

  /* สาขาที่เลือกได้จริงคือสาขาที่มีข้อมูลรายวิชา+ทักษะแล้วเท่านั้น
     ที่เหลือมาจากทะเบียนหลักสูตรเปิด แสดงให้เห็นว่ามีอยู่จริงแต่ยังใช้ไม่ได้ */
  const readyMajors = MAJORS.filter((m) => m.ready);
  const pendingMajors = MAJORS.filter((m) => !m.ready);
  const pendingByField: Record<string, typeof pendingMajors> = {};
  pendingMajors.forEach((m) => {
    const k = m.iscedField || "ไม่ระบุกลุ่มสาขา";
    (pendingByField[k] = pendingByField[k] || []).push(m);
  });

  useEffect(() => {
    const existing = loadProfile();
    if (existing) {
      setDraft({
        major: existing.major || "cs-tu",
        goalRole: existing.goalRole || null,
        ord: existing.ord || 31,
        overrides: { ...(existing.overrides || {}) },
      });
    }
  }, []);

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleSave() {
    saveProfile(draft);
    setShowToast(true);
    setTimeout(() => {
      router.push("/explore");
    }, 700);
  }

  /* ---------- step 3: courses grouped by term ord (ตามสาขาที่เลือก) ---------- */
  const majorCourses = COURSES_BY_MAJOR[draft.major] || {};
  const byOrd: Record<number, [string, Course][]> = {};
  Object.entries(majorCourses).forEach(([code, c]) => {
    (byOrd[c.ord] = byOrd[c.ord] || []).push([code, c]);
  });

  /* ---------- step 4: summary ---------- */
  const summaryMajor = MAJORS.find((x) => x.id === draft.major);
  const summaryTerm = TERMS.find((x) => x.ord === draft.ord);
  const overrideCount = Object.keys(draft.overrides).length;
  const goal = draft.goalRole ? ROLES.find((r) => r.id === draft.goalRole) : null;
  const covs = ROLES.filter((r) => r.jrPosts >= MIN_POSTS)
    .map((r) => ({ r, cov: roleCoverage(r.id, draft) }))
    .sort((a, b) => (b.cov ?? -1) - (a.cov ?? -1));
  const headline = goal ? { r: goal, cov: roleCoverage(goal.id, draft) } : covs[0] ?? null;

  return (
    <>
      <Nav />

      <div className="wizwrap">
        <div className="wizsteps">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={`ws${i < step ? " done" : ""}${i === step ? " on" : ""}`} />
          ))}
        </div>

        {/* STEP 1: สาขา */}
        {step === 1 && (
          <section>
            <div className="wizhead">
              <span className="eyebrow">ขั้นตอน 1 จาก 4</span>
              <h2>คุณเรียนสาขาอะไร</h2>
              <p>
                ตอนนี้มี {readyMajors.length} สาขาที่ข้อมูลรายวิชาและทักษะพร้อมใช้งานจริง
                ส่วนอีก {pendingMajors.length} หลักสูตรของ มธ. นำเข้าจากทะเบียนหลักสูตรของ data.go.th แล้ว
                แต่ยังไม่ได้สกัดทักษะจากเอกสารหลักสูตร จึงยังเลือกไม่ได้
              </p>
            </div>

            <div className="choicegrid">
              {readyMajors.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="choice"
                  aria-pressed={m.id === draft.major}
                  onClick={() => setDraft((d) => (d.major === m.id ? d : { ...d, major: m.id, overrides: {} }))}
                >
                  <span className="cname">{m.name}</span>
                  <span className="cnote">
                    {schoolLabel(m.id)}
                    {m.note ? ` — ${m.note}` : ""}
                  </span>
                </button>
              ))}
            </div>

            <button className="advtoggle" type="button" onClick={() => setShowPending((v) => !v)}>
              {showPending
                ? "ซ่อนหลักสูตรที่ยังไม่พร้อม ▴"
                : `ดูอีก ${pendingMajors.length} หลักสูตรของ มธ. ที่ยังไม่พร้อมใช้งาน ▾`}
            </button>

            {showPending ? (
              <div className="courselist">
                <p className="cnote" style={{ padding: "0 0 10px", color: "var(--muted)", fontSize: 12.5 }}>
                  รายชื่อจากทะเบียนหลักสูตรอุดมศึกษา (data.go.th · univ_cur_11_01.csv) — แสดงตามที่บันทึกไว้จริง
                  ยังไม่มีข้อมูลคณะและทักษะ เพราะชุดข้อมูลไม่ได้ให้มา
                </p>
                {Object.entries(pendingByField).map(([field, list]) => (
                  <div className="termgroup" key={field}>
                    <div className="termgrouphead">
                      {field} · {list.length} หลักสูตร
                    </div>
                    {list.map((m) => (
                      <div className="courserow" key={m.id}>
                        <label style={{ opacity: 0.75 }}>
                          {m.name}
                          {m.curriculumId ? <span className="cs">รหัสหลักสูตร {m.curriculumId}</span> : null}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
            <div className="wizfoot">
              <span />
              <button className="cta" type="button" disabled={!draft.major} onClick={() => goTo(2)}>
                ถัดไป →
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: เป้าหมายอาชีพ */}
        {step === 2 && (
          <section>
            <div className="wizhead">
              <span className="eyebrow">ขั้นตอน 2 จาก 4</span>
              <h2>อยากทำงานอะไร</h2>
              <p>
                นักศึกษาหลายคนรู้เป้าหมายอยู่แล้ว แค่บอกไม่ถูกว่าวิชาที่เรียนตรงกับเป้าหมายนั้นไหม — เลือกไว้ได้ถ้ามีเป้าหมายในใจ
                หรือข้ามไปสำรวจดูก่อนก็ได้
              </p>
            </div>
            <div className="choicegrid">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="choice"
                  aria-pressed={draft.goalRole === r.id}
                  onClick={() => setDraft((d) => ({ ...d, goalRole: r.id }))}
                >
                  <span className="cname">{r.name}</span>
                  <span className="cnote">
                    <span className="mono">{r.posts.toLocaleString()}</span> ประกาศงาน ·{" "}
                    <span className="mono">{r.jrPosts}</span> ระดับ junior
                  </span>
                </button>
              ))}
              <button
                type="button"
                className="choice"
                aria-pressed={!draft.goalRole}
                onClick={() => setDraft((d) => ({ ...d, goalRole: null }))}
              >
                <span className="cname">ยังไม่แน่ใจ</span>
                <span className="cnote">สำรวจดูก่อน — ให้ระบบจัดอันดับอาชีพตามความครอบคลุมของคุณ</span>
              </button>
            </div>
            <div className="wizfoot">
              <button className="back" type="button" onClick={() => goTo(1)}>
                ← ย้อนกลับ
              </button>
              <button className="cta" type="button" onClick={() => goTo(3)}>
                ถัดไป →
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: ปี/เทอม */}
        {step === 3 && (
          <section>
            <div className="wizhead">
              <span className="eyebrow">ขั้นตอน 3 จาก 4</span>
              <h2>ตอนนี้คุณอยู่ปีไหน เทอมไหน</h2>
              <p>
                SkillPath จะถือว่าวิชาก่อนหน้าตำแหน่งนี้ &quot;เรียนจบแล้ว&quot; และวิชาในเทอมนี้ &quot;กำลังเรียน&quot;
                โดยอัตโนมัติ — ปรับละเอียดเป็นรายวิชาได้ด้านล่าง ถ้าเรียนไม่ตรงลำดับ
              </p>
            </div>
            <div className="termgrid">
              {TERMS.map((t) => (
                <button
                  key={t.ord}
                  type="button"
                  className="termcell"
                  aria-pressed={t.ord === draft.ord}
                  onClick={() => setDraft((d) => ({ ...d, ord: t.ord }))}
                >
                  <span className="ty">{t.y}</span>
                  <span className="tt">{t.t}</span>
                </button>
              ))}
            </div>

            <button className="advtoggle" type="button" onClick={() => setAdvOpen((o) => !o)}>
              {advOpen ? "ซ่อนรายวิชา ▴" : "ปรับแต่งรายวิชาที่เรียนแล้วเอง (ละเอียด) ▾"}
            </button>
            <div className={`courselist${advOpen ? "" : " hidden"}`}>
              {TERMS.filter((t) => byOrd[t.ord]).map((t) => (
                <div className="termgroup" key={t.ord}>
                  <div className="termgrouphead">
                    {t.y} · {t.t}
                    {t.ord === draft.ord ? " — เทอมปัจจุบันของคุณ" : ""}
                  </div>
                  {byOrd[t.ord].map(([code, c]) => {
                    const skills = skillsForCourse(draft.major, code);
                    const checked =
                      typeof draft.overrides[code] === "boolean" ? draft.overrides[code] : c.ord < draft.ord;
                    return (
                      <div className="courserow" key={code}>
                        <input
                          type="checkbox"
                          id={`c-${code}`}
                          checked={checked}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setDraft((d) => ({ ...d, overrides: { ...d.overrides, [code]: val } }));
                          }}
                        />
                        <label htmlFor={`c-${code}`}>
                          <span className="cc">{code}</span>
                          {c.name}
                          {skills.length ? <span className="cs">เกี่ยวข้องกับ: {skills.join(" · ")}</span> : null}
                        </label>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="wizfoot">
              <button className="back" type="button" onClick={() => goTo(2)}>
                ← ย้อนกลับ
              </button>
              <button className="cta" type="button" onClick={() => goTo(4)}>
                ถัดไป →
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: ยืนยัน */}
        {step === 4 && (
          <section>
            <div className="wizhead">
              <span className="eyebrow">ขั้นตอน 4 จาก 4</span>
              <h2>สรุปโปรไฟล์ของคุณ</h2>
              <p>ตรวจสอบก่อนบันทึก — แก้ไขได้ทุกเมื่อจากเมนู &quot;แก้ไขโปรไฟล์&quot; ด้านบนของทุกหน้า</p>
            </div>
            {summaryMajor && summaryTerm && headline && (
              <div>
                <div className="scopetable">
                  <div className="scoperow">
                    <div className="sc-lbl">สาขา</div>
                    <div className="sc-val">
                      <b>{summaryMajor.name}</b>
                      <br />
                      {schoolLabel(summaryMajor.id)}
                    </div>
                  </div>
                  <div className="scoperow">
                    <div className="sc-lbl">เป้าหมายอาชีพ</div>
                    <div className="sc-val">{goal ? <b>{goal.name}</b> : "ยังไม่แน่ใจ — สำรวจดูก่อน"}</div>
                  </div>
                  <div className="scoperow">
                    <div className="sc-lbl">ตำแหน่งปัจจุบัน</div>
                    <div className="sc-val">
                      <b>
                        {summaryTerm.y} · {summaryTerm.t}
                      </b>
                    </div>
                  </div>
                  <div className="scoperow">
                    <div className="sc-lbl">ปรับเอง</div>
                    <div className="sc-val">
                      {overrideCount ? `ปรับ ${overrideCount} รายวิชาจากค่าเริ่มต้น` : "ใช้ค่าเริ่มต้นตามปี/เทอมทั้งหมด"}
                    </div>
                  </div>
                </div>
                <div className="trustband" style={{ marginTop: 20 }}>
                  <div className="tb-txt">
                    <h3>{goal ? "เป้าหมายของคุณตอนนี้" : "ตำแหน่งที่ใกล้เคียงคุณที่สุดตอนนี้"}</h3>
                    <p>
                      <b style={{ color: "#fff" }}>{headline.r.name}</b> — ความครอบคลุมของคุณ{" "}
                      {headline.cov === null ? (
                        "ยังประเมินไม่ได้ (ข้อมูลน้อยกว่าเกณฑ์)"
                      ) : (
                        <b className="mono" style={{ color: "#fff" }}>
                          {headline.cov}%
                        </b>
                      )}{" "}
                      จากรายวิชาที่เรียนจบและกำลังเรียน คำนวณจากประกาศงานระดับ junior จริง {headline.r.jrPosts} รายการ
                    </p>
                  </div>
                  <Link className="cta" href={`/explore?role=${headline.r.id}`}>
                    ดูเส้นทางเต็ม →
                  </Link>
                </div>
              </div>
            )}
            <div className="wizfoot">
              <button className="back" type="button" onClick={() => goTo(3)}>
                ← ย้อนกลับ
              </button>
              <button className="cta" type="button" onClick={handleSave}>
                บันทึกและเริ่มใช้งาน →
              </button>
            </div>
          </section>
        )}
      </div>

      <div className={`savedtoast${showToast ? " show" : ""}`}>บันทึกโปรไฟล์แล้ว</div>
    </>
  );
}
