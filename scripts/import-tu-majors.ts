/* One-off: แปลงหลักสูตรปริญญาตรีของ มธ. จากชุดข้อมูลเปิด data.go.th
   เป็น lib/data.majors-tu.ts

   ที่มา: univ_cur_11_01.csv — "ข้อมูลหลักสูตรที่เปิดสอนในสถาบันอุดมศึกษา"
   เผยแพร่บน data.go.th โดยกระทรวง อว. · ดาวน์โหลดไว้ในโปรเจกต์นี้

   กติกาที่ยึดเคร่งครัด (ตามที่ผู้ใช้กำชับ):
   - ไม่เดาคณะ — CSV ไม่มีคอลัมน์คณะ ทุกแถวที่ import จึงมี facultyId ว่าง
     ยกเว้นสาขาที่ทีมยืนยันเองจากเอกสารหลักสูตรจริง
   - ไม่แต่งสกิล — หลักสูตรที่ import มาทั้งหมด ready=false จนกว่าจะมีคน
     สกัดทักษะจากเอกสารหลักสูตรจริง
   - ระบุแหล่งที่มาทุกแถว
   Run: npx tsx scripts/import-tu-majors.ts
*/
import fs from "node:fs";
import path from "node:path";

const SOURCE_LABEL = "data.go.th · univ_cur_11_01.csv (ทะเบียนหลักสูตรอุดมศึกษา)";

/* สาขาที่ทีมสกัดทักษะจากเอกสารหลักสูตรจริงไว้แล้ว — ผูกกับรหัสหลักสูตรทางการ
   ที่ตรวจสอบแล้วว่าตรงกันจริงในทะเบียน ไม่ได้จับคู่จากการเดาชื่อ */
const CURATED: Record<string, { currId: string; facultyId: string }> = {
  "cs-tu": { currId: "25520051102624", facultyId: "sci-tu" },
  // CSV บันทึกสถิติเป็น "หลักสูตร" เดียว ส่วนวิชาเอก 2 ตัวเป็นการแยกภายใน
  // หลักสูตรเดียวกันตามเอกสาร มธ. ทั้งคู่จึงอ้างรหัสหลักสูตรเดียวกันอย่างถูกต้อง
  "stat-sci-tu": { currId: "25400051100371", facultyId: "sci-tu" },
  "stat-da-tu": { currId: "25400051100371", facultyId: "sci-tu" },
  "ce": { currId: "25450051100387", facultyId: "eng-tu" },
};

function parseCSV(txt: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [], f = "", q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) {
      if (c === '"') { if (txt[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") { cur.push(f); f = ""; }
    else if (c === "\n") { cur.push(f); rows.push(cur); cur = []; f = ""; }
    else if (c !== "\r") f += c;
  }
  if (f || cur.length) { cur.push(f); rows.push(cur); }
  return rows;
}

/* id ที่อ่านออกและคงที่ อิงรหัสหลักสูตรทางการ ไม่ใช่ลำดับที่อาจสลับได้ */
function majorIdFor(currId: string): string {
  return `tu-${currId}`;
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const csvPath = path.join(process.cwd(), "univ_cur_11_01.csv");
const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
const hdr = rows[0].map((h) => h.trim());
const ix = Object.fromEntries(hdr.map((h, i) => [h, i])) as Record<string, number>;

const tuBachelors = rows
  .slice(1)
  .filter((r) => r.length >= hdr.length)
  .filter((r) => (r[ix.UNIV_MASTER_NAME] || "").includes("ธรรมศาสตร์"))
  .filter((r) => (r[ix.LEVEL_DESC] || "").trim() === "ปริญญาตรี")
  .map((r) => ({
    currId: (r[ix.CURR_ID] || "").trim(),
    name: (r[ix.CURR_NAME] || "").trim(),
    level: (r[ix.LEVEL_DESC] || "").trim(),
    isced: (r[ix.ISCED_BOARD_FIELD_NAME_TH] || "").trim().replace(/\s+/g, " "),
  }))
  .filter((x) => x.currId && x.name);

// รหัสหลักสูตรซ้ำได้ในทะเบียน — เก็บแถวแรกไว้แถวเดียว
const seen = new Set<string>();
const unique = tuBachelors.filter((x) => (seen.has(x.currId) ? false : (seen.add(x.currId), true)));

const curatedCurrIds = new Set(Object.values(CURATED).map((c) => c.currId));
const imported = unique.filter((x) => !curatedCurrIds.has(x.currId));

imported.sort((a, b) => a.isced.localeCompare(b.isced, "th") || a.name.localeCompare(b.name, "th"));

const lines: string[] = [];
lines.push("/* ============================================================");
lines.push("   หลักสูตรปริญญาตรี มหาวิทยาลัยธรรมศาสตร์ จากชุดข้อมูลเปิด");
lines.push("");
lines.push(`   ที่มา: ${SOURCE_LABEL}`);
lines.push("   สร้างโดย scripts/import-tu-majors.ts — อย่าแก้ด้วยมือ ให้รันสคริปต์ใหม่แทน");
lines.push("");
lines.push("   ทุกแถวในไฟล์นี้ ready=false และไม่มี facultyId โดยตั้งใจ:");
lines.push("   ชุดข้อมูลเปิดมีแค่ชื่อหลักสูตร มหาวิทยาลัย ระดับ และกลุ่ม ISCED");
lines.push("   ไม่มีคอลัมน์คณะ และไม่มีรายการทักษะใด ๆ — การเติมสองอย่างนี้เองจะเป็น");
lines.push("   การแต่งข้อมูล จึงเว้นไว้จนกว่าจะมีคนสกัดจากเอกสารหลักสูตรจริง");
lines.push("   ============================================================ */");
lines.push('import type { Major } from "./types";');
lines.push("");
lines.push(`export const TU_OPENDATA_SOURCE = "${esc(SOURCE_LABEL)}";`);
lines.push("");
lines.push("export const TU_OPENDATA_MAJORS: Major[] = [");
for (const x of imported) {
  lines.push(
    `  { id: "${majorIdFor(x.currId)}", universityId: "tu", name: "${esc(x.name)}", ready: false,` +
      ` curriculumId: "${x.currId}", level: "${esc(x.level)}", iscedField: "${esc(x.isced)}", source: TU_OPENDATA_SOURCE },`
  );
}
lines.push("];");
lines.push("");

fs.writeFileSync(path.join(process.cwd(), "lib", "data.majors-tu.ts"), lines.join("\n"), "utf8");

console.log("หลักสูตรปริญญาตรี มธ. ในชุดข้อมูล:", unique.length);
console.log("ตรงกับสาขาที่ทีมทำไว้แล้ว (ไม่ import ซ้ำ):", unique.length - imported.length);
console.log("เขียนลง lib/data.majors-tu.ts:", imported.length, "หลักสูตร");
console.log("\nกลุ่ม ISCED:");
const byIsced: Record<string, number> = {};
imported.forEach((x) => { byIsced[x.isced] = (byIsced[x.isced] || 0) + 1; });
Object.entries(byIsced).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(" ", String(v).padStart(3), "|", k));
