"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertSkill } from "@/lib/actions/admin";

type Course = { code: string; name: string };
type Skill = {
  key: string;
  code: string | null;
  note: string;
  alias: string | null;
  src: string | null;
  hidden: boolean;
  early_in_term: boolean;
  partial: boolean;
  kind: string | null;
  proof: string | null;
  act: string | null;
  time_estimate: string | null;
  route: string | null;
};

export default function SkillForm({ courses, skill }: { courses: Course[]; skill?: Skill }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = !!skill;

  async function action(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await upsertSkill(formData);
      router.push("/admin/skills");
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
            <label htmlFor="key">ชื่อทักษะ (คีย์ — เปลี่ยนไม่ได้หลังสร้าง)</label>
            <input id="key" name="key" defaultValue={skill?.key} required disabled={isEdit} />
          </div>

          <div className="admin-field">
            <label htmlFor="code">รหัสวิชาที่สอนทักษะนี้ (ไม่บังคับ)</label>
            <select id="code" name="code" defaultValue={skill?.code || ""}>
              <option value="">— ไม่มี —</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="kind">ประเภท ถ้าไม่มีวิชาสอน</label>
            <select id="kind" name="kind" defaultValue={skill?.kind || ""}>
              <option value="">— มีวิชาสอน (ปกติ) —</option>
              <option value="course">course — ไม่มีวิชาไหนสอนเลย</option>
              <option value="work">work — ได้จากการทำงานจริงเท่านั้น</option>
            </select>
          </div>

          <div className="admin-field span2">
            <label htmlFor="note">หมายเหตุ (แสดงในตารางทักษะ)</label>
            <input id="note" name="note" defaultValue={skill?.note} required />
          </div>

          <div className="admin-field span2">
            <label htmlFor="alias">เอกสารหลักสูตรเขียนคนละคำ (ถ้ามี)</label>
            <textarea id="alias" name="alias" defaultValue={skill?.alias || ""} />
          </div>

          <div className="admin-field span2">
            <label htmlFor="src">ที่มา / อ้างอิงหน้าเอกสาร</label>
            <input id="src" name="src" defaultValue={skill?.src || ""} />
          </div>

          <div className="admin-field span2">
            <label htmlFor="proof">หลักฐานว่าตลาดต้องการ (สำหรับทักษะที่ไม่มีวิชาสอน)</label>
            <textarea id="proof" name="proof" defaultValue={skill?.proof || ""} />
          </div>

          <div className="admin-field">
            <label htmlFor="act">สิ่งที่ควรทำเอง</label>
            <input id="act" name="act" defaultValue={skill?.act || ""} />
          </div>
          <div className="admin-field">
            <label htmlFor="time_estimate">ใช้เวลาประมาณ</label>
            <input id="time_estimate" name="time_estimate" defaultValue={skill?.time_estimate || ""} />
          </div>

          <div className="admin-field span2">
            <label htmlFor="route">เส้นทางจริง (สำหรับทักษะที่ต้องได้จากงานจริง)</label>
            <input id="route" name="route" defaultValue={skill?.route || ""} />
          </div>

          <div className="span2">
            <div className="admin-checkrow">
              <input type="checkbox" id="hidden" name="hidden" defaultChecked={skill?.hidden} />
              <label htmlFor="hidden" style={{ margin: 0 }}>
                hidden — เรียนแล้วแต่เอกสารใช้คำอื่น (ค้นด้วยคำตลาดไม่เจอเลย)
              </label>
            </div>
            <div className="admin-checkrow">
              <input type="checkbox" id="early_in_term" name="early_in_term" defaultChecked={skill?.early_in_term} />
              <label htmlFor="early_in_term" style={{ margin: 0 }}>
                early_in_term — นับว่าได้แล้วตั้งแต่เทอมที่ยังเรียนวิชานี้อยู่
              </label>
            </div>
            <div className="admin-checkrow">
              <input type="checkbox" id="partial" name="partial" defaultChecked={skill?.partial} />
              <label htmlFor="partial" style={{ margin: 0 }}>
                partial — วิชาครอบคลุมทักษะนี้แค่บางส่วน
              </label>
            </div>
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
