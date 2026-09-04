/* One-off: seed the Neon database from the current lib/data.ts so it starts
   out byte-identical to the static data the public pages already use.
   Run with: npx tsx scripts/seed.ts (reads DATABASE_URL from .env.local) */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { courses, demand, faculties, feedback, majors, roles, skills, universities } from "../lib/db/schema";
import * as schema from "../lib/db/schema";
import { COURSES_BY_MAJOR, DEMAND, FACULTIES, MAJORS, ROLES, SK_BY_MAJOR, UNIVERSITIES } from "../lib/data";

// standalone connection — lib/db/index.ts imports "server-only", which
// throws unconditionally outside Next.js's bundler, so this script can't use it
const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

async function main() {
  console.log("Clearing existing rows…");
  await db.delete(demand);
  await db.delete(feedback);
  await db.delete(skills);
  await db.delete(courses);
  await db.delete(roles);
  await db.delete(majors);
  await db.delete(faculties);
  await db.delete(universities);

  await db.insert(universities).values(
    UNIVERSITIES.map((u) => ({ id: u.id, name: u.name, short_name: u.shortName }))
  );

  await db.insert(faculties).values(
    FACULTIES.map((f) => ({ id: f.id, university_id: f.universityId, name: f.name, campus: f.campus ?? null }))
  );

  await db.insert(majors).values(
    MAJORS.map((m) => ({
      id: m.id,
      university_id: m.universityId,
      faculty_id: m.facultyId ?? null,
      name: m.name,
      ready: m.ready,
      note: m.note ?? null,
      curriculum_id: m.curriculumId ?? null,
      level: m.level ?? null,
      isced_field: m.iscedField ?? null,
      source: m.source ?? null,
    }))
  );

  const courseRows = Object.entries(COURSES_BY_MAJOR).flatMap(([major_id, cs]) =>
    Object.entries(cs).map(([code, c]) => ({ major_id, code, name: c.name, when_label: c.when, ord: c.ord }))
  );
  if (courseRows.length) await db.insert(courses).values(courseRows);

  const skillRows = Object.entries(SK_BY_MAJOR).flatMap(([major_id, sk]) =>
    Object.entries(sk).map(([key, m]) => ({
      major_id,
      key,
      code: m.code ?? null,
      note: m.note,
      alias: m.alias ?? null,
      src: m.src ?? null,
      hidden: !!m.hidden,
      early_in_term: !!m.earlyInTerm,
      partial: !!m.partial,
      kind: m.kind ?? null,
      proof: m.proof ?? null,
      act: m.act ?? null,
      time_estimate: m.time ?? null,
      route: m.route ?? null,
    }))
  );
  if (skillRows.length) await db.insert(skills).values(skillRows);

  await db.insert(roles).values(ROLES.map((r) => ({ id: r.id, name: r.name, posts: r.posts, jr_posts: r.jrPosts, fit: r.fit })));

  const demandRows = Object.entries(DEMAND).flatMap(([role_id, levels]) =>
    (["jr", "sr"] as const).flatMap((level) =>
      (levels[level] || []).map(([skill_key, count]) => ({ role_id, level, skill_key, count }))
    )
  );
  if (demandRows.length) await db.insert(demand).values(demandRows);

  console.log("Seeded:", {
    universities: UNIVERSITIES.length,
    faculties: FACULTIES.length,
    majors: MAJORS.length,
    courses: courseRows.length,
    skills: skillRows.length,
    roles: ROLES.length,
    demand: demandRows.length,
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
