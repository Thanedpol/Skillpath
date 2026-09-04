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

      <div className="admin-panel">
        <div className="admin-panel-head">เรียกผ่าน endpoint สาธารณะ — ไม่ต้องใช้ API key</div>
        <div style={{ padding: "16px 20px", fontSize: 13.5, lineHeight: 1.75, color: "var(--ink-soft)" }}>
          <p style={{ margin: "0 0 8px" }}>
            หน้าเว็บ data.go.th แนะนำให้เรียกผ่าน <span className="mono">opend.data.go.th/get-ckan</span>{" "}
            ซึ่งบังคับใช้ API key และจำกัด 1,000 ครั้ง/วัน — แต่ตรวจสอบแล้วว่าปลายทางของมันคือ{" "}
            <span className="mono">data.go.th/api/3/action</span> ที่เปิดสาธารณะและตอบข้อมูลชุดเดียวกันโดยไม่ต้องใช้คีย์
            ระบบนี้จึงเรียกตรงไปที่ endpoint สาธารณะ ไม่ติดโควตา
          </p>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 12.5 }}>
            {hasKey
              ? "ตรวจพบ DATA_GO_TH_API_KEY ในระบบ — จะแนบไปด้วยเผื่อชุดข้อมูลบางตัวต้องใช้ (อ่านฝั่งเซิร์ฟเวอร์เท่านั้น)"
              : "ยังไม่ได้ตั้ง DATA_GO_TH_API_KEY ซึ่งไม่จำเป็น — ตั้งได้ถ้าเจอชุดข้อมูลที่บังคับใช้คีย์"}
          </p>
        </div>
      </div>

      <CkanExplorer />

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
