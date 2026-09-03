import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { universities as universitiesT } from "@/lib/db/schema";
import FacultyForm from "../FacultyForm";

export default async function NewFacultyPage() {
  const universities = await db
    .select({ id: universitiesT.id, name: universitiesT.name })
    .from(universitiesT)
    .orderBy(asc(universitiesT.name));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>เพิ่มคณะ</h1>
        </div>
      </div>
      <FacultyForm universities={universities} />
    </>
  );
}
