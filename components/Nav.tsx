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
              <b>{profileMajorLabel(profile)}</b>&nbsp;·&nbsp;{termLabel(profile.ord)}
              {goalLabel ? (
                <>
                  &nbsp;·&nbsp;เป้าหมาย <b>{goalLabel}</b>
                </>
              ) : null}{" "}
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
