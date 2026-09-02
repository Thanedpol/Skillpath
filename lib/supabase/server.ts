import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* Server-side client for Server Components / Server Actions — reads the
   signed-in admin's session from cookies, still respects RLS (uses the
   anon key). Use this to check "is someone logged in as admin" and for
   any read that should honor RLS. For writes that need to bypass RLS
   (the actual admin CRUD operations), use lib/supabase/admin.ts instead. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component render — middleware refreshes
            // the session instead, so this is safe to ignore
          }
        },
      },
    }
  );
}
