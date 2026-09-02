"use client";
/* ============================================================
   SkillPath — profile engine (ported from assets/data.js)
   ทุกเปอร์เซ็นต์ในแอปมาจาก route()/getSkillState() ที่เดียว
   ถ่วงน้ำหนักด้วยจำนวนประกาศงานที่ระบุทักษะนั้น ไม่ใช่นับทักษะเท่ากันหมด
   ============================================================ */
import { useCallback, useEffect, useState } from "react";
import { COURSES, DEMAND, MAJORS, ROLES, SK, TERMS } from "./data";
import type { DemandPair, Profile, RouteResult, SkillResolved } from "./types";

export const PROFILE_KEY = "skillpath.profile.v1";
export const DEFAULT_PROFILE: Profile = { major: "cs-tu", ord: 31, overrides: {}, goalRole: null };

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p.ord !== "number") return null;
    return { major: p.major || "cs-tu", ord: p.ord, overrides: p.overrides || {}, goalRole: p.goalRole || null };
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function hasSavedProfile(): boolean {
  return !!loadProfile();
}

export function termLabel(ord: number): string {
  const t = TERMS.find((x) => x.ord === ord);
  return t ? `${t.y} · ${t.t}` : "";
}

export function majorName(id: string): string {
  const m = MAJORS.find((x) => x.id === id);
  return m ? m.name : "วิทยาการคอมพิวเตอร์";
}

/* ------------------------------------------------------------
   สถานะของแต่ละทักษะ คำนวณจากโปรไฟล์ปัจจุบัน แทนที่จะฝังค่าตายตัว
   วิชาที่ ord < ตำแหน่งปัจจุบัน = เรียนจบแล้ว · ord เท่ากัน = กำลังเรียน
   (ยกเว้นทักษะที่ทำเครื่องหมาย earlyInTerm ไว้ = นับว่าได้แล้วตั้งแต่เทอมนั้น)
   ord มากกว่า = ยังไม่ถึง · ผู้ใช้ override รายวิชาเองได้
   ------------------------------------------------------------ */
export function getSkillState(key: string, profile: Profile): SkillResolved {
  const m = SK[key];
  if (!m) return { st: "none", kind: "course", note: "ไม่มีวิชาไหนในหลักสูตรสอน" };
  if (m.kind === "work" || !m.code) return { ...m, st: "none" };
  const c = COURSES[m.code];
  if (!c) return { ...m, st: "none", kind: "course" };
  const ov = (profile.overrides || {})[m.code];
  let done: boolean;
  let current: boolean;
  if (typeof ov === "boolean") {
    done = ov;
    current = !ov && c.ord === profile.ord;
  } else if (c.ord < profile.ord) {
    done = true;
    current = false;
  } else if (c.ord === profile.ord) {
    done = !!m.earlyInTerm;
    current = !done;
  } else {
    done = false;
    current = false;
  }
  if (done) {
    if (m.partial) return { ...m, st: "progress" };
    return { ...m, st: m.hidden ? "hidden" : "covered" };
  }
  if (current) return { ...m, st: "progress" };
  return { ...m, st: "available", cname: c.name, term: c.when };
}

export function isCourseDone(code: string, profile: Profile): boolean {
  const c = COURSES[code];
  if (!c) return false;
  const ov = (profile.overrides || {})[code];
  return typeof ov === "boolean" ? ov : c.ord < profile.ord;
}

/* ------------------------------------------------------------
   route(): ทุกเปอร์เซ็นต์ในแอปมาจากฟังก์ชันนี้ที่เดียว
   ------------------------------------------------------------ */
export function route(roleId: string, profile: Profile): RouteResult | null {
  const r = ROLES.find((x) => x.id === roleId);
  const jr = (DEMAND[roleId] || {}).jr || [];
  if (!r || !jr.length) return null;
  const tot = jr.reduce((a, [, n]) => a + n, 0);
  const denom = r.jrPosts;
  const meta = (k: string) => getSkillState(k, profile);
  const done = jr.filter(([k]) => meta(k).st === "covered" || meta(k).st === "hidden");
  const hid = jr.filter(([k]) => meta(k).st === "hidden");
  const now = jr.filter(([k]) => meta(k).st === "progress");
  const next = jr.filter(([k]) => meta(k).st === "available");
  const outAll = jr.filter(([k, n]) => meta(k).kind === "course" && meta(k).st === "none" && n / denom >= 0.25);
  const out = outAll.slice(0, 3);
  const more = outAll.slice(3);
  const opt = jr.filter(([k, n]) => meta(k).kind === "course" && meta(k).st === "none" && n / denom < 0.25);
  const stuck = jr.filter(([k]) => meta(k).kind === "work");
  const sum = (a: DemandPair[]) => a.reduce((x, [, n]) => x + n, 0);
  const seg: Record<string, number> = {
    done: sum(done), now: sum(now), next: sum(next), out: sum(out), opt: sum(more) + sum(opt), stuck: sum(stuck)
  };
  const keys = ["done", "now", "next", "out", "opt", "stuck"];
  const raw = keys.map((k) => (seg[k] / tot) * 100);
  const fl = raw.map(Math.floor);
  const P: Record<string, number> = {};
  keys.forEach((k, i) => { P[k] = fl[i]; });
  raw
    .map((v, i): [number, number] => [v - fl[i], i])
    .sort((a, b) => b[0] - a[0])
    .slice(0, 100 - fl.reduce((a, b) => a + b, 0))
    .forEach(([, i]) => { P[keys[i]]++; });
  return { tot, denom, done, hid, now, next, out, more, opt, stuck, seg, P, pct: (n: number) => Math.round((n / tot) * 100) };
}

export function roleCoverage(roleId: string, profile: Profile): number | null {
  const R = route(roleId, profile);
  return R ? R.P.done + R.P.now : null;
}

/* ============================================================
   useProfile — React hook wrapping localStorage
   โหลดจริงหลัง mount (client-only) แล้วจึงคืนโปรไฟล์จริง —
   ก่อนหน้านั้นคืนค่า DEFAULT_PROFILE (ตรงกับ HTML ที่ server render)
   ============================================================ */
export function useProfile() {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfileState(loadProfile());
    setReady(true);
  }, []);

  const save = useCallback((p: Profile) => {
    saveProfile(p);
    setProfileState(p);
  }, []);

  return { profile: profile ?? DEFAULT_PROFILE, hasProfile: !!profile, ready, save };
}
