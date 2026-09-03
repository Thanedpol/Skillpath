import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/lib/actions/auth";
import AdminNavLinks from "./AdminNavLinks";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // belt-and-suspenders — proxy.ts already gates this, but a Server
  // Component render is the trustworthy place to actually check
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/admin">
          เส้นทาง<span>ทักษะ</span>
        </Link>
        <AdminNavLinks />
        <div className="signout">
          <div style={{ fontSize: 11.5, color: "var(--muted)", padding: "0 12px 6px" }}>{session.user.email}</div>
          <form action={signOut}>
            <button type="submit">ออกจากระบบ</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
