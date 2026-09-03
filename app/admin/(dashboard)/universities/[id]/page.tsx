import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { universities as universitiesT } from "@/lib/db/schema";
import UniversityForm from "../UniversityForm";

export default async function EditUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const university = await db
    .select()
    .from(universitiesT)
    .where(eq(universitiesT.id, decodedId))
    .then((r) => r[0]);

  if (!university) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>แก้ไขมหาวิทยาลัย — {university.name}</h1>
        </div>
      </div>
      <UniversityForm university={university} />
    </>
  );
}
