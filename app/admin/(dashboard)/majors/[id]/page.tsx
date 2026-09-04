import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { majors as majorsT } from "@/lib/db/schema";
import MajorForm from "../MajorForm";
import { getFacultyOptions, getUniversityOptions } from "../facultyOptions";

export default async function EditMajorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const [faculties, universities, major] = await Promise.all([
    getFacultyOptions(),
    getUniversityOptions(),
    db.select().from(majorsT).where(eq(majorsT.id, decodedId)).then((r) => r[0]),
  ]);

  if (!major) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>แก้ไขสาขา — {major.name}</h1>
        </div>
      </div>
      <MajorForm faculties={faculties} universities={universities} major={major} />
    </>
  );
}
