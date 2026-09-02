"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteDemand, upsertDemand } from "@/lib/actions/admin";

type DemandRow = { id: number; level: "jr" | "sr"; skill_key: string; count: number };

export default function DemandManager({ roleId, demand }: { roleId: string; demand: DemandRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function add(formData: FormData) {
    setError(null);
    try {
      await upsertDemand(formData);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    }
  }

  const jr = demand.filter((d) => d.level === "jr").sort((a, b) => b.count - a.count);
  const sr = demand.filter((d) => d.level === "sr").sort((a, b) => b.count - a.count);

  const Section = ({ title, rows }: { title: string; rows: DemandRow[] }) => (
    <div className="admin-panel">
      <div className="admin-panel-head">{title}</div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ทักษะ</th>
            <th>จำนวนประกาศ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!rows.length ? (
            <tr>
              <td colSpan={3} className="admin-empty">
                ยังไม่มีข้อมูล
              </td>
            </tr>
          ) : (
            rows.map((d) => (
              <tr key={d.id}>
                <td>{d.skill_key}</td>
                <td className="num">{d.count}</td>
                <td>
                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={async () => {
                      if (confirm(`ลบ "${d.skill_key}" ออกจาก ${title} ใช่ไหม?`)) {
                        await deleteDemand(d.id);
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
  );

  return (
    <>
      <Section title="Junior" rows={jr} />
      <Section title="Senior" rows={sr} />

      <div className="admin-panel">
        <div className="admin-panel-head">เพิ่มความต้องการทักษะ</div>
        <form action={add}>
          <input type="hidden" name="role_id" value={roleId} />
          <div className="admin-formgrid">
            <div className="admin-field">
              <label htmlFor="level">ระดับ</label>
              <select id="level" name="level" defaultValue="jr">
                <option value="jr">Junior</option>
                <option value="sr">Senior</option>
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="skill_key">ชื่อทักษะ</label>
              <input id="skill_key" name="skill_key" required />
            </div>
            <div className="admin-field">
              <label htmlFor="count">จำนวนประกาศ</label>
              <input id="count" name="count" type="number" min={0} required />
            </div>
          </div>
          {error ? (
            <div className="admin-error" style={{ margin: "0 20px 16px" }}>
              {error}
            </div>
          ) : null}
          <div className="admin-formfoot">
            <button type="submit" className="cta">
              + เพิ่ม
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
