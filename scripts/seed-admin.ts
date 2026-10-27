import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Creates (or resets the password of) an admin account.
 *   npm run db:seed-admin -- <email> <password> [--remote]
 * Same PBKDF2 format as lib/backend/auth.ts.
 */
const [email, password, flag] = process.argv.slice(2);
if (!email || !password || password.length < 10) {
  console.error("usage: npm run db:seed-admin -- <email> <password (10+ chars)> [--remote]");
  process.exit(1);
}

async function main() {
  const b64 = (b: ArrayBuffer | Uint8Array) => Buffer.from(b instanceof Uint8Array ? b : new Uint8Array(b)).toString("base64url");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100_000 }, key, 256);
  const hash = `pbkdf2$100000$${b64(salt)}$${b64(bits)}`;

  const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
  const sql = `INSERT INTO users (email, name, role, password_hash) VALUES (${q(email.toLowerCase())}, 'Admin', 'admin', ${q(hash)})
  ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = 'admin', disabled = 0;`;
  const file = join(mkdtempSync(join(tmpdir(), "fdfs-seed-")), "seed.sql");
  writeFileSync(file, sql);
  execFileSync("npx", ["wrangler", "d1", "execute", "fdfs-db", flag === "--remote" ? "--remote" : "--local", "--file", file], { stdio: "inherit" });
  console.log(`admin ${email} ready (${flag === "--remote" ? "remote" : "local"} database)`);
}

main();
