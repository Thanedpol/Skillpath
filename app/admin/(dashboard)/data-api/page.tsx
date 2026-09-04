import { hasApiKey } from "@/lib/ckan";
import CkanExplorer from "./CkanExplorer";

export default async function AdminDataApiPage() {
  const hasKey = hasApiKey();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>API ข้อมูลเปิด</h1>
          <p>
            เชื่อมกับ CKAN Data API ของ data.go.th — ใช้สำรวจชุดข้อมูลก่อนตัดสินใจว่าจะนำคอลัมน์ไหน
            มาผูกกับหลักสูตร ทักษะ หรือประกาศงานในระบบ
          </p>
        </div>
      </div>

      {!hasKey ? (
        <div className="admin-panel">
          <div className="admin-panel-head">ยังใช้งานไม่ได้ — ต้องมี API key ก่อน</div>
          <div style={{ padding: "16px 20px", fontSize: 13.5, lineHeight: 1.75, color: "var(--ink-soft)" }}>
            <p style={{ margin: "0 0 10px" }}>
              data.go.th บังคับให้ส่ง API key ทุกคำขอ (ทดสอบแล้ว: ถ้าไม่ส่งจะได้{" "}
              <span className="mono">No API key found in request</span>) ทำตามนี้ครับ:
            </p>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                สมัคร/เข้าสู่ระบบที่ <span className="mono">data.go.th</span> แล้วขอ API key จากหน้าโปรไฟล์ผู้ใช้
              </li>
              <li>
                ใส่ใน <span className="mono">.env.local</span> เป็น{" "}
                <span className="mono">DATA_GO_TH_API_KEY=&lt;คีย์ของคุณ&gt;</span>
              </li>
              <li>
                ใส่ตัวเดียวกันใน Vercel → Project Settings → Environment Variables แล้ว redeploy
              </li>
            </ol>
            <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 12.5 }}>
              คีย์ถูกอ่านฝั่งเซิร์ฟเวอร์เท่านั้น ไม่ถูกส่งไปที่เบราว์เซอร์
            </p>
          </div>
        </div>
      ) : null}

      <CkanExplorer hasKey={hasKey} />

      <div className="admin-panel">
        <div className="admin-panel-head">หา resource_id ได้จากไหน</div>
        <div style={{ padding: "16px 20px", fontSize: 13.5, lineHeight: 1.75, color: "var(--ink-soft)" }}>
          เปิดหน้าชุดข้อมูลที่ต้องการใน data.go.th → เลื่อนลงไปที่กล่อง{" "}
          <b>CKAN Data API</b> → กาง <b>ตัวอย่างเรียกข้อมูล</b> จะเห็น URL ที่มี{" "}
          <span className="mono">resource_id=…</span> ให้คัดลอกค่าหลังเครื่องหมายเท่ากับมาใส่ในช่องด้านบน
        </div>
      </div>
    </>
  );
}
