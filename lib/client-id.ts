"use client";

/* id นิรนามต่อเบราว์เซอร์ ใช้ผูกโหวตฟีดแบ็กและคำขอสาขา/อาชีพของคนเดียวกันเข้าด้วยกัน
   ไม่ผูกกับตัวตนจริงและไม่มีการล็อกอินฝั่งผู้ใช้ทั่วไป */
export const CLIENT_ID_KEY = "skillpath.clientId.v1";

export function getClientId(): string {
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
