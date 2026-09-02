"use client";
/* ============================================================
   feedback — "การจับคู่นี้แม่นไหม" ต่อทักษะ เก็บในเครื่องผู้ใช้เท่านั้น
   ปิดลูป Human-in-the-loop ที่ deck ระบุไว้
   ============================================================ */
import { useCallback, useEffect, useState } from "react";

export const FEEDBACK_KEY = "skillpath.feedback.v1";
export type FeedbackVote = "up" | "down";

export function loadFeedback(): Record<string, FeedbackVote> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveFeedbackVote(skillKey: string, value: FeedbackVote) {
  if (typeof window === "undefined") return;
  const all = loadFeedback();
  all[skillKey] = value;
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
}

export function getFeedbackVote(skillKey: string): FeedbackVote | null {
  return loadFeedback()[skillKey] || null;
}

export function useFeedback(skillKey: string | null) {
  const [vote, setVote] = useState<FeedbackVote | null>(null);

  useEffect(() => {
    setVote(skillKey ? getFeedbackVote(skillKey) : null);
  }, [skillKey]);

  const vote_ = useCallback(
    (value: FeedbackVote) => {
      if (!skillKey) return;
      saveFeedbackVote(skillKey, value);
      setVote(value);
    },
    [skillKey]
  );

  return { vote, castVote: vote_ };
}
