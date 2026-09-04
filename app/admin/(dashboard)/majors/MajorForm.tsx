"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertMajor } from "@/lib/actions/admin";

type Major = {
  id: string;
  name: string;
  university_id: string;
  faculty_id: string | null;
  ready: boolean;
  note: string | null;
  curriculum_id: string | null;
  level: string | null;
  isced_field: string | null;
  source: string | null;
};
type FacultyOption = { id: string; label: string };
type UniversityOption = { id: string; name: string };

export default function MajorForm({
  faculties,
  universities,
  major,
}: {
  faculties: FacultyOption[];
  universities: UniversityOption[];
  major?: Major;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = !!major;

  async function action(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await upsertMajor(formData);
      router.push("/admin/majors");
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
            <label htmlFor="id">รหัสสาขา (คีย์ — เปลี่ยนไม่ได้หลังสร้าง)</label>
            <input id="id" name="id" defaultValue={major?.id} required disabled={isEdit} />
          </div>

          <div className="admin-field">
            <label htmlFor="name">ชื่อสาขา</label>
            <input id="name" name="name" defaultValue={major?.name} required />
          </div>

          <div className="admin-field">
            <label htmlFor="university_id">มหาวิทยาลัย</label>
            <select id="university_id" name="university_id" defaultValue={major?.university_id} required>
              {!major ? <option value="">— เลือกมหาวิทยาลัย —</option> : null}
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="faculty_id">คณะ (เว้นว่างได้ถ้ายังไม่ยืนยัน)</label>
            <select id="faculty_id" name="faculty_id" defaultValue={major?.faculty_id || ""}>
              <option value="">— ยังไม่ระบุคณะ —</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="curriculum_id">รหัสหลักสูตรทางการ (ไม่บังคับ)</label>
            <input id="curriculum_id" name="curriculum_id" defaultValue={major?.curriculum_id || ""} />
          </div>

          <div className="admin-field">
            <label htmlFor="level">ระดับ (เช่น &quot;ปริญญาตรี&quot;)</label>
            <input id="level" name="level" defaultValue={major?.level || ""} />
          </div>

          <div className="admin-field span2">
            <label htmlFor="isced_field">กลุ่มสาขา ISCED (ไม่บังคับ)</label>
            <input id="isced_field" name="isced_field" defaultValue={major?.isced_field || ""} />
          </div>

          <div className="admin-field span2">
            <label htmlFor="source">แหล่งที่มาของข้อมูล</label>
            <input id="source" name="source" defaultValue={major?.source || ""} placeholder="เช่น data.go.th · univ_cur_11_01.csv" />
          </div>

          <div className="admin-field span2">
            <label htmlFor="note">หมายเหตุ (ไม่บังคับ)</label>
            <textarea id="note" name="note" defaultValue={major?.note || ""} />
          </div>

          <div className="span2">
            <div className="admin-checkrow">
              <input type="checkbox" id="ready" name="ready" defaultChecked={major?.ready} />
              <label htmlFor="ready" style={{ margin: 0 }}>
                ready — ข้อมูลหลักสูตรพร้อมใช้งาน (ไม่ติ๊ก = แสดงเป็น &quot;เร็วๆ นี้&quot;)
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
