import { NextResponse } from "next/server";
import { auth } from "@/auth";

/* Proxy always runs on Node.js in Next.js 16 (that's the point of the
   middleware → proxy rename), so bcrypt/DB-adjacent code paths are safe
   here without an explicit runtime export — it's not an allowed one. */

/* Gates /admin/* behind a signed-in Auth.js session — redirects to
   /admin/login otherwise. /admin/login itself stays public. */
export const proxy = auth((req) => {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";

  if (isAdminRoute && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
