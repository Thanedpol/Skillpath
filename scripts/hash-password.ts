/* One-off: hash an admin password for ADMIN_PASSWORD_HASH in .env.local
   Run with: npx tsx scripts/hash-password.ts "รหัสผ่านที่ต้องการ"

   ผลลัพธ์เป็น base64 ของ bcrypt hash โดยตั้งใจ — bcrypt hash ดิบขึ้นต้นด้วย
   "$2b$10$" ซึ่ง @next/env (และช่อง env var ของ Vercel) จะตีความ $... เป็น
   ชื่อตัวแปรแล้วแทนที่ด้วยค่าว่าง ทำให้ค่าหายทั้งก้อน — base64 ไม่มี $ จึงรอด
   ทุก parser ทั้งเครื่อง local และ production */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npx tsx scripts/hash-password.ts "your-password"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(Buffer.from(hash, "utf8").toString("base64"));
});
