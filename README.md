# SkillPath — แพลตฟอร์มเต็มรูปแบบ (Next.js)

ต่อยอดจากต้นแบบหน้าเดียวของทีม 4WARDERS ([chonnaveesuk.github.io/skillpath/v1](https://chonnaveesuk.github.io/skillpath/v1/)) ให้ครบตั้งแต่ทางเข้าจนถึงรายละเอียดของ SkillPath — ตอนนี้ย้ายมาอยู่บน **Next.js 16 (App Router) + TypeScript + React 19** แทน HTML/CSS/JS ล้วน เพื่อให้ต่อยอดฟีเจอร์ใหม่ ๆ ได้โดยไม่กระทบโครงสร้างเดิม (component แยกส่วน, type safety, hot reload)

## หน้าทั้งหมด

| Route | หน้าที่ |
|---|---|
| `/` | ทางเข้า — อธิบายปัญหา (หลักสูตร vs ตลาดงาน ใช้คนละคำ), งานวิจัยผู้ใช้จริง (สัมภาษณ์ 13 คน + persona "เนเน่"), CTA เข้าสู่แอป |
| `/onboarding` | ตั้งโปรไฟล์ 4 ขั้นตอน: สาขา → เป้าหมายอาชีพ (ไม่บังคับ) → ปี/เทอมปัจจุบัน + ปรับแต่งรายวิชาเอง → สรุป |
| `/explore` | สำรวจอาชีพ + ดูแผนรายวิชา (เดิมคือ `app.html`) — ทุกเปอร์เซ็นต์อ่านจากโปรไฟล์จริงของผู้ใช้ |
| `/curriculum` | เบราว์เซอร์ทั้งหลักสูตร ทีละวิชา — ยกระดับ insight ระดับอาชีพมาดูทั้งหลักสูตรพร้อมกัน |
| `/about` | ปัญหา วิธีคำนวณ ขอบเขตข้อมูล และทิศทางถัดไป |

> **หมายเหตุ:** route เดิมชื่อ `app.html` เปลี่ยนเป็น `/explore` เพราะ `app/` เป็นชื่อโฟลเดอร์สงวนของ Next.js App Router

โครงสร้างข้อมูล (`SK`, `COURSES`, `ROLES`, `DEMAND`, `POSTS`) ทั้งหมดคงตัวเลข/ถ้อยคำจากต้นแบบ v1 ไว้ทุกตัว ไม่ได้แต่งข้อมูลใหม่ — แกนหลักคือ **เอนจินโปรไฟล์แบบไดนามิก** (`lib/profile.ts`) ที่คำนวณสถานะทักษะจากปี/เทอมที่ผู้ใช้เลือกจริง แทนการฝังค่า "ปี 3 เทอม 1" ตายตัวไว้ในโค้ด

### ฟีเจอร์เน้นนักศึกษา (สังเคราะห์จาก `SkillPath_PitchDeck_1.pdf`)

- **เป้าหมายอาชีพในโปรไฟล์** — onboarding ถามว่าอยากทำงานอะไร แล้ว `/explore` เปิดตำแหน่งนั้นเป็นค่าเริ่มต้น พร้อมป้าย "เป้าหมายของคุณ"
- **แผงความน่าเชื่อถือ + ฟีดแบ็ก** (`components/TrustPanel.tsx`) — ทุกทักษะที่กดดูหลักฐานมีคำอธิบายวิธีจับคู่ข้อมูล และปุ่ม "ตรง / ไม่ตรง" ให้ผู้ใช้ยืนยัน เก็บทั้ง localStorage (ตอบสนอง UI ทันที) และส่งขึ้น Neon แบบ best-effort ให้ทีมดูภาพรวมได้ที่ `/admin/feedback` — ปิดลูป Human-in-the-loop ที่ deck ระบุไว้
- **งานวิจัยผู้ใช้บนหน้าแรก** — สถิติสัมภาษณ์นักศึกษา 13 คน (70% ไม่มั่นใจ) และเรื่องราวของ "เนเน่" — อยู่ใน `RESEARCH` constant ของ `lib/data.ts`

## โครงสร้างไฟล์

```
app/
  layout.tsx          root layout — โหลดฟอนต์ผ่าน next/font/google
  globals.css          ดีไซน์ระบบทั้งหมด (โทนสี ฟอนต์ คอมโพเนนต์) — ห้ามแก้ทิ้งของเดิม
  page.tsx              ทางเข้า (/)
  onboarding/page.tsx    ตั้งโปรไฟล์
  explore/page.tsx        สำรวจอาชีพ + แผนของฉัน
  curriculum/page.tsx      เบราว์เซอร์หลักสูตร
  about/page.tsx            เกี่ยวกับ / วิธีคำนวณ
components/
  Nav.tsx              เมนูบนสุด ใช้ร่วมทุกหน้า
  Drawer.tsx            เชลล์ลิ้นชักหลักฐาน (backdrop, esc, transition)
  TrustPanel.tsx        แผงความน่าเชื่อถือ + โหวตฟีดแบ็กต่อทักษะ
lib/
  types.ts              type definitions ที่ใช้ร่วมกัน
  data.ts                ข้อมูลจริงทั้งหมด (SK, COURSES, ROLES, DEMAND, POSTS, MAJORS, RESEARCH)
  profile.ts              เอนจินคำนวณโปรไฟล์ + useProfile() hook
  feedback.ts              ระบบเก็บโหวตฟีดแบ็ก (localStorage + Server Action) + useFeedback() hook
  db/                       schema.ts (Drizzle schema), index.ts (Neon client, server-only)
  actions/                 Server Actions: auth.ts (เข้า/ออกระบบ), admin.ts (CRUD ของทุก resource), feedback.ts (โหวตสาธารณะ)
app/admin/
  login/page.tsx           เข้าสู่ระบบผู้ดูแล (Auth.js)
  (dashboard)/              หน้าที่ต้องล็อกอิน — sidebar แบ่งเป็น 3 กลุ่ม:
                              หลักสูตร  → มหาวิทยาลัย / คณะ / สาขา / รายวิชา / ทักษะ
                              ตลาดงาน  → อาชีพ + ความต้องการทักษะ
                              ผู้ใช้     → ฟีดแบ็ก
app/api/auth/[...nextauth]/route.ts   Auth.js route handler
auth.ts                    Auth.js config — Credentials provider เทียบกับ ADMIN_EMAIL/ADMIN_PASSWORD_HASH
drizzle.config.ts          config สำหรับ drizzle-kit push/studio
scripts/
  seed.ts                   ข้อมูลตั้งต้น สร้างจาก lib/data.ts จริง (npm run db:seed)
  hash-password.ts           สร้าง bcrypt hash สำหรับ ADMIN_PASSWORD_HASH
proxy.ts                  gate /admin/* ให้ต้องล็อกอินก่อน (เดิมชื่อ middleware.ts)
```

## หลังบ้าน (Admin panel)

หน้า `/admin` จัดการ สาขา/รายวิชา/ทักษะ/อาชีพ/ความต้องการทักษะ + ดูฟีดแบ็กผู้ใช้รวมศูนย์ ผ่าน **Neon** (Postgres แบบ serverless, เข้าผ่าน Drizzle ORM) + **Auth.js** (Credentials provider, admin คนเดียว ไม่มีระบบสมัครสมาชิก) — **ตอนนี้ยังเป็นฐานข้อมูลแยกต่างหาก หน้าเว็บสาธารณะ (`/`, `/explore`, `/curriculum`, ฯลฯ) ยังอ่านจาก `lib/data.ts` เหมือนเดิม** (เฟสถัดไปคือเชื่อมสองฝั่งเข้าด้วยกัน) — ยกเว้นฟีดแบ็กที่ต่อขึ้น Neon จริงแล้ววันนี้

### ตั้งค่าครั้งแรก

1. สร้างฐานข้อมูลที่ [neon.tech](https://neon.tech) (ฟรี) — หรือใน Vercel Dashboard → **Storage** → เพิ่ม Neon (ผูก env var ให้อัตโนมัติ)
2. คัดลอก connection string แบบ **pooled** (มี `-pooler` ในโฮสต์) ใส่ `DATABASE_URL` ใน `.env.local` (คัดลอกจาก `.env.local.example`)
3. สร้าง session secret: `npx auth secret` (หรือ `openssl rand -base64 33`) ใส่ใน `AUTH_SECRET`
4. เลือกอีเมล+รหัสผ่านสำหรับ admin ใส่ `ADMIN_EMAIL` แล้วสร้าง hash ด้วย `npx tsx scripts/hash-password.ts "รหัสผ่านที่ต้องการ"` ใส่ผลลัพธ์ใน `ADMIN_PASSWORD_HASH`
5. สร้างตาราง: `npm run db:push` แล้ว seed ข้อมูลตั้งต้น: `npm run db:seed`
6. ใส่ตัวแปรทั้ง 4 ตัวเดียวกันนี้ (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`) ใน Vercel Project Settings → Environment Variables ด้วย แล้ว redeploy

ดู schema เต็มได้ที่ `lib/db/schema.ts` — แก้ schema แล้ว sync ขึ้น Neon ใหม่ด้วย `npm run db:push` อีกครั้ง หรือเปิด `npm run db:studio` เพื่อดู/แก้ข้อมูลผ่าน browser UI

## รันเดโม

```bash
npm install
npm run dev
```

แล้วเปิด `http://localhost:3000` (หรือ `http://localhost:3000/admin` หลังตั้งค่า Neon) — build สำหรับ production ด้วย `npm run build && npm start`

## ขอบเขตข้อมูล

- **หลักสูตร = เอกสารจริง** — รองรับ 3 สาขา ข้อมูลรายวิชาแยกเป็น major-scoped (`SK_BY_MAJOR`/`COURSES_BY_MAJOR` ใน `lib/data.ts`):
  - **วิทยาการคอมพิวเตอร์** (`cs-tu`) — วท.บ. (ปรับปรุง พ.ศ. 2566) คณะวิทยาศาสตร์และเทคโนโลยี มธ.
  - **สถิติ — วิชาเอกสถิติศาสตร์** (`stat-sci-tu`, โครงการภาคปกติ) และ **สถิติ — วิชาเอกวิทยาการวิเคราะห์ข้อมูล** (`stat-da-tu`, โครงการภาคพิเศษ) —
    วท.บ. สาขาวิชาสถิติ (ปรับปรุง พ.ศ. 2566) คณะวิทยาศาสตร์และเทคโนโลยี มธ. ศูนย์รังสิต — แยกเป็น 2 major เพราะ 2 โครงการนี้เรียงลำดับเทอมของวิชาบังคับร่วมกันไม่เหมือนกัน
    (ยืนยันจากตารางแผนการศึกษาจริง หน้า 28–33 ของเอกสาร) วิชาเลือกที่ไม่มีเทอมกำกับตายตัวในแผน ประมาณ ord จาก `max(ห่วงโซ่วิชาบังคับก่อน, ธรรมเนียมเลขวิชา)` — ระบุไว้ในหน้ารายวิชาเสมอว่าเป็นค่ายืนยันจากแผนจริงหรือค่าประมาณ
  - นักศึกษาสถิติเห็นความครอบคลุมของอาชีพเดิม (Data Analyst, ML Engineer ฯลฯ) จากหลักสูตรของตัวเอง — ไม่ได้เพิ่มอาชีพ "Actuary" ใหม่ แม้หลักสูตรจะมีคลัสเตอร์คณิตศาสตร์ประกันภัย 9 วิชา เพราะยังไม่มีข้อมูลตลาดงานจริงรองรับ (ดูหน้า "เกี่ยวกับ")
- **ประกาศงาน = ชุดข้อมูลตัวอย่าง** สำหรับสาธิต UI เท่านั้น ยังไม่ใช่ผลจากการวิเคราะห์ประกาศงานจริง

Generation Thailand Hackathon 2026 · โจทย์ที่ 1 · ทีม 4WARDERS
