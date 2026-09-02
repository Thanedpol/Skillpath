"use client";

import Link from "next/link";
import { useFeedback } from "@/lib/feedback";

export default function TrustPanel({ skillKey, page }: { skillKey: string; page?: string }) {
  const { vote, castVote } = useFeedback(skillKey, page);

  return (
    <div className="trustpanel">
      <p className="tp-note">
        การจับคู่ทักษะนี้จัดทำโดยทีมงานโดยตรง ไม่ใช่ผลจากโมเดลอัตโนมัติ — ในเวอร์ชันเต็มจะผ่านการตรวจสอบร่วมกับผู้เชี่ยวชาญอุตสาหกรรมและ
        LLM-as-judge ก่อนแสดงผลทุกครั้ง (<Link href="/about">อ่านวิธีคำนวณ</Link>)
      </p>
      <div className="tp-vote">
        <span className="tp-q">การจับคู่นี้ตรงกับสิ่งที่คุณเจอจริงไหม</span>
        <div className="tp-btns">
          <button type="button" className="tp-btn" aria-pressed={vote === "up"} onClick={() => castVote("up")}>
            ตรง
          </button>
          <button type="button" className="tp-btn" aria-pressed={vote === "down"} onClick={() => castVote("down")}>
            ไม่ตรง
          </button>
        </div>
      </div>
      {vote ? (
        <p className="tp-thanks">บันทึกฟีดแบ็กแล้ว — ส่งให้ทีมงานดูภาพรวมได้ (ไม่ผูกกับตัวตนคุณ) ใช้ปรับปรุงการจับคู่ในเวอร์ชันถัดไป</p>
      ) : null}
    </div>
  );
}
