"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: [string, string][] = [
  ["/admin", "ภาพรวม"],
  ["/admin/majors", "สาขา"],
  ["/admin/courses", "รายวิชา"],
  ["/admin/skills", "ทักษะ"],
  ["/admin/roles", "อาชีพ + ความต้องการ"],
  ["/admin/feedback", "ฟีดแบ็กผู้ใช้"],
];

export default function AdminNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav">
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
