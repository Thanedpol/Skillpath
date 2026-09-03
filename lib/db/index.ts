import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/* Server-only Neon client — DATABASE_URL never reaches the browser.
   neon-http is stateless (one request = one HTTP call), which is what
   Vercel's serverless functions want; no connection pooling to manage.

   Lazy on purpose: constructing eagerly at module scope makes `neon()`
   throw the moment this file is imported — which happens during Next's
   build-time "collecting page data" step for every admin route, even
   though they're all dynamic. Deferring the throw to first actual query
   means `next build` succeeds without DATABASE_URL set; only visiting
   /admin without it configured fails, which is the right place for it. */
let _db: NeonHttpDatabase<typeof schema> | undefined;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL ยังไม่ได้ตั้งค่า — คัดลอก .env.local.example เป็น .env.local แล้วใส่ค่าจาก Neon");
  }
  const sql = neon(process.env.DATABASE_URL);
  _db = drizzle(sql, { schema });
  return _db;
}

export const db: NeonHttpDatabase<typeof schema> = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
