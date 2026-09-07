"use client";

/* ============================================================
   ค้นหาหลักสูตร — ใช้ในขั้นตอนที่ 1 ของการตั้งโปรไฟล์

   เดิมหลักสูตรที่ยังไม่พร้อมใช้งาน 162 รายการถูกซ่อนอยู่ใต้ปุ่ม "ดูอีก…"
   แล้วเรียงยาวเป็นกลุ่มตามสายวิชา ผู้ใช้ต้องกวาดตาหาเอง ที่นี่พิมพ์ชื่อ
   หรือกรองด้วยมหาวิทยาลัย/คณะ/สายวิชาแทน

   กรองฝั่งเบราว์เซอร์ทั้งหมด เพราะรายการหลักสูตรถูกส่งมาพร้อมหน้าอยู่แล้ว
   ============================================================ */

import { useMemo, useState } from "react";
import { FACULTIES, UNIVERSITIES, facultyLabel, schoolLabel, universityLabel } from "@/lib/data";
import type { Major } from "@/lib/types";

const NO_FACULTY = "__none__";
const SHOW_LIMIT = 60;

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

type Status = "all" | "ready" | "pending";

export default function MajorFinder({
  majors,
  selectedId,
  onSelect,
}: {
  majors: Major[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [uni, setUni] = useState("");
  const [fac, setFac] = useState("");
  const [field, setField] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [browseAll, setBrowseAll] = useState(false);

  /* ตัวเลือกในดรอปดาวน์สร้างจากข้อมูลจริงเท่านั้น — สายวิชาไหนไม่มีหลักสูตรก็ไม่ขึ้น */
  const fields = useMemo(
    () => [...new Set(majors.map((m) => m.iscedField).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, "th")),
    [majors]
  );
  const unis = useMemo(
    () => UNIVERSITIES.filter((u) => majors.some((m) => m.universityId === u.id)),
    [majors]
  );
  const facs = useMemo(
    () => FACULTIES.filter((f) => majors.some((m) => m.facultyId === f.id)),
    [majors]
  );
  const noFacultyCount = majors.filter((m) => !m.facultyId).length;

  const filterOn = !!(q || uni || fac || field || status !== "all");

  const hits = useMemo(() => {
    const terms = normalize(q).split(" ").filter(Boolean);
    return majors.filter((m) => {
      if (uni && m.universityId !== uni) return false;
      if (fac && (fac === NO_FACULTY ? !!m.facultyId : m.facultyId !== fac)) return false;
      if (field && m.iscedField !== field) return false;
      if (status === "ready" && !m.ready) return false;
      if (status === "pending" && m.ready) return false;
      if (!terms.length) return true;
      /* ไม่รวม m.note — เป็นหมายเหตุเชิงบรรณาธิการ (เช่น "ข้อมูลรายวิชาอ้างอิงเอกสารจริง")
         ถ้านับเป็นคำค้นด้วย หลักสูตรจะโผล่มาจากคำที่ไม่เกี่ยวกับตัวหลักสูตรเลย */
      const hay = normalize(
        [m.name, m.curriculumId, m.iscedField, m.level, schoolLabel(m.id)].filter(Boolean).join(" ")
      );
      return terms.every((t) => hay.includes(t));
    });
  }, [majors, q, uni, fac, field, status]);

  /* หลักสูตรที่เลือกได้จริงขึ้นก่อนเสมอ — ไม่งั้นผู้ใช้ต้องเลื่อนผ่านรายการที่กดไม่ได้ */
  const sorted = useMemo(
    () => [...hits].sort((a, b) => Number(b.ready) - Number(a.ready) || a.name.localeCompare(b.name, "th")),
    [hits]
  );
  const shown = sorted.slice(0, SHOW_LIMIT);
  const open = filterOn || browseAll;

  function reset() {
    setQ("");
    setUni("");
    setFac("");
    setField("");
    setStatus("all");
    setBrowseAll(false);
  }

  return (
    <div className="finder">
      <div className="finder-bar">
        <input
          type="search"
          className="finder-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`ค้นหาจากทั้งหมด ${majors.length} หลักสูตร — ชื่อหลักสูตร รหัสหลักสูตร หรือสายวิชา…`}
          aria-label="ค้นหาหลักสูตร"
        />
        {filterOn ? (
          <button type="button" className="finder-clear" onClick={reset}>
            ล้างตัวกรอง
          </button>
        ) : (
          <button type="button" className="finder-clear" onClick={() => setBrowseAll((v) => !v)}>
            {browseAll ? "ซ่อนรายการ ▴" : "ดูทั้งหมด ▾"}
          </button>
        )}
      </div>

      <div className="finder-filters">
        <label className="finder-sel">
          <span>มหาวิทยาลัย</span>
          <select value={uni} onChange={(e) => setUni(e.target.value)}>
            <option value="">ทุกมหาวิทยาลัย</option>
            {unis.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>

        <label className="finder-sel">
          <span>คณะ</span>
          <select value={fac} onChange={(e) => setFac(e.target.value)}>
            <option value="">ทุกคณะ</option>
            {facs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
            {noFacultyCount ? <option value={NO_FACULTY}>ยังไม่ระบุคณะ ({noFacultyCount})</option> : null}
          </select>
        </label>

        <label className="finder-sel">
          <span>สายวิชา</span>
          <select value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">ทุกสายวิชา</option>
            {fields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <div className="finder-chips" role="group" aria-label="สถานะข้อมูล">
          {(
            [
              ["all", "ทั้งหมด"],
              ["ready", "พร้อมใช้งาน"],
              ["pending", "ยังไม่พร้อม"],
            ] as [Status, string][]
          ).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={status === k} onClick={() => setStatus(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ความจริงของชุดข้อมูล ต้องบอกไว้ตรงจุดที่คนใช้ตัวกรอง ไม่ใช่ให้ไปเดาเอง */}
      <p className="finder-note">
        ทะเบียนหลักสูตรของ data.go.th ไม่มีคอลัมน์คณะ จึงมี {noFacultyCount} หลักสูตรที่ยังไม่ระบุคณะ —
        เราไม่เดาคณะจากชื่อหลักสูตร ส่วน &ldquo;สายวิชา&rdquo; คือกลุ่มสาขาตามมาตรฐาน ISCED ที่มากับชุดข้อมูล
      </p>

      {open ? (
        <>
          <div className="finder-count">
            พบ <b>{hits.length}</b> จาก {majors.length} หลักสูตร
            {hits.length > shown.length ? ` · แสดง ${shown.length} รายการแรก พิมพ์เพิ่มเพื่อให้แคบลง` : ""}
          </div>

          {!hits.length ? (
            <div className="finder-empty">
              ไม่พบหลักสูตรที่ตรงกับที่ค้น — ถ้าหลักสูตรของคุณยังไม่มีในระบบ เลือก
              &ldquo;ไม่มีสาขาของฉัน — กรอกเอง&rdquo; ด้านบนได้เลย เราจะเก็บไว้จัดลำดับว่าจะทำสาขาไหนต่อ
            </div>
          ) : (
            <ul className="finder-list">
              {shown.map((m) =>
                m.ready ? (
                  <li key={m.id}>
                    <button
                      type="button"
                      className="finder-row is-ready"
                      aria-pressed={m.id === selectedId}
                      onClick={() => onSelect(m.id)}
                    >
                      <span className="fr-main">
                        <b>{m.name}</b>
                        <span className="fr-sub">{schoolLabel(m.id)}</span>
                      </span>
                      <span className="fr-tag ok">พร้อมใช้งาน</span>
                    </button>
                  </li>
                ) : (
                  <li key={m.id}>
                    <div className="finder-row">
                      <span className="fr-main">
                        <b>{m.name}</b>
                        <span className="fr-sub">
                          {[
                            m.facultyId ? facultyLabel(m.facultyId) : null,
                            universityLabel(m.universityId),
                            m.iscedField,
                            m.curriculumId ? `รหัสหลักสูตร ${m.curriculumId}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span className="fr-tag">ยังไม่พร้อม</span>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}
