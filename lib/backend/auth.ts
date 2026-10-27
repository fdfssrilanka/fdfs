import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { exec, one } from "./db";

export interface Session {
  id: number;
  email: string;
  name: string;
  role: "admin" | "owner";
}

const COOKIE = "fdfs_session";
const MAX_AGE = 60 * 60 * 24 * 7;
const ITERATIONS = 100_000; // the Workers runtime caps PBKDF2 at 100k

const enc = new TextEncoder();
const b64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function secret(): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  const s = (env as unknown as { AUTH_SECRET?: string }).AUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (32+ characters). Add it to .dev.vars locally or `wrangler secret put AUTH_SECRET`.");
  return s;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(await secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, key, 256));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(await pbkdf2(password, salt, ITERATIONS))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iter, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2") return false;
  const got = await pbkdf2(password, unb64(salt), Number(iter));
  const want = unb64(hash);
  let diff = got.length ^ want.length;
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ (want[i] ?? 0);
  return diff === 0;
}

export async function startSession(userId: number) {
  const payload = b64(enc.encode(JSON.stringify({ uid: userId, exp: Math.floor(Date.now() / 1000) + MAX_AGE })));
  (await cookies()).set(COOKIE, `${payload}.${await hmac(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in user, or null. The user row is re-read on every request so disabling or deleting an account takes effect at once. */
export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || (await hmac(payload)) !== sig) return null;
  let data: { uid: number; exp: number };
  try {
    data = JSON.parse(new TextDecoder().decode(unb64(payload)));
  } catch {
    return null;
  }
  if (!data.uid || data.exp < Date.now() / 1000) return null;
  const u = await one<{ id: number; email: string; name: string; role: "admin" | "owner"; disabled: number }>("SELECT id, email, name, role, disabled FROM users WHERE id = ?", data.uid);
  if (!u || u.disabled) return null;
  return { id: u.id, email: u.email, name: u.name, role: u.role };
}

export async function requireAdmin(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "admin") redirect("/owner");
  return s;
}

export async function requireOwner(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/login");
  return s;
}

export async function audit(who: Session | null, action: string, detail = "") {
  await exec("INSERT INTO audit_log (user_id, user_email, action, detail) VALUES (?, ?, ?, ?)", who?.id ?? null, who?.email ?? "", action, detail.slice(0, 500));
}
