import { signIn } from "@/lib/actions/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <span className="brand">
          เส้นทาง<span>ทักษะ</span>
        </span>
        <h1>เข้าสู่ระบบผู้ดูแล</h1>
        <p className="lede">จัดการรายวิชา ทักษะ อาชีพ และดูฟีดแบ็กจากผู้ใช้</p>

        <form action={signIn}>
          <input type="hidden" name="next" value={next || "/admin"} />
          <div className="admin-field">
            <label htmlFor="email">อีเมล</label>
            <input id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div className="admin-field">
            <label htmlFor="password">รหัสผ่าน</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {error ? <div className="admin-error">{error}</div> : null}
          <button type="submit" className="cta admin-submit">
            เข้าสู่ระบบ →
          </button>
        </form>
      </div>
    </div>
  );
}
