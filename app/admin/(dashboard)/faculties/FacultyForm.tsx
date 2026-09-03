"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertFaculty } from "@/lib/actions/admin";

type Faculty = { id: string; university_id: string; name: string; campus: string | null };
type University = { id: string; name: string };

export default function FacultyForm({
  universities,
  faculty,
}: {
  universities: University[];
  faculty?: Faculty;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = !!faculty;

  async function action(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await upsertFaculty(formData);
      router.push("/admin/faculties");
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
            <label htmlFor="id">รหัสคณะ (คีย์ — เปลี่ยนไม่ได้หลังสร้าง เช่น &quot;sci-tu&quot;)</label>
            <input id="id" name="id" defaultValue={faculty?.id} required disabled={isEdit} />
          </div>

          <div className="admin-field span2">
            <label htmlFor="university_id">มหาวิทยาลัย</label>
            <select id="university_id" name="university_id" defaultValue={faculty?.university_id} required>
              {!faculty ? <option value="">— เลือกมหาวิทยาลัย —</option> : null}
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="name">ชื่อคณะ (เช่น &quot;คณะวิทยาศาสตร์และเทคโนโลยี&quot;)</label>
            <input id="name" name="name" defaultValue={faculty?.name} required />
          </div>

          <div className="admin-field">
            <label htmlFor="campus">วิทยาเขต / ศูนย์ (ไม่บังคับ เช่น &quot;ศูนย์รังสิต&quot;)</label>
            <input id="campus" name="campus" defaultValue={faculty?.campus || ""} />
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
