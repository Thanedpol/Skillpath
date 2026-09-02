"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Drawer from "@/components/Drawer";
import TrustPanel from "@/components/TrustPanel";
import { COURSES_BY_MAJOR, DEMAND, MAJORS, MIN_POSTS, POSTS, ROLES, SK_BY_MAJOR, STATE, postKeyFor, tally } from "@/lib/data";
import { getSkillState, roleCoverage, route as computeRoute, useProfile } from "@/lib/profile";
import type { DemandPair, Profile, SkillResolved } from "@/lib/types";

type Level = "jr" | "sr";
type Sort = "fit" | "dem";
type DrawerState = { skill: string; n: number; denom: number; roleName: string } | null;

function courseGroups(pairs: DemandPair[], major: string) {
  const sk = SK_BY_MAJOR[major] || {};
  const courses = COURSES_BY_MAJOR[major] || {};
  const g: Record<string, { code: string; skills: DemandPair[]; n: number }> = {};
  pairs.forEach(([k, n]) => {
    const code = sk[k]?.code || "__";
    if (!g[code]) g[code] = { code, skills: [], n: 0 };
    g[code].skills.push([k, n]);
    g[code].n += n;
  });
  return Object.values(g).sort(
    (a, b) => (courses[a.code]?.ord ?? 99) - (courses[b.code]?.ord ?? 99) || b.n - a.n
  );
}

