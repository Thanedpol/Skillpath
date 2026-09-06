"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { addSkillAlias, deleteSkillAlias } from "@/lib/actions/admin";

type AliasRow = {
  id: number;
  alias: string;
  source: "curriculum" | "jd" | "manual";
  lang: "th" | "en" | null;
  note: string | null;
};

const SOURCE_LABEL: Record<AliasRow["source"], string> = {
  curriculum: "เอกสารหลักสูตร",
  jd: "ประกาศงาน",
  manual: "ทีมใส่เอง",
};

export default function AliasManager({ canonicalId, aliases }: { canonicalId: string; aliases: AliasRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /* ล้างฟอร์มหลังบันทึกสำเร็จ — คนกรอกมักเพิ่มหลายคำติดกัน
     ถ้าค่าเดิมค้างอยู่จะเผลอบันทึกซ้ำหรือแก้ไม่หมด */
  const formRef = useRef<HTMLFormElement>(null);

  async function add(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await addSkillAlias(formData);
      formRef.current?.reset();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="admin-panel">
        <div className="admin-panel-head">
          <span>คำที่ใช้เรียกสกิลนี้</span>
          <span style={{ fontWeight: 400, fontSize: 12, color: "var(--muted)" }}>{aliases.length} คำ</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>คำ</th>
              <th>ที่มา</th>
              <th>ภาษา</th>
              <th>หมายเหตุ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!aliases.length ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  ยังไม่มีคำที่ใช้เรียก — เพิ่มคำจากเอกสารจริงได้ในแบบฟอร์มด้านล่าง
                </td>
              </tr>
            ) : (
              aliases.map((a) => (
                <tr key={a.id}>
                  <td>
                    <b>{a.alias}</b>
                  </td>
                  <td>{SOURCE_LABEL[a.source]}</td>
                  <td>{a.lang === "th" ? "ไทย" : a.lang === "en" ? "อังกฤษ" : "—"}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.note || "—"}</td>
                  <td>
                    <button
                      type="button"
                      className="admin-btn danger"
                      onClick={async () => {
                        if (confirm(`ลบคำว่า "${a.alias}" ใช่ไหม?`)) {
                          await deleteSkillAlias(a.id, canonicalId);
                          router.refresh();
                        }
                      }}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">เพิ่มคำที่ใช้เรียก</div>
        <form action={add} ref={formRef}>
          <input type="hidden" name="canonical_id" value={canonicalId} />
          <div className="admin-formgrid">
            <div className="admin-field span2">
              <label htmlFor="alias-text">คำที่พบ</label>
              <input id="alias-text" name="alias" required placeholder="เช่น ภาษาสอบถามเชิงโครงสร้าง" />
              <small>กรอกตามที่เอกสารเขียนจริง ไม่ต้องเรียบเรียงใหม่ — จุดประสงค์คือให้ค้นเจอตอนเทียบเอกสาร</small>
            </div>
            <div className="admin-field">
              <label htmlFor="alias-source">พบจากที่ไหน</label>
              <select id="alias-source" name="source" defaultValue="curriculum">
                <option value="curriculum">เอกสารหลักสูตร</option>
                <option value="jd">ประกาศงาน</option>
                <option value="manual">ทีมใส่เอง</option>
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="alias-lang">ภาษา</label>
              <select id="alias-lang" name="lang" defaultValue="">
                <option value="">ไม่ระบุ</option>
                <option value="th">ไทย</option>
                <option value="en">อังกฤษ</option>
              </select>
            </div>
            <div className="admin-field span2">
              <label htmlFor="alias-note">หมายเหตุ / อ้างอิงหน้าเอกสาร</label>
              <input id="alias-note" name="note" placeholder="เช่น มคอ.2 วท.บ. สถิติ 2565 หน้า 41" />
            </div>
          </div>
          {error ? (
            <div className="admin-error" style={{ margin: "0 20px 16px" }}>
              {error}
            </div>
          ) : null}
          <div className="admin-formfoot">
            <button type="submit" className="cta" disabled={pending}>
              {pending ? "กำลังบันทึก…" : "+ เพิ่มคำ"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
