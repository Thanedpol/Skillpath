"use client";

/* ============================================================
   ค้นหาหลักสูตร — ใช้ทั้งหน้า /curriculum และขั้นตอนที่ 1 ของการตั้งโปรไฟล์

   หน้าที่เรียกใช้เป็นคนตัดสินว่าจะส่งหลักสูตรชุดไหนเข้ามา ตอนนี้ทั้งสองหน้า
   ส่งเฉพาะหลักสูตรที่ตรวจสอบข้อมูลรายวิชาและทักษะจากเอกสารจริงแล้วเท่านั้น
   คอมโพเนนต์นี้จึงถือว่าทุกแถวที่ได้รับมาเลือกได้ ไม่มีสถานะ "ยังไม่พร้อม"

   กรองฝั่งเบราว์เซอร์ทั้งหมด เพราะรายการถูกส่งมาพร้อมหน้าอยู่แล้ว
   ============================================================ */

import { useMemo, useState } from "react";
import { FACULTIES, UNIVERSITIES, schoolLabel } from "@/lib/data";
import type { Major } from "@/lib/types";

/* รายการสั้นกว่านี้ไม่มีเหตุผลต้องให้กดเปิด — แสดงเลย */
const AUTO_OPEN_UP_TO = 12;
const SHOW_LIMIT = 60;

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function MajorFinder({
  majors,
  selectedId,
  onSelect,
  title,
}: {
  majors: Major[];
  selectedId: string;
  onSelect: (id: string) => void;
  /* หัวข้อสั้น ๆ ของบล็อกนี้ — แต่ละหน้าเรียกใช้ด้วยจุดประสงค์ต่างกัน */
  title?: string;
}) {
  const [q, setQ] = useState("");
  const [uni, setUni] = useState("");
  const [fac, setFac] = useState("");
  const [field, setField] = useState("");
  const [browseAll, setBrowseAll] = useState(false);

  /* ตัวเลือกในดรอปดาวน์สร้างจากหลักสูตรที่แสดงอยู่จริงเท่านั้น
     ตัวไหนไม่มีข้อมูลให้เลือกเลยก็ไม่ต้องขึ้นมาเป็นช่องเปล่า */
  const fields = useMemo(
    () =>
      [...new Set(majors.map((m) => m.iscedField).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b, "th")
      ),
    [majors]
  );
  const unis = useMemo(() => UNIVERSITIES.filter((u) => majors.some((m) => m.universityId === u.id)), [majors]);
  const facs = useMemo(() => FACULTIES.filter((f) => majors.some((m) => m.facultyId === f.id)), [majors]);

  const filterOn = !!(q || uni || fac || field);

  const hits = useMemo(() => {
    const terms = normalize(q).split(" ").filter(Boolean);
    return majors.filter((m) => {
      if (uni && m.universityId !== uni) return false;
      if (fac && m.facultyId !== fac) return false;
      if (field && m.iscedField !== field) return false;
      if (!terms.length) return true;
      /* ไม่รวม m.note — เป็นหมายเหตุเชิงบรรณาธิการ (เช่น "ข้อมูลรายวิชาอ้างอิงเอกสารจริง")
         ถ้านับเป็นคำค้นด้วย หลักสูตรจะโผล่มาจากคำที่ไม่เกี่ยวกับตัวหลักสูตรเลย */
      const hay = normalize(
        [m.name, m.curriculumId, m.iscedField, m.level, schoolLabel(m.id)].filter(Boolean).join(" ")
      );
      return terms.every((t) => hay.includes(t));
    });
  }, [majors, q, uni, fac, field]);

  const sorted = useMemo(() => [...hits].sort((a, b) => a.name.localeCompare(b.name, "th")), [hits]);
  const shown = sorted.slice(0, SHOW_LIMIT);
  const alwaysOpen = majors.length <= AUTO_OPEN_UP_TO;
  const open = alwaysOpen || filterOn || browseAll;

  function reset() {
    setQ("");
    setUni("");
    setFac("");
    setField("");
    setBrowseAll(false);
  }

  return (
    <div className="finder">
      {title ? <div className="finder-title">{title}</div> : null}

      <div className="finder-bar">
        <input
          type="search"
          className="finder-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`ค้นหาจาก ${majors.length} หลักสูตร — ชื่อหลักสูตร รหัสหลักสูตร หรือสายวิชา…`}
          aria-label="ค้นหาหลักสูตร"
        />
        {filterOn ? (
          <button type="button" className="finder-clear" onClick={reset}>
            ล้างตัวกรอง
          </button>
        ) : alwaysOpen ? null : (
          <button type="button" className="finder-clear" onClick={() => setBrowseAll((v) => !v)}>
            {browseAll ? "ซ่อนรายการ ▴" : "ดูทั้งหมด ▾"}
          </button>
        )}
      </div>

      <div className="finder-filters">
        {unis.length ? (
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
        ) : null}

        {facs.length ? (
          <label className="finder-sel">
            <span>คณะ</span>
            <select value={fac} onChange={(e) => setFac(e.target.value)}>
              <option value="">ทุกคณะ</option>
              {facs.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {fields.length ? (
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
        ) : null}
      </div>

      {open ? (
        <>
          <div className="finder-count">
            พบ <b>{hits.length}</b> จาก {majors.length} หลักสูตร
            {hits.length > shown.length ? ` · แสดง ${shown.length} รายการแรก พิมพ์เพิ่มเพื่อให้แคบลง` : ""}
          </div>

          {!hits.length ? (
            <div className="finder-empty">
              ไม่พบหลักสูตรที่ตรงกับที่ค้น — ตอนนี้แสดงเฉพาะหลักสูตรที่ตรวจสอบข้อมูลรายวิชาและทักษะ
              จากเอกสารจริงแล้วเท่านั้น หลักสูตรอื่นกำลังทยอยเพิ่ม
            </div>
          ) : (
            <ul className="finder-list">
              {shown.map((m) => (
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
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}
