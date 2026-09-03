"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertUniversity } from "@/lib/actions/admin";

type University = { id: string; name: string; short_name: string };

export default function UniversityForm({ university }: { university?: University }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = !!university;

  async function action(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await upsertUniversity(formData);
      router.push("/admin/universities");
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
            <label htmlFor="id">รหัสมหาวิทยาลัย (คีย์ — เปลี่ยนไม่ได้หลังสร้าง เช่น &quot;tu&quot;)</label>
            <input id="id" name="id" defaultValue={university?.id} required disabled={isEdit} />
          </div>

          <div className="admin-field">
            <label htmlFor="name">ชื่อเต็ม (เช่น &quot;มหาวิทยาลัยธรรมศาสตร์&quot;)</label>
            <input id="name" name="name" defaultValue={university?.name} required />
          </div>

          <div className="admin-field">
            <label htmlFor="short_name">ชื่อย่อ (เช่น &quot;มธ.&quot;)</label>
            <input id="short_name" name="short_name" defaultValue={university?.short_name} required />
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
