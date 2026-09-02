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
- **แผงความน่าเชื่อถือ + ฟีดแบ็ก** (`components/TrustPanel.tsx`) — ทุกทักษะที่กดดูหลักฐานมีคำอธิบายวิธีจับคู่ข้อมูล และปุ่ม "ตรง / ไม่ตรง" ให้ผู้ใช้ยืนยัน เก็บทั้ง localStorage (ตอบสนอง UI ทันที) และส่งขึ้น Supabase แบบ best-effort ให้ทีมดูภาพรวมได้ที่ `/admin/feedback` — ปิดลูป Human-in-the-loop ที่ deck ระบุไว้
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
  feedback.ts              ระบบเก็บโหวตฟีดแบ็ก (localStorage + Supabase) + useFeedback() hook
  supabase/                client.ts (browser), server.ts (session-aware, RLS), admin.ts (service-role, bypass RLS)
  actions/                 Server Actions: auth.ts (เข้า/ออกระบบ), admin.ts (CRUD ของทุก resource)
app/admin/
  login/page.tsx           เข้าสู่ระบบผู้ดูแล (Supabase Auth)
  (dashboard)/              หน้าที่ต้องล็อกอิน — sidebar + ภาพรวม + CRUD: สาขา/รายวิชา/ทักษะ/อาชีพ+ความต้องการ/ฟีดแบ็ก
supabase/
  schema.sql               รัน 1 ครั้งใน Supabase SQL Editor ก่อนใช้งาน
  seed.sql                  ข้อมูลตั้งต้น สร้างจาก lib/data.ts จริง (npx tsx scripts/gen-seed.ts)
proxy.ts                  gate /admin/* ให้ต้องล็อกอินก่อน (เดิมชื่อ middleware.ts)
```

## หลังบ้าน (Admin panel)

หน้า `/admin` จัดการ สาขา/รายวิชา/ทักษะ/อาชีพ/ความต้องการทักษะ + ดูฟีดแบ็กผู้ใช้รวมศูนย์ ผ่าน **Supabase** (Postgres + Auth) — **ตอนนี้ยังเป็นฐานข้อมูลแยกต่างหาก หน้าเว็บสาธารณะ (`/`, `/explore`, `/curriculum`, ฯลฯ) ยังอ่านจาก `lib/data.ts` เหมือนเดิม** (เฟสถัดไปคือเชื่อมสองฝั่งเข้าด้วยกัน) — ยกเว้นฟีดแบ็กที่ต่อขึ้น Supabase จริงแล้ววันนี้

### ตั้งค่าครั้งแรก

1. สร้างโปรเจกต์ใหม่ที่ [supabase.com](https://supabase.com) (ฟรี)
2. Supabase Dashboard → **SQL Editor** → รัน `supabase/schema.sql` ทั้งไฟล์ → รัน `supabase/seed.sql` ทั้งไฟล์ (ข้อมูลตั้งต้นจะเข้าตรงกับที่เว็บใช้อยู่ทุกตัว)
3. Supabase Dashboard → **Authentication → Users** → เพิ่มผู้ใช้ 1 คนด้วยอีเมล/รหัสผ่านสำหรับเข้า `/admin`
4. คัดลอก `.env.local.example` เป็น `.env.local` แล้วใส่ค่าจาก Dashboard → **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — จาก "Project API keys"
   - `SUPABASE_SERVICE_ROLE_KEY` — เช่นกัน แต่เป็นคีย์ `service_role` (⚠️ ห้าม commit ห้ามใส่ NEXT_PUBLIC_)
5. ใส่ตัวแปรทั้ง 3 ตัวเดียวกันนี้ใน Vercel Project Settings → Environment Variables ด้วย แล้ว redeploy

## รันเดโม

```bash
npm install
npm run dev
```

แล้วเปิด `http://localhost:3000` (หรือ `http://localhost:3000/admin` หลังตั้งค่า Supabase) — build สำหรับ production ด้วย `npm run build && npm start`

## ขอบเขตข้อมูล (เหมือนต้นแบบ v1 ทุกประการ)

- **หลักสูตร = เอกสารจริง** — วท.บ. วิทยาการคอมพิวเตอร์ (ปรับปรุง พ.ศ. 2566) คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยธรรมศาสตร์
- **ประกาศงาน = ชุดข้อมูลตัวอย่าง** สำหรับสาธิต UI เท่านั้น ยังไม่ใช่ผลจากการวิเคราะห์ประกาศงานจริง

Generation Thailand Hackathon 2026 · โจทย์ที่ 1 · ทีม 4WARDERS
