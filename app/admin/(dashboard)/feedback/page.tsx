import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { feedback as feedbackT } from "@/lib/db/schema";

type FeedbackRow = {
  skill_key: string;
  vote: string;
  page: string | null;
  created_at: Date;
};

export default async function AdminFeedbackPage() {
  const [total, up, down, allVotes, recent] = await Promise.all([
    db.$count(feedbackT),
    db.$count(feedbackT, eq(feedbackT.vote, "up")),
    db.$count(feedbackT, eq(feedbackT.vote, "down")),
    db.select({ skill_key: feedbackT.skill_key, vote: feedbackT.vote }).from(feedbackT),
    db
      .select({ skill_key: feedbackT.skill_key, vote: feedbackT.vote, page: feedbackT.page, created_at: feedbackT.created_at })
      .from(feedbackT)
      .orderBy(desc(feedbackT.created_at))
      .limit(20),
  ]);

  // aggregated in JS rather than SQL GROUP BY — fine at hackathon-demo scale
  const bySkill = new Map<string, { up: number; down: number }>();
  for (const row of allVotes ?? []) {
    const entry = bySkill.get(row.skill_key) ?? { up: 0, down: 0 };
    if (row.vote === "up") entry.up += 1;
    else if (row.vote === "down") entry.down += 1;
    bySkill.set(row.skill_key, entry);
  }
  const skillRows = Array.from(bySkill.entries())
    .map(([skill_key, { up, down }]) => ({ skill_key, up, down, total: up + down }))
    .sort((a, b) => b.total - a.total);

  const recentRows = (recent ?? []) as FeedbackRow[];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>ฟีดแบ็กผู้ใช้</h1>
          <p>
            รวมฟีดแบ็ก &quot;ตรง/ไม่ตรง&quot; จากผู้ใช้จริง — เดิมเก็บแค่ในเครื่องแต่ละคน ตอนนี้เห็นภาพรวมได้แล้ว
          </p>
        </div>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <div className="n">{total ?? 0}</div>
          <div className="l">ฟีดแบ็กทั้งหมด</div>
        </div>
        <div className="admin-card">
          <div className="n">{up ?? 0}</div>
          <div className="l">ตรง</div>
        </div>
        <div className="admin-card">
          <div className="n">{down ?? 0}</div>
          <div className="l">ไม่ตรง</div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">แยกตามทักษะ</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ทักษะ</th>
              <th>ตรง</th>
              <th>ไม่ตรง</th>
              <th>รวม</th>
            </tr>
          </thead>
          <tbody>
            {!skillRows.length ? (
              <tr>
                <td colSpan={4} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              skillRows.map((s) => (
                <tr key={s.skill_key}>
                  <td>
                    <b>{s.skill_key}</b>
                  </td>
                  <td className="num">{s.up}</td>
                  <td className="num">{s.down}</td>
                  <td className="num">{s.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">ฟีดแบ็กล่าสุด</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ทักษะ</th>
              <th>โหวต</th>
              <th>หน้า</th>
              <th>เวลา</th>
            </tr>
          </thead>
          <tbody>
            {!recentRows.length ? (
              <tr>
                <td colSpan={4} className="admin-empty">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            ) : (
              recentRows.map((r, i) => (
                <tr key={i}>
                  <td className="mono">{r.skill_key}</td>
                  <td>
                    {r.vote === "up" ? (
                      <span style={{ color: "var(--spark)" }}>ตรง</span>
                    ) : (
                      <span style={{ color: "var(--rust)" }}>ไม่ตรง</span>
                    )}
                  </td>
                  <td>{r.page || "—"}</td>
                  <td className="mono">
                    {r.created_at.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
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
