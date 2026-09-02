"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertMajor } from "@/lib/actions/admin";

type Major = {
  id: string;
  name: string;
  school: string;
  ready: boolean;
  note: string | null;
};

export default function MajorForm({ major }: { major?: Major }) {
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
            <label htmlFor="school">คณะ / มหาวิทยาลัย</label>
            <input id="school" name="school" defaultValue={major?.school} required />
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
