"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   ตารางที่ค้นหาได้ — ใช้ร่วมกันทุกหน้าในแอดมิน

   กรองฝั่งเบราว์เซอร์ล้วน เพราะทุกหน้าโหลดแถวมาครบอยู่แล้ว การกรองจึง
   เห็นผลทันทีทุกตัวอักษร ไม่ต้องรอเซิร์ฟเวอร์ และไม่ทำให้ URL เปลี่ยน

   หน้าที่เรียกใช้เป็นตัวกำหนดเองว่าแถวหนึ่ง "ค้นด้วยคำว่าอะไรได้บ้าง"
   ผ่านฟิลด์ text — จึงค้นจากข้อมูลที่ไม่ได้แสดงในตารางก็ได้ เช่น รหัส
   ============================================================ */

export type SearchableRow = {
  key: string;
  /* ข้อความทั้งหมดที่ใช้ค้นแถวนี้ รวมกันเป็นก้อนเดียว */
  text: string;
  node: React.ReactNode;
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function SearchableTable({
  placeholder,
  head,
  rows,
  colSpan,
  emptyLabel = "ยังไม่มีข้อมูล",
  unit = "รายการ",
}: {
  placeholder: string;
  head: React.ReactNode;
  rows: SearchableRow[];
  colSpan: number;
  emptyLabel?: string;
  unit?: string;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => {
    /* แยกคำด้วยช่องว่างแล้วต้องเจอครบทุกคำ — พิมพ์ "สถิติ 271" หาวิชาเจอ
       โดยไม่ต้องจำว่าคำไหนมาก่อน */
    const terms = normalize(q).split(" ").filter(Boolean);
    if (!terms.length) return rows;
    return rows.filter((r) => {
      const hay = normalize(r.text);
      return terms.every((t) => hay.includes(t));
    });
  }, [q, rows]);

  /* กด "/" ที่ไหนก็ได้เพื่อกระโดดมาช่องค้นหา · Esc เพื่อล้าง */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && el === inputRef.current) {
        setQ("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="admin-searchwrap">
      <div className="admin-searchbar">
        <input
          ref={inputRef}
          type="search"
          className="admin-searchinput"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <span className="admin-searchcount">
          {q ? (
            <>
              พบ <b>{shown.length}</b> จาก {rows.length} {unit}
            </>
          ) : (
            <>
              ทั้งหมด {rows.length} {unit} · กด <kbd>/</kbd> เพื่อค้นหา
            </>
          )}
        </span>
        {q ? (
          <button type="button" className="admin-btn" onClick={() => setQ("")}>
            ล้าง
          </button>
        ) : null}
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>{head}</thead>
          <tbody>
            {!shown.length ? (
              <tr>
                <td colSpan={colSpan} className="admin-empty">
                  {rows.length ? `ไม่พบ ${unit} ที่ตรงกับ “${q}”` : emptyLabel}
                </td>
              </tr>
            ) : (
              shown.map((r) => <Fragment key={r.key}>{r.node}</Fragment>)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
