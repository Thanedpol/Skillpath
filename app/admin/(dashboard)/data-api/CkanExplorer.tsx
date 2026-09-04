"use client";

import { useState } from "react";
import { fetchCkanPreview } from "@/lib/actions/ckan";
import type { CkanError, CkanResult } from "@/lib/ckan";

type State = CkanResult | CkanError | null;

export default function CkanExplorer({ hasKey }: { hasKey: boolean }) {
  const [state, setState] = useState<State>(null);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setState(null);
    try {
      setState(await fetchCkanPreview(formData));
    } catch (e) {
      setState({ ok: false, error: e instanceof Error ? e.message : "เรียกข้อมูลไม่สำเร็จ" });
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form action={action}>
        <div className="admin-panel">
          <div className="admin-panel-head">ทดลองดึงข้อมูล</div>
          <div className="admin-formgrid">
            <div className="admin-field span2">
              <label htmlFor="resource_id">resource_id</label>
              <input
                id="resource_id"
                name="resource_id"
                required
                placeholder="เช่น 154225da-751e-4452-8b42-e86df7754acd"
                defaultValue=""
              />
            </div>
            <div className="admin-field">
              <label htmlFor="limit">จำนวนแถว (1–100)</label>
              <input id="limit" name="limit" type="number" min={1} max={100} defaultValue={20} />
            </div>
            <div className="admin-field">
              <label htmlFor="q">ค้นหา (ไม่บังคับ)</label>
              <input id="q" name="q" placeholder="คำค้นในข้อมูล" />
            </div>
          </div>
          <div className="admin-formfoot">
            <button type="submit" className="cta" disabled={pending || !hasKey}>
              {pending ? "กำลังดึง…" : "ดึงข้อมูล"}
            </button>
          </div>
        </div>
      </form>

      {state && !state.ok ? <div className="admin-error" style={{ marginTop: 16 }}>{state.error}</div> : null}

      {state?.ok ? (
        <>
          <div className="admin-cards" style={{ marginTop: 20 }}>
            <div className="admin-card">
              <div className="n">{state.total.toLocaleString()}</div>
              <div className="l">แถวทั้งหมดในชุดข้อมูล</div>
            </div>
            <div className="admin-card">
              <div className="n">{state.fields.length}</div>
              <div className="l">คอลัมน์</div>
            </div>
            <div className="admin-card">
              <div className="n">{state.records.length}</div>
              <div className="l">แถวที่ดึงมาแสดง</div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-head">คอลัมน์ที่มี</div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ชื่อคอลัมน์</th>
                  <th>ชนิดข้อมูล</th>
                </tr>
              </thead>
              <tbody>
                {state.fields.map((f) => (
                  <tr key={f.id}>
                    <td className="mono">{f.id}</td>
                    <td>{f.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-head">ตัวอย่างข้อมูล</div>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    {state.fields.map((f) => (
                      <th key={f.id} style={{ whiteSpace: "nowrap" }}>
                        {f.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.records.map((r, i) => (
                    <tr key={i}>
                      {state.fields.map((f) => {
                        const v = r[f.id];
                        const s = v === null || v === undefined ? "—" : String(v);
                        return (
                          <td key={f.id} title={s} style={{ maxWidth: 260 }}>
                            {s.length > 90 ? `${s.slice(0, 90)}…` : s}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
