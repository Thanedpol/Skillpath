"use server";

import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";

/* Public write — no assertAdmin() here on purpose, this is the anonymous
   "ตรง/ไม่ตรง" vote from any visitor, mirrors the old public-insert RLS
   policy. Called best-effort from lib/feedback.ts; failures are swallowed
   there so a DB hiccup never blocks the localStorage-backed UI. */
export async function submitFeedback(skillKey: string, vote: "up" | "down", clientId: string, page?: string) {
  await db.insert(feedback).values({
    skill_key: skillKey,
    vote,
    client_id: clientId || null,
    page: page || null,
  });
}
