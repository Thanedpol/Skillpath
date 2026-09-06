import CanonicalSkillForm from "../CanonicalSkillForm";

export default function NewCanonicalSkillPage() {
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>เพิ่มสกิลกลาง</h1>
          <p>สร้างรหัสกลางใหม่เมื่อพบทักษะที่ยังไม่มีในระบบ</p>
        </div>
      </div>
      <CanonicalSkillForm />
    </>
  );
}
