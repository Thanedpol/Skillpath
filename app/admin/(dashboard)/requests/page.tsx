import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profile_requests as reqT } from "@/lib/db/schema";

export default async function AdminRequestsPage() {
  const [majorReqs, roleReqs] = await Promise.all([
    db.select().from(reqT).where(eq(reqT.kind, "major")).orderBy(desc(reqT.created_at)).limit(200),
    db.select().from(reqT).where(eq(reqT.kind, "role")).orderBy(desc(reqT.created_at)).limit(200),
  ]);

  /* นับความถี่เพื่อดูว่าสาขา/อาชีพไหนมีคนขอมากสุด — ใช้จัดลำดับว่าจะทำอะไรต่อ */
  const roleCounts = new Map<string, number>();
  roleReqs.forEach((r) => {
    const k = (r.role_name || "").trim();
    if (k) roleCounts.set(k, (roleCounts.get(k) ?? 0) + 1);
  });
  const topRoles = [...roleCounts.entries()].sort((a, b) => b[1] - a[1]);

  const majorCounts = new Map<string, number>();
  majorReqs.forEach((r) => {
    const k = [r.major_name, r.faculty, r.university].filter(Boolean).join(" · ").trim();
    if (k) majorCounts.set(k, (majorCounts.get(k) ?? 0) + 1);
  });
  const topMajors = [...majorCounts.entries()].sort((a, b) => b[1] - a[1]);

  const fmt = (d: Date) => d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>คำขอจากผู้ใช้</h1>
          <p>
            สาขาและอาชีพที่ผู้ใช้พิมพ์เองตอนตั้งโปรไฟล์ เพราะไม่พบในรายการ —
            ใช้จัดลำดับว่าควรไปสกัดทักษะจากหลักสูตรไหน หรือเพิ่มอาชีพไหนต่อ
          </p>
        </div>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <div className="n">{majorReqs.length}</div>
          <div className="l">คำขอสาขา</div>
        </div>
        <div className="admin-card">
          <div className="n">{roleReqs.length}</div>
          <div className="l">คำขออาชีพ</div>
        </div>
        <div className="admin-card">
          <div className="n">{majorCounts.size + roleCounts.size}</div>
          <div className="l">รายการที่ไม่ซ้ำกัน</div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">สาขาที่ถูกขอมากที่สุด</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>สาขา · คณะ · มหาวิทยาลัย</th>
              <th>จำนวนคำขอ</th>
            </tr>
          </thead>
          <tbody>
            {!topMajors.length ? (
              <tr>
                <td colSpan={2} className="admin-empty">
                  ยังไม่มีคำขอ
                </td>
              </tr>
            ) : (
              topMajors.map(([k, n]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className="num">{n}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">อาชีพที่ถูกขอมากที่สุด</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>อาชีพ</th>
              <th>จำนวนคำขอ</th>
            </tr>
          </thead>
          <tbody>
            {!topRoles.length ? (
              <tr>
                <td colSpan={2} className="admin-empty">
                  ยังไม่มีคำขอ
                </td>
              </tr>
            ) : (
              topRoles.map(([k, n]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className="num">{n}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">คำขอสาขาล่าสุด (ตามที่ผู้ใช้พิมพ์)</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>มหาวิทยาลัย</th>
              <th>คณะ</th>
              <th>หลักสูตร</th>
              <th>สาขา</th>
              <th>เวลา</th>
            </tr>
          </thead>
          <tbody>
            {!majorReqs.length ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  ยังไม่มีคำขอ
                </td>
              </tr>
            ) : (
              majorReqs.slice(0, 50).map((r) => (
                <tr key={r.id}>
                  <td>{r.university || "—"}</td>
                  <td>{r.faculty || "—"}</td>
                  <td>{r.program || "—"}</td>
                  <td>{r.major_name || "—"}</td>
                  <td className="mono" style={{ fontSize: 12 }}>
                    {fmt(r.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">คำขออาชีพล่าสุด</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>อาชีพ</th>
              <th>เวลา</th>
            </tr>
          </thead>
          <tbody>
            {!roleReqs.length ? (
              <tr>
                <td colSpan={2} className="admin-empty">
                  ยังไม่มีคำขอ
                </td>
              </tr>
            ) : (
              roleReqs.slice(0, 50).map((r) => (
                <tr key={r.id}>
                  <td>{r.role_name || "—"}</td>
                  <td className="mono" style={{ fontSize: 12 }}>
                    {fmt(r.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
