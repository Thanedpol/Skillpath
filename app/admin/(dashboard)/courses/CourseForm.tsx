"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertCourse } from "@/lib/actions/admin";

type Course = { code: string; name: string; when_label: string; ord: number };

export default function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = !!course;

  async function action(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await upsertCourse(formData);
      router.push("/admin/courses");
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
            <label htmlFor="code">รหัสวิชา (คีย์ — เปลี่ยนไม่ได้หลังสร้าง)</label>
            <input id="code" name="code" defaultValue={course?.code} required disabled={isEdit} />
          </div>

          <div className="admin-field span2">
            <label htmlFor="name">ชื่อวิชา</label>
            <input id="name" name="name" defaultValue={course?.name} required />
          </div>

          <div className="admin-field">
            <label htmlFor="when_label">ช่วงเวลา (เช่น "ปี 1 · เทอม 1")</label>
            <input id="when_label" name="when_label" defaultValue={course?.when_label} required />
          </div>

          <div className="admin-field">
            <label htmlFor="ord">ord (ลำดับสำหรับเรียง เช่น 11 = ปี 1 เทอม 1)</label>
            <input id="ord" name="ord" type="number" defaultValue={course?.ord ?? 0} required />
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
