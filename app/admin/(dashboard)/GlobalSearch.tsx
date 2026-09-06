"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   ค้นหารวมทุกประเภทข้อมูลจากหน้าภาพรวม

   เดิมถ้าจะแก้อะไรสักอย่างต้องรู้ก่อนว่ามันอยู่แท็บไหน แล้วค่อยเลื่อนหา
   ในตารางยาว ๆ ที่นี่พิมพ์คำเดียวแล้วกดไปหน้าที่แก้ได้เลย
   ============================================================ */

export type SearchEntry = {
  /* ป้ายประเภทที่แสดงบนผลลัพธ์ เช่น "สาขา" "รายวิชา" */
  type: string;
  label: string;
  sub?: string;
  href: string;
  text: string;
};

const LIMIT = 40;

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function GlobalSearch({ entries }: { entries: SearchEntry[] }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo(() => {
    const terms = normalize(q).split(" ").filter(Boolean);
    if (!terms.length) return [];
    return entries.filter((e) => {
      const hay = normalize(e.text);
      return terms.every((t) => hay.includes(t));
    });
  }, [q, entries]);

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

  const shown = hits.slice(0, LIMIT);

  return (
    <div className="admin-globalsearch">
      <div className="admin-searchbar">
        <input
          ref={inputRef}
          type="search"
          className="admin-searchinput"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาทุกอย่าง — มหาวิทยาลัย คณะ สาขา รายวิชา ทักษะ อาชีพ สกิลกลาง…"
          aria-label="ค้นหาทุกประเภทข้อมูล"
        />
        <span className="admin-searchcount">
          {q ? (
            <>
              พบ <b>{hits.length}</b> รายการ
            </>
          ) : (
            <>
              ค้นได้ {entries.length} รายการ · กด <kbd>/</kbd> เพื่อค้นหา
            </>
          )}
        </span>
        {q ? (
          <button type="button" className="admin-btn" onClick={() => setQ("")}>
            ล้าง
          </button>
        ) : null}
      </div>

      {q ? (
        <div className="admin-panel">
          {!shown.length ? (
            <div className="admin-empty">ไม่พบรายการที่ตรงกับ “{q}”</div>
          ) : (
            <ul className="admin-results">
              {shown.map((e) => (
                <li key={`${e.type}:${e.href}:${e.label}`}>
                  <Link href={e.href}>
                    <span className="admin-resulttype">{e.type}</span>
                    <span className="admin-resultmain">
                      <b>{e.label}</b>
                      {e.sub ? <span className="admin-resultsub">{e.sub}</span> : null}
                    </span>
                    <span className="admin-resultgo" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
              {hits.length > shown.length ? (
                <li className="admin-resultmore">
                  แสดง {shown.length} รายการแรกจาก {hits.length} — พิมพ์คำเพิ่มเพื่อให้แคบลง
                </li>
              ) : null}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
