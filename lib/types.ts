/* ============================================================
   SkillPath — shared type definitions
   ============================================================ */

export type SkillState = "covered" | "hidden" | "progress" | "available" | "none";

export interface SkillMeta {
  code?: string;
  note: string;
  alias?: string;
  src?: string;
  hidden?: boolean;
  earlyInTerm?: boolean;
  partial?: boolean;
  kind?: "course" | "work";
  proof?: string;
  act?: string;
  time?: string;
  route?: string;
}

export interface SkillResolved extends SkillMeta {
  st: SkillState;
  cname?: string;
  term?: string;
}

export interface Course {
  name: string;
  when: string;
  ord: number;
}

export interface Term {
  ord: number;
  y: string;
  t: string;
}

export interface Role {
  id: string;
  name: string;
  posts: number;
  jrPosts: number;
  fit: number;
}

export type DemandPair = [string, number];

export interface DemandLevels {
  jr: DemandPair[];
  sr: DemandPair[];
}

export interface Post {
  co: string;
  meta: string;
  q: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
}

export interface Faculty {
  id: string;
  universityId: string;
  name: string;
  campus?: string;
}

/* school ไม่ได้เก็บเป็นข้อความในสาขาอีกต่อไป — ประกอบขึ้นจาก
   คณะ + มหาวิทยาลัย ด้วย schoolLabel() ใน lib/data.ts เพื่อไม่ให้
   สาขาที่อยู่คณะเดียวกันเขียนชื่อคณะไม่ตรงกันอย่างที่เคยเป็น */
export interface Major {
  id: string;
  name: string;
  facultyId: string;
  ready: boolean;
  note?: string;
}

export interface Profile {
  major: string;
  ord: number;
  overrides: Record<string, boolean>;
  goalRole: string | null;
}

export interface RouteResult {
  tot: number;
  denom: number;
  done: DemandPair[];
  hid: DemandPair[];
  now: DemandPair[];
  next: DemandPair[];
  out: DemandPair[];
  more: DemandPair[];
  opt: DemandPair[];
  stuck: DemandPair[];
  seg: Record<string, number>;
  P: Record<string, number>;
  pct: (n: number) => number;
}

export interface ResearchPersona {
  name: string;
  year: string;
  major: string;
  goalRoleId: string;
  goalLabel: string;
  beat1: string;
  beat2: string;
  beat3: string;
}

export interface Research {
  interviewed: number;
  unsureCount: number;
  unsurePct: number;
  validated: number;
  date: string;
  majorBreakdown: [string, number][];
  persona: ResearchPersona;
}
