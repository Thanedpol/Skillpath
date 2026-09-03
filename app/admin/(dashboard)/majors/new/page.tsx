import MajorForm from "../MajorForm";
import { getFacultyOptions } from "../facultyOptions";

export default async function NewMajorPage() {
  const faculties = await getFacultyOptions();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>เพิ่มสาขาใหม่</h1>
        </div>
      </div>
      <MajorForm faculties={faculties} />
    </>
  );
}
