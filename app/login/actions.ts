"use server";

import { redirect } from "next/navigation";
import { audit, endSession, getSession, startSession, verifyPassword } from "@/lib/backend/auth";
import { exec, one } from "@/lib/backend/db";

export async function login(_prev: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const recent = await one<{ n: number }>("SELECT COUNT(*) AS n FROM login_attempts WHERE email = ? AND ok = 0 AND ts > datetime('now', '-15 minutes')", email);
  if ((recent?.n ?? 0) >= 5) return { error: "Too many failed attempts. Try again in 15 minutes." };

  const u = await one<{ id: number; password_hash: string; disabled: number; role: string }>("SELECT id, password_hash, disabled, role FROM users WHERE email = ?", email);
  const ok = !!u && !u.disabled && (await verifyPassword(password, u.password_hash));
  await exec("INSERT INTO login_attempts (email, ok) VALUES (?, ?)", email, ok ? 1 : 0);
  if (!ok || !u) return { error: "Wrong email or password." };

  await exec("UPDATE users SET last_login_at = datetime('now') WHERE id = ?", u.id);
  await startSession(u.id);
  await audit(await getSession(), "login");
  redirect(u.role === "admin" ? "/admin" : "/owner");
}

export async function logout() {
  await audit(await getSession(), "logout");
  await endSession();
  redirect("/login");
}
