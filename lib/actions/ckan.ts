"use server";

import { auth } from "@/auth";
import { datastoreSearch, type CkanError, type CkanResult } from "@/lib/ckan";

export async function fetchCkanPreview(formData: FormData): Promise<CkanResult | CkanError> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "ไม่ได้เข้าสู่ระบบ — กรุณาเข้าสู่ระบบใหม่" };

  return datastoreSearch({
    resourceId: String(formData.get("resource_id") || ""),
    limit: Number(formData.get("limit") || 20),
    q: String(formData.get("q") || ""),
  });
}
