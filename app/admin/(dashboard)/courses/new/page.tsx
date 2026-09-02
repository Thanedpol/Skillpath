import CourseForm from "../CourseForm";

export default function NewCoursePage() {
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>เพิ่มรายวิชาใหม่</h1>
        </div>
      </div>
      <CourseForm />
    </>
  );
}
