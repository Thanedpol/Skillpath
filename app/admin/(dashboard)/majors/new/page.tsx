import MajorForm from "../MajorForm";
import { getFacultyOptions, getUniversityOptions } from "../facultyOptions";

export default async function NewMajorPage() {
  const [faculties, universities] = await Promise.all([getFacultyOptions(), getUniversityOptions()]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>เพิ่มสาขาใหม่</h1>
        </div>
      </div>
      <MajorForm faculties={faculties} universities={universities} />
    </>
  );
}
