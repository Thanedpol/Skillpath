/* ซิงก์ชุดรหัสสกิลกลางจาก lib/data.ts เข้าฐานข้อมูล — เพิ่มและผูกอย่างเดียว
   ไม่ลบแถวไหนทั้งสิ้น จึงรันซ้ำบนฐานที่ใช้งานจริงได้ (ต่างจาก seed.ts ที่ล้างทั้งฐาน)

   รหัสสกิลกลางคือ "ชื่อสกิลเดิม" ที่ระบบใช้จับคู่อยู่แล้ว การผูกกลับจึงตรงตัว
   ไม่มีการเดาหรือจับคู่โดยประมาณในขั้นนี้

   รันด้วย: npx tsx scripts/sync-canonical-skills.ts */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { canonical_skills } from "../lib/db/schema";
import * as schema from "../lib/db/schema";
import { DEMAND, SK_BY_MAJOR } from "../lib/data";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

async function main() {
  const ids = new Set<string>();
  for (const sk of Object.values(SK_BY_MAJOR)) for (const key of Object.keys(sk)) ids.add(key);
  for (const levels of Object.values(DEMAND)) {
    for (const level of ["jr", "sr"] as const) {
      for (const [key] of levels[level] || []) ids.add(key);
    }
  }

  const rows = [...ids].sort().map((id) => ({ id, name: id }));
  /* onConflictDoNothing — ชื่อ/หมวด/ESCO ที่ทีมแก้ไว้ในแอดมินต้องไม่ถูกเขียนทับ */
  if (rows.length) await db.insert(canonical_skills).values(rows).onConflictDoNothing();

  const linkedSkills = await db.execute(sql`
    update skills set canonical_id = key
    where canonical_id is null
      and exists (select 1 from canonical_skills c where c.id = skills.key)
  `);
  const linkedDemand = await db.execute(sql`
    update demand set canonical_id = skill_key
    where canonical_id is null
      and exists (select 1 from canonical_skills c where c.id = demand.skill_key)
  `);

  const [unlinkedSkills] = await db
    .execute(sql`select count(*)::int as n from skills where canonical_id is null`)
    .then((r) => r.rows as { n: number }[]);
  const [unlinkedDemand] = await db
    .execute(sql`select count(*)::int as n from demand where canonical_id is null`)
    .then((r) => r.rows as { n: number }[]);

  console.log("ซิงก์เสร็จ:", {
    สกิลกลางทั้งหมด: rows.length,
    ผูกแถวสกิลหลักสูตรเพิ่ม: linkedSkills.rowCount ?? 0,
    ผูกแถวความต้องการตลาดเพิ่ม: linkedDemand.rowCount ?? 0,
    สกิลหลักสูตรที่ยังไม่ผูก: unlinkedSkills?.n ?? 0,
    ความต้องการตลาดที่ยังไม่ผูก: unlinkedDemand?.n ?? 0,
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
