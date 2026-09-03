"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn as authSignIn, signOut as authSignOut } from "@/auth";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  try {
    await authSignIn("credentials", { email, password, redirectTo: next });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/admin/login?error=${encodeURIComponent("อีเมลหรือรหัสผ่านไม่ถูกต้อง")}&next=${encodeURIComponent(next)}`);
    }
    throw error; // NEXT_REDIRECT on success (and any real error) must propagate
  }
}

export async function signOut() {
  await authSignOut({ redirectTo: "/admin/login" });
}