function CourseBlock({ group, tone, profile, onOpen }: {
  group: { code: string; skills: DemandPair[]; n: number };
  tone: "t-done" | "t-now";
  profile: Profile;
  onOpen: (k: string, n: number) => void;
}) {
  const courses = COURSES_BY_MAJOR[profile.major] || {};
  const c = courses[group.code] || { name: "นอกหลักสูตร", when: "", ord: 0 };
  return (
    <div className={`crow ${tone}`}>
      <div className="ctop">
        <span className="code">{group.code === "__" ? "" : group.code}</span>
        <span className="cname">{c.name}</span>
        <span className="cwhen">{c.when}</span>
      </div>
      <div className="cskills">
        {group.skills.map(([k, n]) => {
          const m = getSkillState(k, profile);
          return (
            <button key={k} className="skchip" type="button" onClick={() => onOpen(k, n)}>
              {k} <span className="mono">{n}</span>
              {m.partial ? <span className="part">บางส่วน</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExploreInner() {
  const { profile, ready, hasProfile } = useProfile();
  const searchParams = useSearchParams();
  const qsRole = searchParams.get("role");

  const [currentSort, setCurrentSort] = useState<Sort>("fit");
  const [currentLevel, setCurrentLevel] = useState<Level>("jr");
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [view, setView] = useState<"browse" | "plan">("browse");
  const [showDetailMobile, setShowDetailMobile] = useState(false);
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [tipDismissed, setTipDismissed] = useState(false);

  useEffect(() => {
    setTipDismissed(sessionStorage.getItem("skillpath.tip.dismissed") === "1");
  }, []);

  useEffect(() => {
    if (!ready || currentRole) return;
    if (qsRole && ROLES.some((r) => r.id === qsRole)) {
      setCurrentRole(qsRole);
      return;
    }
    if (profile.goalRole && ROLES.some((r) => r.id === profile.goalRole)) {
      setCurrentRole(profile.goalRole);
      return;
    }
    const best = [...ROLES]
      .map((r) => ({ r, cov: roleCoverage(r.id, profile) }))
      .sort((a, b) => (b.cov ?? -1) - (a.cov ?? -1))[0];
    setCurrentRole(best.r.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, qsRole, currentRole]);

  const roleList = useMemo(() => {
    const withCov = ROLES.map((r) => ({ ...r, cov: roleCoverage(r.id, profile) }));
    return [...withCov].sort((a, b) =>
      currentSort === "fit" ? (b.cov ?? -1) - (a.cov ?? -1) : b.posts - a.posts
    );
  }, [profile, currentSort]);

  const role = ROLES.find((r) => r.id === currentRole) ?? null;
  const cov = role ? roleCoverage(role.id, profile) : null;
  const rows: DemandPair[] = role ? (DEMAND[role.id]?.[currentLevel] || []) : [];
  const denom = role ? (currentLevel === "jr" ? role.jrPosts : role.posts - role.jrPosts) : 0;
  const max = rows.length ? Math.max(...rows.map((x) => x[1])) : 1;

  function selectRole(id: string) {
    setCurrentRole(id);
    setCurrentLevel("jr");
    setShowDetailMobile(true);
  }

  function openDrawer(skill: string, n: number, denom: number) {
    setDrawer({ skill, n, denom, roleName: role?.name ?? "" });
  }

  const dismissBanner = () => {
    setTipDismissed(true);
    sessionStorage.setItem("skillpath.tip.dismissed", "1");
  };

  const nearby = role
    ? ROLES.filter((x) => x.id !== role.id && x.jrPosts >= MIN_POSTS).sort((a, b) => a.fit - b.fit).slice(0, 2)
    : [];

  const R = role ? computeRoute(role.id, profile) : null;
  const curriMajor = MAJORS.find((m) => m.id === profile.major);
  const curriMajorLabel = curriMajor ? `${curriMajor.name} (ปรับปรุง 2566) ${curriMajor.school}` : "หลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ (ปรับปรุง 2566) มธ.";

  return (
    <>
      {!tipDismissed && (
        <div id="howto">
          {!ready ? null : (
            <>
              {!hasProfile ? (
                <div style={{ flex: 1 }}>
                  <b>กำลังแสดงข้อมูลตัวอย่าง</b> — ปี 3 เทอม 1 วิทยาการคอมพิวเตอร์ (ยังไม่ได้ตั้งโปรไฟล์ของคุณ)
                  <br />
                  <span className="op">
                    ตั้งโปรไฟล์จริงของคุณเพื่อดูความครอบคลุมที่คำนวณจากรายวิชาที่คุณเรียนไปแล้วจริง ๆ ใช้เวลาไม่ถึงนาที
                  </span>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 15 }}>วิธีใช้ SkillPath</b>
                  <br />
                  <span className="op">
                    ลอง: ① เลือกอาชีพทางซ้าย ② กดที่ชื่อทักษะเพื่อดูประกาศงานต้นทาง ③ กด &quot;ดูแผนของฉัน&quot;
                    เพื่อดูเส้นทางรายวิชา ④ ลองกด <b>Solutions Architect</b> — ระบบจะปฏิเสธที่จะให้เปอร์เซ็นต์
                    เพราะข้อมูลไม่ถึงเกณฑ์
                  </span>
                  <br />
                  <span className="op2">
                    ฝั่งหลักสูตร = เอกสารจริง ({curriMajorLabel}) · ฝั่งประกาศงาน =
                    ชุดข้อมูลตัวอย่างสำหรับสาธิต UI
                  </span>
                </div>
              )}
              {!hasProfile ? (
                <Link className="cta" href="/onboarding">
                  ตั้งค่าโปรไฟล์ →
                </Link>
              ) : null}
              <button className="x" type="button" onClick={dismissBanner}>
                ปิด
              </button>
            </>
          )}
        </div>
      )}

      <Nav />

      {view === "browse" ? (
        <div id="s-browse">
          <div className="corpus">
            <div className="corpus-in">
              <div className="n mono">3,180</div>
              <div className="lbl">
                ประกาศงานจริงที่วิเคราะห์แล้ว ใน 90 วันล่าสุด — ทุกตัวเลขในหน้านี้<b> กดดูประกาศต้นทางได้</b>
              </div>
            </div>
          </div>

          <div className={`split${showDetailMobile ? " show-detail" : ""}`}>
            <div className="pane-list">
              <div className="listhead">
                <span className="listcount">
                  {roleList.length} ตำแหน่ง · เรียงตาม{currentSort === "fit" ? "ความใกล้เคียง" : "ความต้องการ"}
                </span>
                <div className="seg" role="group" aria-label="เรียงลำดับตำแหน่งงาน">
                  <button type="button" aria-pressed={currentSort === "fit"} onClick={() => setCurrentSort("fit")}>
                    ใกล้เคียงกับคุณ
                  </button>
                  <button type="button" aria-pressed={currentSort === "dem"} onClick={() => setCurrentSort("dem")}>
                    ความต้องการสูงสุด
                  </button>
                </div>
              </div>
              <ul className="rolelist" role="listbox" aria-label="ตำแหน่งงาน">
                {roleList.map((r) => (
                  <li key={r.id} role="presentation">
                    <button
                      className="rolecard"
                      role="option"
                      aria-selected={r.id === currentRole}
                      onClick={() => selectRole(r.id)}
                    >
                      <span className="rolename">
                        {r.name}
                        {r.id === profile.goalRole ? <span className="goalchip">เป้าหมายของคุณ</span> : null}
                      </span>
                      <span className="rolemeta">
                        <span className="mono">{r.posts.toLocaleString()}</span> ประกาศงาน ·{" "}
                        <span className="mono">{r.jrPosts}</span> ระดับ junior
                      </span>
                      {r.cov === null ? (
                        <span className="covbar">
                          <span className="covword">ข้อมูลระดับ junior ไม่พอประเมิน</span>
                        </span>
                      ) : (
                        <span className="covbar">
                          <span className="covtrack">
                            <span className="covfill" style={{ width: `${r.cov}%` }} />
                          </span>
                          <span className="covnum">{r.cov}%</span>
                          <span className="covword">ครอบคลุม</span>
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="listfoot">
                ความครอบคลุม คำนวณจากรายวิชาที่คุณเรียนจบและกำลังเรียน ถ่วงน้ำหนักด้วยจำนวนประกาศงานระดับ junior
                ที่ระบุทักษะนั้น
              </p>
            </div>

            <div className="pane-detail">
              <button className="detail-back" type="button" onClick={() => setShowDetailMobile(false)}>
                ← ตำแหน่งงานทั้งหมด
              </button>
              {role ? (
                <>
                  <div className="rolehead">
                    <div className="headrow">
                      <div>
                        <h1>{role.name}</h1>
                        <div className="sub">
                          <span className="mono">{role.posts.toLocaleString()}</span> ประกาศงาน ·{" "}
                          {cov === null ? "ยังประเมินความครอบคลุมไม่ได้" : (
                            <>
                              ความครอบคลุมของคุณ <span className="mono">{cov}%</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button className="cta" type="button" onClick={() => setView("plan")}>
                        ดูแผนของฉัน →
                      </button>
                    </div>
                  </div>
                  <div className="dpad">
                    <div className="levelrow">
                      <span className="sortlbl">ระดับตำแหน่ง</span>
                      <div className="seg" role="group" aria-label="ระดับตำแหน่ง">
                        <button type="button" aria-pressed={currentLevel === "jr"} onClick={() => setCurrentLevel("jr")}>
                          Junior
                        </button>
                        <button type="button" aria-pressed={currentLevel === "sr"} onClick={() => setCurrentLevel("sr")}>
                          Senior
                        </button>
                      </div>
                    </div>

                    {denom < MIN_POSTS || !rows.length ? (
                      <div className="noev">
                        <div className="nn">{denom}</div>
                        <p>
                          <b>ประกาศระดับ junior เท่านั้น</b> — ต่ำกว่าเกณฑ์ขั้นต่ำ {MIN_POSTS} ประกาศที่เราตั้งไว้
                          เราจึงไม่แสดงเปอร์เซ็นต์จากกลุ่มตัวอย่างขนาดนี้ เพราะตัวเลขจะดูแม่นยำเกินกว่าที่ข้อมูลรองรับ
                        </p>
                        <p>
                          ตำแหน่งนี้แทบไม่เปิดรับระดับเริ่มต้น กดดูระดับ <b>Senior</b> เพื่อเห็นว่าปลายทางต้องการอะไร
                        </p>
                        <div className="nearby">
                          ตำแหน่งใกล้เคียงที่มีข้อมูลพอให้อ้างอิง:
                          <br />
                          {nearby.map((x) => (
                            <button key={x.id} className="jump" type="button" onClick={() => selectRole(x.id)}>
                              {x.name} · {x.jrPosts} ประกาศ
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="tblhead">
                          <span>ทักษะ</span>
                          <span>ประกาศที่ต้องการ</span>
                          <span>สถานะของคุณ</span>
                        </div>
                        {rows.map(([k, n]) => {
                          const m: SkillResolved = getSkillState(k, profile);
                          const st = STATE[m.st];
                          const ticks = tally(n, max);
                          return (
                            <button key={k} className="skillrow" type="button" onClick={() => openDrawer(k, n, denom)}>
                              <span className="sk">{k}</span>
                              <span className="sknote">
                                {m.note}
                                {m.alias ? <em className="aliaschip">เอกสารใช้คำอื่น</em> : null}
                              </span>
                              <span className="tallywrap">
                                <span className="tally">
                                  {ticks.map((h, i) => (
                                    <i key={i} style={{ height: h }} />
                                  ))}
                                </span>
                                <span className="tallynum">{n}</span>
                              </span>
                              <span className="state">
                                <i className={`glyph ${st.g}`} />
                                <span>{st.t}</span>
                              </span>
                            </button>
                          );
                        })}
                      </>
                    )}

                    <p className="foot">
                      <b>ฝั่งหลักสูตร = เอกสารจริง</b> — หลักสูตร {curriMajorLabel} · รหัสวิชา ชื่อวิชา และถ้อยคำในคำอธิบายรายวิชา
                      ยกมาจากเอกสารต้นฉบับ ไม่ได้แต่งขึ้น
                      <br />
                      <b>ฝั่งประกาศงาน = ชุดข้อมูลตัวอย่าง</b> สำหรับสาธิต UI เท่านั้น ยังไม่ใช่ผลจากการวิเคราะห์ประกาศงานจริง
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <section className="planwrap">
          <button className="back" type="button" onClick={() => setView("browse")}>
            ← กลับไปหน้าตำแหน่งงาน
          </button>
          <div className="planhead">
            <h2>เส้นทางสู่ {role?.name}</h2>
            <p>ตั้งแต่วิชาที่คุณเรียนไปแล้ว จนถึงสิ่งที่ยังปิดไม่ได้ ทุกช่วงถ่วงน้ำหนักด้วยจำนวนประกาศงานที่ระบุทักษะนั้น</p>
          </div>

          {!R ? (
            <p className="empty">
              ยังไม่มีประกาศระดับ junior มากพอสำหรับตำแหน่งนี้ เราจึงยังไม่สร้างเส้นทาง — เลือกตำแหน่งใกล้เคียงจากหน้าก่อนหน้า
            </p>
          ) : (
            <PlanBody role={role!} R={R} profile={profile} onOpen={openDrawer} />
          )}

          <p className="foot">
            <b>ฝั่งหลักสูตร = เอกสารจริง</b> — หลักสูตร {curriMajorLabel} · รหัสวิชา ชื่อวิชา และถ้อยคำในคำอธิบายรายวิชา
            ยกมาจากเอกสารต้นฉบับ ไม่ได้แต่งขึ้น
            <br />
            <b>ฝั่งประกาศงาน = ชุดข้อมูลตัวอย่าง</b> สำหรับสาธิต UI เท่านั้น ยังไม่ใช่ผลจากการวิเคราะห์ประกาศงานจริง
          </p>
        </section>
      )}

      <Drawer
        open={!!drawer}
        onClose={() => setDrawer(null)}
        title={drawer?.skill ?? ""}
        subtitle={drawer ? `${drawer.n} จาก ${drawer.denom} ประกาศ · ${Math.round((drawer.n / drawer.denom) * 100)}% · ${drawer.roleName}` : ""}
      >
        {drawer ? <DrawerBody skill={drawer.skill} n={drawer.n} major={profile.major} /> : null}
      </Drawer>
    </>
  );
}

function DrawerBody({ skill, n, major }: { skill: string; n: number; major: string }) {
  const key = postKeyFor(skill);
  const posts = key ? POSTS[key] : null;
  const m = (SK_BY_MAJOR[major] || {})[skill];

  return (
    <>
      {m?.alias ? (
        <div className="aliasbox">
          <b>ฝั่งหลักสูตรเขียนคนละคำ</b>
          <br />
          {m.alias}
          {m.src ? (
            <>
              <br />
              <span style={{ fontSize: 11.5, opacity: 0.8 }}>ที่มา: {m.src}</span>
            </>
          ) : null}
        </div>
      ) : null}
      {!posts ? (
        <div className="dnone">
          เดโมนี้ยังไม่ได้เตรียมตัวอย่างประกาศของทักษะนี้
          <br />
          <span>เราเลือกไม่แสดงข้อความของทักษะอื่นมาแทน — ในระบบจริงทุกทักษะจะมีประกาศต้นทางของตัวเอง</span>
        </div>
      ) : (
        <>
          {posts.map((p, i) => (
            <div className="post" key={i}>
              <div className="postco">{p.co}</div>
              <div className="postmeta">{p.meta}</div>
              <div className="postq" dangerouslySetInnerHTML={{ __html: p.q }} />
            </div>
          ))}
          <div className="dnote">
            แสดง 3 จาก {n} ประกาศ · ในระบบจริงทุกข้อความจะยกมาจากประกาศต้นทางโดยไม่เขียนใหม่ — ตัวอย่างในเดโมนี้เป็นข้อความจำลอง
          </div>
        </>
      )}
      <TrustPanel skillKey={skill} page="explore" />
    </>
  );
}

function PlanBody({ role, R, profile, onOpen }: {
  role: { id: string; name: string };
  R: NonNullable<ReturnType<typeof computeRoute>>;
  profile: Profile;
  onOpen: (k: string, n: number, denom: number) => void;
}) {
  const { P, pct } = R;
  const reach = {
    done: P.done,
    now: P.done + P.now,
    next: P.done + P.now + P.next,
    out: P.done + P.now + P.next + P.out,
  };
  const majorCourses = COURSES_BY_MAJOR[profile.major] || {};
  const doneG = courseGroups(R.done, profile.major);
  const nowG = courseGroups(R.now, profile.major);
  const nextG = courseGroups(R.next, profile.major);

  return (
    <>
      <div className="meterwrap">
        <div className="meterbar">
          <span className="m m-done" style={{ width: `${P.done}%` }} />
          <span className="m m-now" style={{ width: `${P.now}%` }} />
          <span className="m m-next" style={{ width: `${P.next}%` }} />
          <span className="m m-out" style={{ width: `${P.out}%` }} />
          <span className="m m-opt" style={{ width: `${P.opt}%` }} />
          <span className="m m-stuck" style={{ width: `${P.stuck}%` }} />
        </div>
        <div className="meterkeys">
          <span><i className="k m-done" />เรียนมาแล้ว {P.done}%</span>
          <span><i className="k m-now" />กำลังเรียน {P.now}%</span>
          <span><i className="k m-next" />เทอมหน้า {P.next}%</span>
          <span><i className="k m-out" />ทำเอง {P.out}%</span>
          <span><i className="k m-opt" />ยังไม่อยู่ในแผน {P.opt}%</span>
          <span><i className="k m-stuck" />ต้องได้จากงานจริง {P.stuck}%</span>
        </div>
        <p className="meterline">
          วันนี้คุณอยู่ที่ <b className="mono">{reach.now}%</b> ของสิ่งที่ประกาศงานระดับ junior ตำแหน่งนี้ขอ
          ทำตามเส้นทางนี้จนครบจะถึง <b className="mono">{reach.out}%</b>
          <br />
          ที่เหลือแยกเป็นสองส่วน — <b className="mono">{P.opt}%</b> เป็นทักษะที่ปรากฏต่ำกว่าเกณฑ์ 25%
          เราจึงไม่ใส่ในแผน แต่ทำเพิ่มได้ถ้ามีเวลา และ <b className="mono">{P.stuck}%</b> ที่การเรียนไม่ช่วย
          ต้องได้จากการทำงานจริง
        </p>
      </div>

      <ol className="route">
        <li className="stage s-done">
          <span className="node" />
          <div className="stagehead">
            <h3>เรียนมาแล้ว</h3>
            <span className="stagepct mono">ถึงตรงนี้ {reach.done}%</span>
          </div>
          <p className="stagesub">
            {doneG.length
              ? "วิชาที่เรียนจบไปแล้วและตรงกับสิ่งที่ประกาศงานตำแหน่งนี้ขอ กดที่ทักษะเพื่อดูว่าประกาศไหนขอบ้าง"
              : "ยังไม่มีวิชาที่เรียนจบแล้วตรงกับตำแหน่งนี้ — เส้นทางเริ่มจากศูนย์"}
          </p>
          {doneG.map((g) => (
            <CourseBlock key={g.code} group={g} tone="t-done" profile={profile} onOpen={(k, n) => onOpen(k, n, R.denom)} />
          ))}
        </li>

        <li className="stage s-now">
          <span className="node" />
          <div className="stagehead">
            <h3>กำลังเรียน / ได้มาบางส่วน</h3>
            <span className="stagepct mono">ถึงตรงนี้ {reach.now}%</span>
          </div>
          <p className="stagesub">
            {nowG.length
              ? 'วิชาที่เรียนอยู่เทอมนี้ จบแล้วนับเป็นของคุณ · ส่วนที่ทำเครื่องหมาย บางส่วน คือวิชาที่เรียนจบแล้วแต่ครอบคลุมทักษะนั้นไม่เต็ม'
              : "เทอมนี้ไม่มีวิชาที่เพิ่มความครอบคลุมของตำแหน่งนี้"}
          </p>
          {nowG.map((g) => (
            <CourseBlock key={g.code} group={g} tone="t-now" profile={profile} onOpen={(k, n) => onOpen(k, n, R.denom)} />
          ))}
        </li>

        <li className="stage s-next">
          <span className="node" />
          <div className="stagehead">
            <h3>ลงทะเบียนเทอมหน้า</h3>
            <span className="stagepct mono">ถึงตรงนี้ {reach.next}%</span>
          </div>
          <p className="stagesub">
            {nextG.length
              ? "จุดที่คุณยังตัดสินใจได้ เรียงจากจำนวนประกาศที่ปิดได้ต่อหน่วยกิต"
              : "ไม่มีวิชาในหลักสูตรที่ปิดช่องว่างของตำแหน่งนี้ได้ — ข้ามไปสองกลุ่มถัดไป"}
          </p>
          {nextG.slice(0, 4).map((g) => {
            const c = majorCourses[g.code];
            const top = g.skills[0];
            return (
              <div className="item" key={g.code}>
                <div className="itemtop">
                  <span className="code">{g.code}</span>
                  <span className="itemname">{c?.name ?? ""}</span>
                  <span className="chip">3 หน่วยกิต · {c?.when ?? ""}</span>
                </div>
                <p>ปิดช่องว่าง: {g.skills.map(([k]) => k).join(" · ")}</p>
                <div className="why">
                  เพิ่มความครอบคลุมอีก <span className="mono">{pct(g.n)}%</span> — คิดจาก{" "}
                  <span className="mono">{g.n}</span> ครั้งที่ประกาศระดับ junior ระบุทักษะกลุ่มนี้
                </div>
                <button className="evlink" type="button" onClick={() => onOpen(top[0], top[1], R.denom)}>
                  ดูประกาศงานที่ระบุ {top[0]}
                </button>
              </div>
            );
          })}
        </li>

        <li className="stage s-out">
          <span className="node" />
          <div className="stagehead">
            <h3>นอกหลักสูตร · ทำเองได้</h3>
            <span className="stagepct mono">ถึงตรงนี้ {reach.out}%</span>
          </div>
          <p className="stagesub">
            {R.out.length ? "ไม่มีวิชาไหนสอน แต่ยังปิดได้ก่อนจบ ถ้าลงมือทำเอง" : "ไม่มีทักษะนอกหลักสูตรที่ปรากฏถึง 25% ของประกาศ"}
          </p>
          {R.out.map(([k, n]) => {
            const m = getSkillState(k, profile);
            return (
              <div className="item alert" key={k}>
                <div className="itemtop">
                  <span className="itemname">{k}</span>
                  <span className="chip">{Math.round((n / R.denom) * 100)}% ของประกาศ</span>
                </div>
                <div className="why">{m.proof || "ประกาศระบุทักษะนี้บ่อย แต่ไม่มีรายวิชาไหนในหลักสูตรครอบคลุม"}</div>
                {m.act ? (
                  <div className="act">
                    <b>ทำ:</b>
                    <span>{m.act}</span>
                  </div>
                ) : null}
                {m.time ? (
                  <div className="act">
                    <b>ใช้เวลา:</b>
                    <span>{m.time}</span>
                  </div>
                ) : null}
                <button className="evlink" type="button" onClick={() => onOpen(k, n, R.denom)}>
                  ดูประกาศงาน {n} รายการ
                </button>
              </div>
            );
          })}
          {R.more.length ? (
            <p className="optnote">
              อยู่นอก 3 อันดับแรกที่แสดง แต่ยังสูงกว่าเกณฑ์ 25% — ทำได้เองเหมือนกัน:
              {R.more.map(([k, n]) => (
                <button key={k} className="skchip quiet" type="button" onClick={() => onOpen(k, n, R.denom)}>
                  {k} <span className="mono">{Math.round((n / R.denom) * 100)}%</span>
                </button>
              ))}
            </p>
          ) : null}
          {R.opt.length ? (
            <p className="optnote">
              ยังไม่อยู่ในแผน เพราะปรากฏต่ำกว่า 25% ของประกาศ:
              {R.opt.map(([k, n]) => (
                <button key={k} className="skchip quiet" type="button" onClick={() => onOpen(k, n, R.denom)}>
                  {k} <span className="mono">{n}</span>
                </button>
              ))}
            </p>
          ) : null}
        </li>

        <li className="stage s-stuck">
          <span className="node" />
          <div className="stagehead">
            <h3>ปิดไม่ได้ก่อนเรียนจบ</h3>
          </div>
          <p className="stagesub">
            {R.stuck.length ? (
              <>
                <b className="mono">{P.stuck}%</b> สุดท้ายที่การเรียนเพิ่มไม่ช่วย — ต้องได้จากการอยู่ในงานจริงเท่านั้น
              </>
            ) : (
              "ทักษะทั้งหมดของตำแหน่งนี้ปิดได้ก่อนจบ ซึ่งพบไม่บ่อย"
            )}
          </p>
          {R.stuck.map(([k, n]) => {
            const m = getSkillState(k, profile);
            return (
              <div className="item hard" key={k}>
                <div className="itemtop">
                  <span className="itemname">{k}</span>
                  <span className="chip">{Math.round((n / R.denom) * 100)}% ของประกาศ</span>
                </div>
                <div className="why">{m.note}</div>
                <div className="act">
                  <b>เส้นทางจริง:</b>
                  <span>{m.route || "ต้องได้จากการอยู่ในสถานการณ์ทำงานจริง"}</span>
                </div>
              </div>
            );
          })}
        </li>
      </ol>
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreInner />
    </Suspense>
  );
}
