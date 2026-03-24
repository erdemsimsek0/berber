"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AuthState = { ok: boolean; message: string };

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false as const, message: "E-posta ve şifre zorunludur." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false as const, message: error.message };
  redirect("/isletme/panel");
}

export async function signupAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { ok: false as const, message: "Tüm alanlar zorunludur." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (error) return { ok: false as const, message: error.message };

  const userId = data.user?.id;
  if (userId) {
    await supabase.from("users").upsert({ id: userId, role: "business_owner", full_name: fullName });
  }

  redirect("/baslangic/isletme");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
