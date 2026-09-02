import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import AdminNavLinks from "./AdminNavLinks";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // belt-and-suspenders — middleware already gates this, but a Server
  // Component render is the trustworthy place to actually check
  if (!user) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/admin">
          เส้นทาง<span>ทักษะ</span>
        </Link>
        <AdminNavLinks />
        <div className="signout">
          <div style={{ fontSize: 11.5, color: "var(--muted)", padding: "0 12px 6px" }}>{user.email}</div>
          <form action={signOut}>
            <button type="submit">ออกจากระบบ</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
