"use client";
/* ============================================================
   feedback — "การจับคู่นี้แม่นไหม" ต่อทักษะ
   เก็บในเครื่องผู้ใช้ (ให้ UI ตอบสนองทันที) + ส่งขึ้น Supabase แบบ
   best-effort เพื่อให้ทีมเห็นภาพรวมทั้งหมดในหน้า /admin/feedback —
   ถ้ายังไม่ตั้งค่า Supabase หรือเน็ตหลุด จะ fail เงียบ ๆ ไม่กระทบ UI
   ปิดลูป Human-in-the-loop ที่ deck ระบุไว้
   ============================================================ */
import { useCallback, useEffect, useState } from "react";
import { createClient } from "./supabase/client";

export const FEEDBACK_KEY = "skillpath.feedback.v1";
export const CLIENT_ID_KEY = "skillpath.clientId.v1";
export type FeedbackVote = "up" | "down";

export function loadFeedback(): Record<string, FeedbackVote> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "{}");
  } catch {
    return {};
  }
}

function getClientId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function saveFeedbackVote(skillKey: string, value: FeedbackVote, page?: string) {
  if (typeof window === "undefined") return;
  const all = loadFeedback();
  all[skillKey] = value;
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));

  try {
    const supabase = createClient();
    supabase
      .from("feedback")
      .insert({ skill_key: skillKey, vote: value, client_id: getClientId(), page: page || null })
      .then(
        () => {},
        () => {}
      );
  } catch {
    // Supabase env vars not configured yet, or offline — localStorage already saved above
  }
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
