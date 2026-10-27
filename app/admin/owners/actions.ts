"use server";

import { revalidatePath } from "next/cache";
import { audit, hashPassword, requireAdmin } from "@/lib/backend/auth";
import { exec, one } from "@/lib/backend/db";
import { getTheatreById } from "@/lib/data";

const refresh = () => revalidatePath("/admin/owners");

export async function createOwner(_p: { error?: string; ok?: string } | undefined, form: FormData) {
  const admin = await requireAdmin();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const theatre = String(form.get("theatre") ?? "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email." };
  if (password.length < 10) return { error: "Password needs at least 10 characters." };
  if (theatre && !getTheatreById(theatre)) return { error: "Pick a theatre from the list." };
  if (await one("SELECT 1 FROM users WHERE email = ?", email)) return { error: "That email already has an account." };
  const r = await exec("INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, 'owner', ?)", email, name, await hashPassword(password));
  if (theatre) await exec("INSERT OR IGNORE INTO owner_theatres (user_id, theatre_id) VALUES (?, ?)", r.meta.last_row_id, theatre);
  await audit(admin, "owner.create", `${email}${theatre ? ` → ${theatre}` : ""}`);
  refresh();
  return { ok: `Created ${email}.` };
}

export async function assignTheatre(form: FormData) {
  const admin = await requireAdmin();
  const uid = Number(form.get("user"));
  const theatre = String(form.get("theatre") ?? "").trim();
  if (!uid || !getTheatreById(theatre)) return;
  await exec("INSERT OR IGNORE INTO owner_theatres (user_id, theatre_id) VALUES (?, ?)", uid, theatre);
  await audit(admin, "owner.assign", `user ${uid} → ${theatre}`);
  refresh();
}

export async function unassignTheatre(form: FormData) {
  const admin = await requireAdmin();
  const uid = Number(form.get("user"));
  const theatre = String(form.get("theatre"));
  await exec("DELETE FROM owner_theatres WHERE user_id = ? AND theatre_id = ?", uid, theatre);
  await audit(admin, "owner.unassign", `user ${uid} ✕ ${theatre}`);
  refresh();
}

export async function setDisabled(form: FormData) {
  const admin = await requireAdmin();
  const uid = Number(form.get("user"));
  const disabled = form.get("disabled") === "1" ? 1 : 0;
  await exec("UPDATE users SET disabled = ? WHERE id = ? AND role = 'owner'", disabled, uid);
  await audit(admin, disabled ? "owner.disable" : "owner.enable", `user ${uid}`);
  refresh();
}

export async function resetPassword(form: FormData) {
  const admin = await requireAdmin();
  const uid = Number(form.get("user"));
  const password = String(form.get("password") ?? "");
  if (password.length < 10) return;
  await exec("UPDATE users SET password_hash = ? WHERE id = ?", await hashPassword(password), uid);
  await audit(admin, "owner.password_reset", `user ${uid}`);
  refresh();
}

export async function deleteOwner(form: FormData) {
  const admin = await requireAdmin();
  const uid = Number(form.get("user"));
  await exec("DELETE FROM users WHERE id = ? AND role = 'owner'", uid);
  await audit(admin, "owner.delete", `user ${uid}`);
  refresh();
}
