import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/* Service-role client — BYPASSES row level security entirely.
   Import this ONLY from Server Actions / Route Handlers that have already
   verified the caller is a signed-in admin (see lib/auth.ts). Never import
   this from a Client Component — the "server-only" import above makes any
   accidental client-side import a build error, not just a runtime leak. */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
