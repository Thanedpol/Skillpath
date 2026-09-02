"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import { RESEARCH } from "@/lib/data";
import { hasSavedProfile, useProfile } from "@/lib/profile";

export default function HomePage() {
  const { ready } = useProfile();
  const goingToApp = ready && hasSavedProfile();
  const P = RESEARCH.persona;

  return (
    <>
      <Nav />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="wrap">
          <span className="kicker">Generation Thailand Hackathon 2026 · โจทย์ที่ 1 · ทีม 4WARDERS</span>
          <h1>
            หลักสูตรกับตลาดงาน
            <br />
            พูดถึงทักษะเดียวกัน
            <br />
            <em>แต่เขียนคนละภาษา</em>
          </h1>
          <p className="lede">
            SkillPath แปลรายวิชาที่คุณเรียนให้เป็นภาษาที่ประกาศงานจริงเข้าใจ บอกตรง ๆ ว่าคุณครอบคลุมตำแหน่งที่อยากได้แค่ไหน
            — และปฏิเสธที่จะฟันธงเมื่อข้อมูลไม่พอ แทนที่จะให้ตัวเลขที่ดูมั่นใจเกินจริง
          </p>
          <div className="ctarow">
            <Link className="cta lg" href={goingToApp ? "/explore" : "/onboarding"}>
              {goingToApp ? "ไปที่แผนของฉัน →" : "เริ่มต้นใช้งาน →"}
            </Link>
            <Link className="cta lg ghost" href="/explore">
              ดูตัวอย่างเลย
            </Link>
            <span className="note">ไม่ต้องสมัครสมาชิก · ใช้เวลาไม่ถึงนาที</span>
          </div>
        </div>
      </section>

      <div className="stripe">
        <div className="wrap">
          <div className="cell">
            <div className="n mono">3,180</div>
            <div className="l">ประกาศงานจริงที่วิเคราะห์แล้ว ใน 90 วันล่าสุด*</div>
          </div>
          <div className="cell">
            <div className="n mono">20</div>
            <div className="l">รายวิชาในหลักสูตรจริงที่ติดตาม</div>
          </div>
          <div className="cell">
            <div className="n mono">6</div>
            <div className="l">ตำแหน่งงานที่เปรียบเทียบให้ได้</div>
          </div>
          <div className="cell">
            <div className="n mono">30</div>
            <div className="l">จำนวนประกาศขั้นต่ำ ก่อนระบบจะยอมฟันธงเป็น %</div>
          </div>
        </div>
      </div>

      {/* ============ PROBLEM ============ */}
      <section className="section">
        <div className="wrap">
          <span className="kicker">ปัญหาที่แท้จริง</span>
          <h2>ค้นคำว่า &quot;SQL&quot; ในเอกสารหลักสูตร 162 หน้า — เจอ 0 ครั้ง</h2>
          <p className="lede">
            ไม่ใช่เพราะหลักสูตรไม่ได้สอน แต่เพราะเอกสารเขียนด้วยภาษาวิชาการ ส่วนตลาดงานเขียนด้วยชื่อผลิตภัณฑ์
            นักศึกษาที่มีทักษะอยู่แล้วจึงไม่รู้ตัว และปิดโอกาสตัวเองในการยื่นสมัครงาน
          </p>

          <div className="gaptable">
            <div className="gaprow head">
              <div className="gc">ตลาดงานเขียนว่า</div>
              <div className="gc">หลักสูตรเขียนว่า</div>
              <div className="gc">ผลค้นในเอกสาร</div>
            </div>
            <div className="gaprow">
              <div className="gc market"><q>ใช้ SQL ได้คล่อง</q></div>
              <div className="gc curric">“ภาษาสอบถาม / query languages” (คพ.251)</div>
              <div className="gc result">SQL — พบ 0 ครั้ง</div>
            </div>
            <div className="gaprow">
              <div className="gc market"><q>มีประสบการณ์ใช้ Docker</q></div>
              <div className="gc curric">“คอนเทนเนอร์” (คพ.365)</div>
              <div className="gc result">Docker — พบ 0 ครั้ง</div>
            </div>
            <div className="gaprow">
              <div className="gc market"><q>ใช้ Git ร่วมกับทีมได้</q></div>
              <div className="gc curric">“การควบคุมเวอร์ชันของโค้ดด้วยกิท” (คพ.365)</div>
              <div className="gc result">Git — พบ 1 ครั้ง</div>
            </div>
            <div className="gaprow">
              <div className="gc market"><q>เคยใช้ Spring Boot</q></div>
              <div className="gc curric">ไม่มีวิชาสอน</div>
              <div className="gc result">Spring — พบ 0 ครั้ง</div>
            </div>
          </div>
          <p className="lede" style={{ marginTop: 16 }}>
            <Link href="/about" style={{ color: "var(--accent)", textDecoration: "none" }}>
              อ่านที่มาของข้อมูลและวิธีคำนวณทั้งหมด →
            </Link>
          </p>
        </div>
      </section>

      {/* ============ VALIDATED BY RESEARCH ============ */}
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <span className="kicker">ไม่ใช่สมมติฐาน</span>
          <h2>ปัญหานี้ตรวจสอบกับนักศึกษาจริงมาแล้ว</h2>
          <p className="lede">ทีมสัมภาษณ์นักศึกษา 13 คนทางโทรศัพท์เมื่อวันที่ {RESEARCH.date} ก่อนลงมือสร้าง SkillPath</p>

          <div className="statrow">
            <div className="statcard">
              <div className="n mono">{RESEARCH.unsureCount}/{RESEARCH.interviewed}</div>
              <div className="l">นักศึกษาไม่มั่นใจสิ่งที่ตัวเองเตรียมตัวอยู่ — คิดเป็นราว {RESEARCH.unsurePct}%</div>
            </div>
            <div className="statcard">
              <div className="n mono">{RESEARCH.majorBreakdown[0][1]}%</div>
              <div className="l">ของผู้ให้สัมภาษณ์เรียน{RESEARCH.majorBreakdown[0][0]} ส่วนที่เหลือกระจายในสาขาอื่น</div>
            </div>
            <div className="statcard">
              <div className="n mono">{RESEARCH.validated}</div>
              <div className="l">validated users ที่ยืนยันปัญหานี้ตรงกับที่เจอจริง</div>
            </div>
          </div>

          <div className="persona">
            <div className="pic">{P.name[0]}</div>
            <div className="ptxt">
              <b>{P.name} — {P.year} {P.major} อยากเป็น {P.goalLabel}</b>
              <ul className="beats">
                <li>{P.beat1}</li>
                <li>{P.beat2}</li>
                <li>{P.beat3}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <span className="kicker">SkillPath ทำงานอย่างไร</span>
          <h2>จากทักษะที่มองไม่เห็น สู่แผนรายวิชาที่ทำได้จริง</h2>
          <div className="steps">
            <div className="stepcard">
              <div className="sn mono">01</div>
              <h3>ตั้งโปรไฟล์ครั้งเดียว</h3>
              <p>บอกสาขา ปี และเทอมปัจจุบัน SkillPath จะรู้ทันทีว่าคุณเรียนอะไรไปแล้วบ้าง</p>
            </div>
            <div className="stepcard">
              <div className="sn mono">02</div>
              <h3>เลือกอาชีพที่อยากได้</h3>
              <p>ดูเปอร์เซ็นต์ความครอบคลุม ถ่วงน้ำหนักด้วยจำนวนประกาศงานจริงที่ระบุแต่ละทักษะ</p>
            </div>
            <div className="stepcard">
              <div className="sn mono">03</div>
              <h3>กดดูหลักฐานทุกตัวเลข</h3>
              <p>ทุกทักษะกดเข้าไปดูประกาศงานต้นทางได้ และเห็นจุดที่หลักสูตรสอนแล้วแต่ใช้คำอื่น</p>
            </div>
            <div className="stepcard">
              <div className="sn mono">04</div>
              <h3>ทำตามแผนที่เหลือ</h3>
              <p>วิชาเทอมหน้าที่ควรลง สิ่งที่ต้องทำเอง และสิ่งที่ต้องได้จากงานจริงเท่านั้น — แยกให้ชัดเจน</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="trustband">
            <div className="tb-txt">
              <h3>ตรงไปตรงมาแม้ตอนที่ข้อมูลไม่พอ</h3>
              <p>
                ตำแหน่งงานที่มีประกาศระดับ junior ต่ำกว่า 30 รายการ — เช่น Solutions Architect — SkillPath
                จะไม่แสดงเปอร์เซ็นต์ความครอบคลุม เพราะตัวอย่างเล็กเกินกว่าจะฟันธง เราเลือกความน่าเชื่อถือมากกว่าตัวเลขที่ดูสวย
              </p>
            </div>
            <Link className="cta" href="/explore?role=sa">
              ดูตัวอย่างนี้ →
            </Link>
          </div>
        </div>
      </section>

      <footer className="sitefoot">
        <div className="wrap">
          <div className="fcol" style={{ flex: 1.4, minWidth: 240 }}>
            <span className="brand">
              เส้นทาง<span>ทักษะ</span>
            </span>
            <p className="fnote" style={{ marginTop: 12 }}>
              แพลตฟอร์มที่แปลรายวิชาในหลักสูตรให้เป็นภาษาที่ตลาดงานเข้าใจ พัฒนาต่อยอดจากต้นแบบทีม 4WARDERS สำหรับ
              Generation Thailand Hackathon 2026 โจทย์ที่ 1
            </p>
          </div>
          <div className="fcol">
            <h4>แพลตฟอร์ม</h4>
            <Link href="/onboarding">เริ่มต้นใช้งาน</Link>
            <Link href="/explore">สำรวจอาชีพ</Link>
            <Link href="/curriculum">หลักสูตรทั้งหมด</Link>
            <Link href="/about">เกี่ยวกับ / วิธีคำนวณ</Link>
          </div>
          <div className="fcol">
            <h4>ขอบเขตข้อมูล</h4>
            <p className="fnote">
              หลักสูตร = เอกสารจริง (มธ. ปรับปรุง 2566)
              <br />
              ประกาศงาน = ชุดข้อมูลตัวอย่างสำหรับสาธิต UI
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
