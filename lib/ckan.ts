import "server-only";

/* ============================================================
   CKAN Data API (data.go.th) — ตัวเรียกฝั่งเซิร์ฟเวอร์อย่างเดียว
   API key ส่งผ่าน header ชื่อ "api-key" (ยืนยันจากการทดสอบ: ไม่ส่ง header
   จะได้ "No API key found in request" ส่วนส่งผิดค่าได้ "Invalid
   authentication credentials") — คีย์ต้องไม่หลุดไปฝั่ง browser
   ============================================================ */

const BASE = "https://opend.data.go.th/get-ckan";

export type CkanField = { id: string; type: string };

export type CkanResult = {
  ok: true;
  total: number;
  fields: CkanField[];
  records: Record<string, unknown>[];
};

export type CkanError = { ok: false; error: string };

export function hasApiKey(): boolean {
  return !!process.env.DATA_GO_TH_API_KEY;
}

/* ดึงข้อมูลจาก datastore_search — resourceId คือรหัส resource ในหน้า dataset
   ของ data.go.th (ช่อง resource_id ในตัวอย่างโค้ดของแต่ละชุดข้อมูล) */
export async function datastoreSearch(opts: {
  resourceId: string;
  limit?: number;
  offset?: number;
  q?: string;
}): Promise<CkanResult | CkanError> {
  const apiKey = process.env.DATA_GO_TH_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "ยังไม่ได้ตั้งค่า DATA_GO_TH_API_KEY — ขอ API key ที่ data.go.th แล้วใส่ใน .env.local" };
  }
  if (!opts.resourceId.trim()) {
    return { ok: false, error: "กรุณาระบุ resource_id" };
  }

  const url = new URL(`${BASE}/datastore_search`);
  url.searchParams.set("resource_id", opts.resourceId.trim());
  url.searchParams.set("limit", String(Math.min(Math.max(opts.limit ?? 20, 1), 100)));
  if (opts.offset) url.searchParams.set("offset", String(opts.offset));
  if (opts.q?.trim()) url.searchParams.set("q", opts.q.trim());

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "api-key": apiKey },
      // ข้อมูลเปิดเปลี่ยนไม่บ่อย แต่ตอนสำรวจอยากเห็นของสดเสมอ
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, error: `เชื่อมต่อ data.go.th ไม่ได้: ${e instanceof Error ? e.message : "unknown"}` };
  }

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: `ตอบกลับไม่ใช่ JSON (HTTP ${res.status}): ${text.slice(0, 200)}` };
  }

  const body = json as {
    success?: boolean;
    message?: string;
    error?: unknown;
    result?: { total?: number; fields?: CkanField[]; records?: Record<string, unknown>[] };
  };

  if (body.message) return { ok: false, error: String(body.message) };
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
  if (body.success === false || !body.result) {
    return { ok: false, error: typeof body.error === "string" ? body.error : "API ตอบกลับว่าไม่สำเร็จ" };
  }

  return {
    ok: true,
    total: body.result.total ?? 0,
    fields: body.result.fields ?? [],
    records: body.result.records ?? [],
  };
}
