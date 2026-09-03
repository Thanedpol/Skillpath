"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* เรียงตามลำดับชั้นข้อมูล: มหาวิทยาลัย → คณะ → สาขา → รายวิชา → ทักษะ
   แล้วค่อยตามด้วยฝั่งตลาดงาน (อาชีพ) และฟีดแบ็ก */
const GROUPS: { label: string; links: [string, string][] }[] = [
  {
    label: "หลักสูตร",
    links: [
      ["/admin/universities", "มหาวิทยาลัย"],
      ["/admin/faculties", "คณะ"],
      ["/admin/majors", "สาขา"],
      ["/admin/courses", "รายวิชา"],
      ["/admin/skills", "ทักษะ"],
    ],
  },
  {
    label: "ตลาดงาน",
    links: [["/admin/roles", "อาชีพ + ความต้องการ"]],
  },
  {
    label: "ผู้ใช้",
    links: [["/admin/feedback", "ฟีดแบ็กผู้ใช้"]],
  },
];

export default function AdminNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav">
      <Link href="/admin" aria-current={pathname === "/admin" ? "page" : undefined}>
        ภาพรวม
      </Link>
      {GROUPS.map((g) => (
        <div key={g.label} className="admin-navgroup">
          <span className="admin-navlabel">{g.label}</span>
          {g.links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
