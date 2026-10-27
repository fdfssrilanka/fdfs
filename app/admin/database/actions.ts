"use server";

import { revalidatePath } from "next/cache";
import { audit, requireAdmin } from "@/lib/backend/auth";
import { db, exec, rows } from "@/lib/backend/db";

const q = (id: string) => `"${id.replace(/"/g, '""')}"`;

export async function userTables(): Promise<string[]> {
  return (await rows<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name != 'd1_migrations' ORDER BY name")).map((r) => r.name);
}

async function checked(table: string) {
  if (!(await userTables()).includes(table)) throw new Error("Unknown table");
  const cols = (await rows<{ name: string }>(`PRAGMA table_info(${q(table)})`)).map((c) => c.name);
  return cols;
}

export async function updateRow(form: FormData) {
  const admin = await requireAdmin();
  const table = String(form.get("table"));
  const rowid = Number(form.get("rowid"));
  const cols = (await checked(table)).filter((c) => c !== "password_hash" && form.has(`f_${c}`));
  if (!cols.length) return;
  const vals = cols.map((c) => {
    const v = String(form.get(`f_${c}`));
    return v === "" ? null : v;
  });
  await exec(`UPDATE ${q(table)} SET ${cols.map((c) => `${q(c)} = ?`).join(", ")} WHERE rowid = ?`, ...vals, rowid);
  await audit(admin, "db.update", `${table} #${rowid}`);
  revalidatePath("/admin/database");
}

export async function deleteRow(form: FormData) {
  const admin = await requireAdmin();
  const table = String(form.get("table"));
  const rowid = Number(form.get("rowid"));
  await checked(table);
  await exec(`DELETE FROM ${q(table)} WHERE rowid = ?`, rowid);
  await audit(admin, "db.delete", `${table} #${rowid}`);
  revalidatePath("/admin/database");
}

export interface SqlResult {
  error?: string;
  columns?: string[];
  rows?: unknown[][];
  changes?: number;
}

/** Runs any SQL the admin types (SELECT shows rows; everything else reports rows changed). Logged to the audit log. */
export async function runSql(_p: SqlResult | undefined, form: FormData): Promise<SqlResult> {
  const admin = await requireAdmin();
  const sql = String(form.get("sql") ?? "").trim();
  if (!sql) return { error: "Type a statement first." };
  await audit(admin, "db.sql", sql);
  try {
    const stmt = (await db()).prepare(sql);
    if (/^\s*(select|pragma|with|explain)\b/i.test(sql)) {
      const { results } = await stmt.all<Record<string, unknown>>();
      const columns = results[0] ? Object.keys(results[0]) : [];
      return { columns, rows: results.slice(0, 200).map((r) => columns.map((c) => (c === "password_hash" ? "••••" : r[c]))) };
    }
    const r = await stmt.run();
    revalidatePath("/admin/database");
    return { changes: r.meta.changes ?? 0 };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}
