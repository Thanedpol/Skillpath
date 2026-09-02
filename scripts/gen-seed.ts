/* One-off: generate supabase/seed.sql from the current lib/data.ts
   so the database starts out byte-identical to the static data.
   Run with: npx tsx scripts/gen-seed.ts > supabase/seed.sql */
import { SK, COURSES, ROLES, DEMAND, MAJORS } from "../lib/data";

function esc(s: string | undefined | null): string {
  if (s === undefined || s === null) return "NULL";
  return "'" + s.replace(/'/g, "''") + "'";
}
function bool(b: boolean | undefined): string {
  return b ? "true" : "false";
}

const lines: string[] = [];
lines.push("-- Auto-generated from lib/data.ts — do not hand-edit, re-run scripts/gen-seed.ts instead");
lines.push("begin;");
lines.push("truncate table demand, feedback, skills, courses, roles, majors restart identity cascade;");
lines.push("");

lines.push("-- majors");
for (const m of MAJORS) {
  lines.push(
    `insert into majors (id, name, school, ready, note) values (${esc(m.id)}, ${esc(m.name)}, ${esc(m.school)}, ${bool(m.ready)}, ${esc(m.note)});`
  );
}
lines.push("");

lines.push("-- courses");
for (const [code, c] of Object.entries(COURSES)) {
  lines.push(
    `insert into courses (code, name, when_label, ord) values (${esc(code)}, ${esc(c.name)}, ${esc(c.when)}, ${c.ord});`
  );
}
lines.push("");

lines.push("-- skills");
for (const [key, m] of Object.entries(SK)) {
  lines.push(
    `insert into skills (key, code, note, alias, src, hidden, early_in_term, partial, kind, proof, act, time_estimate, route) values (` +
      [
        esc(key),
        esc(m.code),
        esc(m.note),
        esc(m.alias),
        esc(m.src),
        bool(m.hidden),
        bool(m.earlyInTerm),
        bool(m.partial),
        esc(m.kind),
        esc(m.proof),
        esc(m.act),
        esc(m.time),
        esc(m.route),
      ].join(", ") +
      ");"
  );
}
lines.push("");

lines.push("-- roles");
for (const r of ROLES) {
  lines.push(
    `insert into roles (id, name, posts, jr_posts, fit) values (${esc(r.id)}, ${esc(r.name)}, ${r.posts}, ${r.jrPosts}, ${r.fit});`
  );
}
lines.push("");

lines.push("-- demand");
for (const [roleId, levels] of Object.entries(DEMAND)) {
  for (const level of ["jr", "sr"] as const) {
    for (const [skillKey, count] of levels[level] || []) {
      lines.push(
        `insert into demand (role_id, level, skill_key, count) values (${esc(roleId)}, ${esc(level)}, ${esc(skillKey)}, ${count});`
      );
    }
  }
}
lines.push("");
lines.push("commit;");

console.log(lines.join("\n"));
