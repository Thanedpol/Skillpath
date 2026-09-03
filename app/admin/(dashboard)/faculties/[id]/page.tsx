import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { faculties as facultiesT, universities as universitiesT } from "@/lib/db/schema";
import FacultyForm from "../FacultyForm";

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const [universities, faculty] = await Promise.all([
    db.select({ id: universitiesT.id, name: universitiesT.name }).from(universitiesT).orderBy(asc(universitiesT.name)),
    db.select().from(facultiesT).where(eq(facultiesT.id, decodedId)).then((r) => r[0]),
  ]);

  if (!faculty) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>แก้ไขคณะ — {faculty.name}</h1>
        </div>
      </div>
      <FacultyForm universities={universities} faculty={faculty} />
    </>
  );
}
