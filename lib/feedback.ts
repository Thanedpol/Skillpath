"use client";
/* ============================================================
   feedback — "การจับคู่นี้แม่นไหม" ต่อทักษะ
   เก็บในเครื่องผู้ใช้ (ให้ UI ตอบสนองทันที) + ส่งขึ้น Neon ผ่าน Server
   Action แบบ best-effort เพื่อให้ทีมเห็นภาพรวมทั้งหมดในหน้า /admin/feedback —
   ถ้ายังไม่ตั้งค่า DB หรือเน็ตหลุด จะ fail เงียบ ๆ ไม่กระทบ UI
   ปิดลูป Human-in-the-loop ที่ deck ระบุไว้
   ============================================================ */
import { useCallback, useEffect, useState } from "react";
import { submitFeedback } from "./actions/feedback";
import { CLIENT_ID_KEY, getClientId } from "./client-id";

export const FEEDBACK_KEY = "skillpath.feedback.v1";
export { CLIENT_ID_KEY };
export type FeedbackVote = "up" | "down";

export function loadFeedback(): Record<string, FeedbackVote> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveFeedbackVote(skillKey: string, value: FeedbackVote, page?: string) {
  if (typeof window === "undefined") return;
  const all = loadFeedback();
  all[skillKey] = value;
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));

  submitFeedback(skillKey, value, getClientId(), page).then(
    () => {},
    () => {
      // DB not configured yet, or offline — localStorage already saved above
    }
  );
}

export function getFeedbackVote(skillKey: string): FeedbackVote | null {
  return loadFeedback()[skillKey] || null;
}

export function useFeedback(skillKey: string | null, page?: string) {
  const [vote, setVote] = useState<FeedbackVote | null>(null);

  useEffect(() => {
    setVote(skillKey ? getFeedbackVote(skillKey) : null);
  }, [skillKey]);

  const vote_ = useCallback(
    (value: FeedbackVote) => {
      if (!skillKey) return;
      saveFeedbackVote(skillKey, value, page);
      setVote(value);
    },
    [skillKey, page]
  );

  return { vote, castVote: vote_ };
}
