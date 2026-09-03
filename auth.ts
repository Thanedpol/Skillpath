import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/* มี admin แค่คนเดียว — ไม่มีตาราง users แยก เช็คตรงกับ ADMIN_EMAIL /
   ADMIN_PASSWORD_HASH ใน env var (สร้าง hash ด้วย scripts/hash-password.ts) */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");
        const adminEmail = process.env.ADMIN_EMAIL;
        const encodedHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminEmail || !encodedHash) return null;
        if (email !== adminEmail) return null;
        // เก็บเป็น base64 เพราะ bcrypt hash ดิบมี $ ซึ่ง @next/env และ Vercel
        // จะ expand เป็นตัวแปรแล้วทำให้ค่าหาย — ดู scripts/hash-password.ts
        const adminHash = Buffer.from(encodedHash, "base64").toString("utf8");
        const ok = await bcrypt.compare(password, adminHash);
        if (!ok) return null;
        return { id: "admin", email };
      },
    }),
  ],
});
