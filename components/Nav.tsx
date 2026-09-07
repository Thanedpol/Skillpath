"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profileGoalLabel, profileMajorLabel, termLabel, useProfile } from "@/lib/profile";

const LINKS: [string, string][] = [
  ["/", "หน้าแรก"],
  ["/explore", "สำรวจอาชีพ"],
  ["/curriculum", "หลักสูตร"],
  ["/about", "เกี่ยวกับ"],
];

export default function Nav() {
  const pathname = usePathname();
  const { profile, hasProfile, ready } = useProfile();
  const goalLabel = profileGoalLabel(profile);
  /* ข้อความเต็มไว้ให้ tooltip เมื่อบรรทัดถูกตัดท้าย */
  const whoTitle = [profileMajorLabel(profile), termLabel(profile.ord), goalLabel ? `เป้าหมาย ${goalLabel}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link className="brand" href="/">
          เส้นทาง<span>ทักษะ</span>
        </Link>
        <nav className="navlinks">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <span className="tag">หลักสูตรจริง · ประกาศงานตัวอย่าง</span>
        <span className="who">
          {!ready ? null : hasProfile ? (
            <>
              {/* สรุปโปรไฟล์อยู่บรรทัดเดียวเสมอ ตัดท้ายด้วย … เมื่อจอแคบ —
                  เดิมข้อความยาวนี้ดันแถบบนให้ขึ้นสองถึงสามบรรทัด */}
              <span className="whoinfo" title={whoTitle}>
                <b>{profileMajorLabel(profile)}</b>&nbsp;·&nbsp;{termLabel(profile.ord)}
                {goalLabel ? (
                  <>
                    &nbsp;·&nbsp;เป้าหมาย <b>{goalLabel}</b>
                  </>
                ) : null}
              </span>
              <Link href="/onboarding">แก้ไขโปรไฟล์</Link>
            </>
          ) : (
            <Link href="/onboarding">ตั้งค่าโปรไฟล์ →</Link>
          )}
        </span>
      </div>
    </header>
  );
}
