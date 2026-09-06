"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import { COURSES_BY_MAJOR, MAJORS, MIN_POSTS, ROLES, TERMS, schoolLabel, skillsForCourse } from "@/lib/data";
import {
  CUSTOM_MAJOR_ID,
  CUSTOM_ROLE_ID,
  DEFAULT_PROFILE,
  coverageRevealHeadline,
  loadProfile,
  roleCoverage,
  saveProfile,
} from "@/lib/profile";
import { getClientId } from "@/lib/client-id";
import { submitMajorRequest, submitRoleRequest } from "@/lib/actions/requests";
import type { Course, CustomMajor, Profile } from "@/lib/types";

const EMPTY_CUSTOM: CustomMajor = { university: "", faculty: "", program: "", major: "" };

export default function OnboardingPage() {
  const router = useRouter();

  /* ---------- draft state (ยังไม่บันทึกจนกว่าจะกด "บันทึกและเริ่มใช้งาน") ---------- */
  const [draft, setDraft] = useState<Profile>({ ...DEFAULT_PROFILE });
  const [step, setStep] = useState(1);
  const [advOpen, setAdvOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showCustomMajor, setShowCustomMajor] = useState(false);
  const [customMajor, setCustomMajor] = useState<CustomMajor>({ ...EMPTY_CUSTOM });
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [customRole, setCustomRole] = useState("");

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
        customMajor: existing.customMajor,
        customRole: existing.customRole,
      });
      if (existing.customMajor) setCustomMajor(existing.customMajor);
      if (existing.customRole) setCustomRole(existing.customRole);
      if (existing.major === CUSTOM_MAJOR_ID) setShowCustomMajor(true);
      if (existing.goalRole === CUSTOM_ROLE_ID) setShowCustomRole(true);
    }
  }, []);

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleSave() {
    saveProfile(draft);

    /* ส่งคำขอขึ้นฐานข้อมูลแบบ best-effort — ถ้าเน็ตหลุดหรือ DB ล่ม
       โปรไฟล์ในเครื่องบันทึกไปแล้ว ผู้ใช้จึงไม่ติดค้าง */
    const clientId = getClientId();
    if (draft.major === CUSTOM_MAJOR_ID && draft.customMajor) {
      submitMajorRequest(draft.customMajor, clientId).then(
        () => {},
        () => {}
      );
    }
    if (draft.goalRole === CUSTOM_ROLE_ID && draft.customRole) {
      submitRoleRequest(draft.customRole, clientId).then(
        () => {},
        () => {}
      );
    }

    setShowToast(true);
    setTimeout(() => {
      router.push("/explore");
    }, 700);
  }

  /* ---------- สาขา/อาชีพที่พิมพ์เอง ---------- */
  const customMajorFilled = Boolean(
    customMajor.university.trim() || customMajor.faculty.trim() || customMajor.program.trim() || customMajor.major.trim()
  );

  function applyCustomMajor(next: CustomMajor) {
    setCustomMajor(next);
    const filled = Boolean(
      next.university.trim() || next.faculty.trim() || next.program.trim() || next.major.trim()
    );
    setDraft((d) => ({
      ...d,
      major: filled ? CUSTOM_MAJOR_ID : d.major === CUSTOM_MAJOR_ID ? "" : d.major,
      customMajor: filled ? next : undefined,
      overrides: {},
    }));
  }

  function applyCustomRole(value: string) {
    setCustomRole(value);
    const filled = Boolean(value.trim());
    setDraft((d) => ({
      ...d,
      goalRole: filled ? CUSTOM_ROLE_ID : d.goalRole === CUSTOM_ROLE_ID ? null : d.goalRole,
      customRole: filled ? value : undefined,
    }));
  }

  /* ---------- step 3: courses grouped by term ord (ตามสาขาที่เลือก) ---------- */
  const majorCourses = COURSES_BY_MAJOR[draft.major] || {};
  const byOrd: Record<number, [string, Course][]> = {};
  Object.entries(majorCourses).forEach(([code, c]) => {
    (byOrd[c.ord] = byOrd[c.ord] || []).push([code, c]);
  });

  /* ---------- step 4: summary ---------- */
  const isCustom = draft.major === CUSTOM_MAJOR_ID;
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
                  onClick={() => {
                    // เลิกใช้สาขาที่กรอกเอง (ถ้ามี) — ไม่งั้นฟอร์มจะค้างแสดงข้อมูลเก่า
                    // ทั้งที่ระบบเปลี่ยนไปใช้สาขาสำเร็จรูปนี้แล้ว
                    setShowCustomMajor(false);
                    setCustomMajor({ ...EMPTY_CUSTOM });
                    setDraft((d) =>
                      d.major === m.id ? d : { ...d, major: m.id, overrides: {}, customMajor: undefined }
                    );
                  }}
                >
                  <span className="cname">{m.name}</span>
                  <span className="cnote">
                    {schoolLabel(m.id)}
                    {m.note ? ` — ${m.note}` : ""}
                  </span>
                </button>
              ))}

              <button
                type="button"
                className="choice"
                aria-pressed={draft.major === CUSTOM_MAJOR_ID}
                onClick={() => {
                  // ทำเครื่องหมายว่าเลือกอันนี้อยู่ทันทีที่กด ไม่ต้องรอให้พิมพ์ก่อน
                  // ไม่งั้นสาขาสำเร็จรูปที่เลือกไว้ก่อนหน้าจะยังไฮไลต์ค้าง ดูไม่ออกว่าใช้อันไหนอยู่
                  setShowCustomMajor(true);
                  setDraft((d) => ({
                    ...d,
                    major: CUSTOM_MAJOR_ID,
                    overrides: {},
                    customMajor: customMajorFilled ? customMajor : undefined,
                  }));
                }}
              >
                <span className="cname">ไม่มีสาขาของฉัน — กรอกเอง</span>
                <span className="cnote">
                  พิมพ์มหาวิทยาลัย คณะ หลักสูตร และสาขาของคุณเองได้ เราจะเก็บไว้เพื่อจัดลำดับว่าจะทำสาขาไหนต่อ
                </span>
              </button>
            </div>

            {showCustomMajor ? (
              <div className="customform">
                <div className="customform-head">
                  <b>กรอกสาขาของคุณเอง</b>
                  <span>
                    กรอกเท่าที่รู้ก็ได้ ไม่ต้องครบทุกช่อง — ระบบยังคำนวณความครอบคลุมให้ไม่ได้
                    เพราะยังไม่มีข้อมูลรายวิชาของหลักสูตรนี้ แต่จะเก็บคำขอไว้ให้ทีมเห็น
                  </span>
                </div>
                <div className="customform-grid">
                  <div className="customfield">
                    <label htmlFor="cm-univ">มหาวิทยาลัย</label>
                    <input
                      id="cm-univ"
                      value={customMajor.university}
                      placeholder="เช่น มหาวิทยาลัยธรรมศาสตร์"
                      onChange={(e) => applyCustomMajor({ ...customMajor, university: e.target.value })}
                    />
                  </div>
                  <div className="customfield">
                    <label htmlFor="cm-fac">คณะ</label>
                    <input
                      id="cm-fac"
                      value={customMajor.faculty}
                      placeholder="เช่น คณะวิทยาศาสตร์และเทคโนโลยี"
                      onChange={(e) => applyCustomMajor({ ...customMajor, faculty: e.target.value })}
                    />
                  </div>
                  <div className="customfield">
                    <label htmlFor="cm-prog">หลักสูตร</label>
                    <input
                      id="cm-prog"
                      value={customMajor.program}
                      placeholder="เช่น วิทยาศาสตรบัณฑิต"
                      onChange={(e) => applyCustomMajor({ ...customMajor, program: e.target.value })}
                    />
                  </div>
                  <div className="customfield">
                    <label htmlFor="cm-major">สาขา</label>
                    <input
                      id="cm-major"
                      value={customMajor.major}
                      placeholder="เช่น เทคโนโลยีชีวภาพ"
                      onChange={(e) => applyCustomMajor({ ...customMajor, major: e.target.value })}
                    />
                  </div>
                </div>
                {customMajorFilled ? (
                  <p className="customform-note">
                    จะบันทึกเป็นสาขาของคุณเมื่อกด &quot;บันทึกและเริ่มใช้งาน&quot; ในขั้นตอนสุดท้าย
                  </p>
                ) : null}
              </div>
            ) : null}

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
              {isCustom && !customMajorFilled ? (
                <span className="wizhint">กรอกอย่างน้อย 1 ช่องด้านบน หรือเลือกสาขาจากรายการ</span>
              ) : (
                <span />
              )}
              <button
                className="cta"
                type="button"
                disabled={!draft.major || (isCustom && !customMajorFilled)}
                onClick={() => goTo(2)}
              >
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
                  onClick={() => {
                    // เลิกใช้อาชีพที่พิมพ์เอง (ถ้ามี) — เหตุผลเดียวกับฝั่งสาขา
                    setShowCustomRole(false);
                    setCustomRole("");
                    setDraft((d) => ({ ...d, goalRole: r.id, customRole: undefined }));
                  }}
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
                aria-pressed={draft.goalRole === CUSTOM_ROLE_ID}
                onClick={() => {
                  setShowCustomRole(true);
                  setDraft((d) => ({
                    ...d,
                    goalRole: CUSTOM_ROLE_ID,
                    customRole: customRole.trim() ? customRole : undefined,
                  }));
                }}
              >
                <span className="cname">อาชีพอื่น — พิมพ์เอง</span>
                <span className="cnote">
                  ไม่มีอาชีพที่คุณอยากทำในรายการ? พิมพ์ได้เลย เราเก็บไว้เพื่อดูว่าควรเพิ่มอาชีพไหนต่อ
                </span>
              </button>

              <button
                type="button"
                className="choice"
                aria-pressed={!draft.goalRole}
                onClick={() => {
                  setShowCustomRole(false);
                  setCustomRole("");
                  setDraft((d) => ({ ...d, goalRole: null, customRole: undefined }));
                }}
              >
                <span className="cname">ยังไม่แน่ใจ</span>
                <span className="cnote">สำรวจดูก่อน — ให้ระบบจัดอันดับอาชีพตามความครอบคลุมของคุณ</span>
              </button>
            </div>

            {showCustomRole ? (
              <div className="customform">
                <div className="customform-head">
                  <b>พิมพ์อาชีพที่คุณอยากทำ</b>
                  <span>
                    ระบบยังไม่มีข้อมูลประกาศงานของอาชีพนี้ จึงยังคำนวณความครอบคลุมให้ไม่ได้
                    แต่จะเก็บไว้เป็นข้อมูลว่ามีคนต้องการ
                  </span>
                </div>
                <div className="customform-grid">
                  <div className="customfield span2">
                    <label htmlFor="cr-name">ชื่ออาชีพ</label>
                    <input
                      id="cr-name"
                      value={customRole}
                      placeholder="เช่น นักคณิตศาสตร์ประกันภัย (Actuary)"
                      onChange={(e) => applyCustomRole(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="wizfoot">
              <button className="back" type="button" onClick={() => goTo(1)}>
                ← ย้อนกลับ
              </button>
              <button
                className="cta"
                type="button"
                onClick={() => {
                  // เลือก "พิมพ์เอง" ไว้แต่ไม่ได้พิมพ์ = ถือว่ายังไม่แน่ใจ (อาชีพไม่บังคับ)
                  if (draft.goalRole === CUSTOM_ROLE_ID && !customRole.trim()) {
                    setShowCustomRole(false);
                    setDraft((d) => ({ ...d, goalRole: null, customRole: undefined }));
                  }
                  goTo(3);
                }}
              >
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

            {isCustom ? (
              <p className="customform-note" style={{ marginTop: 18 }}>
                สาขาที่คุณกรอกเองยังไม่มีข้อมูลรายวิชาในระบบ จึงปรับรายวิชาไม่ได้ —
                ปี/เทอมที่เลือกไว้จะถูกบันทึกไว้ใช้เมื่อข้อมูลหลักสูตรของคุณพร้อม
              </p>
            ) : (
              <>
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
              </>
            )}

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
            {summaryTerm && (
              <div>
                <div className="scopetable">
                  <div className="scoperow">
                    <div className="sc-lbl">สาขา</div>
                    <div className="sc-val">
                      {isCustom && draft.customMajor ? (
                        <>
                          <b>{draft.customMajor.major || draft.customMajor.program || "สาขาที่กรอกเอง"}</b>
                          <br />
                          {[draft.customMajor.faculty, draft.customMajor.university].filter(Boolean).join(" · ") ||
                            "ไม่ได้ระบุคณะ/มหาวิทยาลัย"}
                          <br />
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>
                            คุณกรอกเอง — ยังไม่มีข้อมูลรายวิชาของหลักสูตรนี้ในระบบ
                          </span>
                        </>
                      ) : summaryMajor ? (
                        <>
                          <b>{summaryMajor.name}</b>
                          <br />
                          {schoolLabel(summaryMajor.id)}
                        </>
                      ) : (
                        "ยังไม่ได้เลือกสาขา"
                      )}
                    </div>
                  </div>
                  <div className="scoperow">
                    <div className="sc-lbl">เป้าหมายอาชีพ</div>
                    <div className="sc-val">
                      {draft.goalRole === CUSTOM_ROLE_ID && draft.customRole ? (
                        <>
                          <b>{draft.customRole}</b>
                          <br />
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>
                            คุณกรอกเอง — ยังไม่มีข้อมูลประกาศงานของอาชีพนี้
                          </span>
                        </>
                      ) : goal ? (
                        <b>{goal.name}</b>
                      ) : (
                        "ยังไม่แน่ใจ — สำรวจดูก่อน"
                      )}
                    </div>
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
                {isCustom ? (
                  <div className="trustband" style={{ marginTop: 20 }}>
                    <div className="tb-txt">
                      <h3>ยังคำนวณความครอบคลุมให้คุณไม่ได้</h3>
                      <p>
                        เพราะยังไม่มีข้อมูลรายวิชาและทักษะของหลักสูตรที่คุณกรอก —
                        เราจะเก็บคำขอนี้ไว้เพื่อจัดลำดับว่าจะสกัดข้อมูลหลักสูตรไหนต่อ
                        ระหว่างนี้ดูตัวอย่างเส้นทางจากสาขาที่มีข้อมูลจริงแล้วได้
                      </p>
                    </div>
                    <Link className="cta" href="/explore">
                      ดูตัวอย่างเส้นทาง →
                    </Link>
                  </div>
                ) : headline ? (
                  <div className="trustband" style={{ marginTop: 20 }}>
                    <div className="tb-txt">
                      <h3>
                        {headline.cov !== null
                          ? coverageRevealHeadline(headline.cov, headline.r.name)
                          : goal
                          ? "เป้าหมายของคุณตอนนี้"
                          : "ตำแหน่งที่ใกล้เคียงคุณที่สุดตอนนี้"}
                      </h3>
                      <p>
                        {headline.cov === null ? (
                          <>
                            ยังประเมินความครอบคลุมของ <b style={{ color: "#fff" }}>{headline.r.name}</b> ไม่ได้
                            (ข้อมูลน้อยกว่าเกณฑ์)
                          </>
                        ) : (
                          <>
                            คำนวณจากรายวิชาที่เรียนจบและกำลังเรียน เทียบกับประกาศงานระดับ junior จริง{" "}
                            {headline.r.jrPosts} รายการ
                          </>
                        )}
                      </p>
                    </div>
                    <Link className="cta" href={`/explore?role=${headline.r.id}`}>
                      ดูเส้นทางเต็ม →
                    </Link>
                  </div>
                ) : null}
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
