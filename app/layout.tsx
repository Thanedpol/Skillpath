import type { Metadata } from "next";
import { Bai_Jamjuree, IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Bai_Jamjuree({
  weight: ["500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans_Thai({
  weight: ["400", "500", "600"],
  subsets: ["thai", "latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SkillPath — เส้นทางทักษะ",
    template: "%s — SkillPath",
  },
  description:
    "AI ที่แปลสิ่งที่คุณเรียนให้เป็นภาษาที่ตลาดงานเข้าใจ · แพลตฟอร์มโดยทีม 4WARDERS — Generation Thailand Hackathon 2026 โจทย์ที่ 1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
