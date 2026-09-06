"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertCanonicalSkill } from "@/lib/actions/admin";

type CanonicalSkill = {
  id: string;
  name: string;
  name_en: string | null;
  category: string | null;
  esco_id: string | null;
  note: string | null;
};

/* หมวดเป็นตัวเลือกช่วยจำ ไม่ได้บังคับ — พิมพ์หมวดใหม่เองได้ผ่าน datalist */
const CATEGORIES = ["ภาษาโปรแกรมและเครื่องมือ", "ข้อมูลและสถิติ", "ระบบและโครงสร้างพื้นฐาน", "ธุรกิจและการสื่อสาร", "ทฤษฎีและพื้นฐาน"];

export default function CanonicalSkillForm({ skill }: { skill?: CanonicalSkill }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = !!skill;

  async function action(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await upsertCanonicalSkill(formData);
      router.push("/admin/canonical-skills");
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
      setPending(false);
    }
  }

  return (
    <form action={action}>
      <div className="admin-panel">
        <div className="admin-formgrid">
          <div className="admin-field span2">
            <label htmlFor="id">รหัสสกิลกลาง (คีย์ — เปลี่ยนไม่ได้หลังสร้าง)</label>
            <input id="id" name="id" defaultValue={skill?.id} required disabled={isEdit} />
            <small>
              ใช้ชื่อทักษะที่ระบบใช้อยู่ให้ตรงตัวอักษร เช่น &quot;SQL&quot; — เพราะทักษะในหลักสูตรและ
              ความต้องการตลาดผูกเข้ารหัสนี้ด้วยชื่อเดียวกัน
            </small>
          </div>

          <div className="admin-field">
            <label htmlFor="name">ชื่อที่ใช้แสดง</label>
            <input id="name" name="name" defaultValue={skill?.name} required />
          </div>

          <div className="admin-field">
            <label htmlFor="name_en">ชื่อภาษาอังกฤษ (ถ้ามี)</label>
            <input id="name_en" name="name_en" defaultValue={skill?.name_en ?? ""} />
            <small>ไว้เทียบกับชุดมาตรฐานสากลภายหลัง — เว้นว่างได้ถ้ายังไม่แน่ใจ</small>
          </div>

          <div className="admin-field">
            <label htmlFor="category">หมวด</label>
            <input id="category" name="category" list="canonical-categories" defaultValue={skill?.category ?? ""} />
            <datalist id="canonical-categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="admin-field">
            <label htmlFor="esco_id">รหัส ESCO (ถ้าเทียบได้)</label>
            <input id="esco_id" name="esco_id" defaultValue={skill?.esco_id ?? ""} />
            <small>ใส่เฉพาะเมื่อตรวจกับ ESCO แล้วจริง ๆ ไม่ต้องเดา</small>
          </div>

          <div className="admin-field span2">
            <label htmlFor="note">หมายเหตุ / ที่มา</label>
            <textarea id="note" name="note" rows={3} defaultValue={skill?.note ?? ""} />
          </div>
        </div>

        {error ? (
          <div className="admin-error" style={{ margin: "0 20px 16px" }}>
            {error}
          </div>
        ) : null}

        <div className="admin-formfoot">
          <button type="submit" className="cta" disabled={pending}>
            {pending ? "กำลังบันทึก…" : "บันทึก"}
          </button>
        </div>
      </div>
    </form>
  );
}
