"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertRole } from "@/lib/actions/admin";

type Role = { id: string; name: string; posts: number; jr_posts: number; fit: number };

export default function RoleForm({ role }: { role?: Role }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = !!role;

  async function action(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await upsertRole(formData);
      if (!isEdit) router.push("/admin/roles");
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={action}>
      <div className="admin-panel">
        <div className="admin-formgrid">
          <div className="admin-field">
            <label htmlFor="id">รหัสอาชีพ (คีย์ — เปลี่ยนไม่ได้หลังสร้าง เช่น "de")</label>
            <input id="id" name="id" defaultValue={role?.id} required disabled={isEdit} />
          </div>
          <div className="admin-field">
            <label htmlFor="name">ชื่ออาชีพ</label>
            <input id="name" name="name" defaultValue={role?.name} required />
          </div>
          <div className="admin-field">
            <label htmlFor="posts">ประกาศงานทั้งหมด</label>
            <input id="posts" name="posts" type="number" min={0} defaultValue={role?.posts ?? 0} required />
          </div>
          <div className="admin-field">
            <label htmlFor="jr_posts">ประกาศระดับ junior</label>
            <input id="jr_posts" name="jr_posts" type="number" min={0} defaultValue={role?.jr_posts ?? 0} required />
          </div>
          <div className="admin-field">
            <label htmlFor="fit">ลำดับความใกล้เคียง (fit, ยิ่งน้อยยิ่งใกล้)</label>
            <input id="fit" name="fit" type="number" min={1} defaultValue={role?.fit ?? 1} required />
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
