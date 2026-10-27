import { getCloudflareContext } from "@opennextjs/cloudflare";

/** The slice of Cloudflare D1 we use. */
export interface D1 {
  prepare(sql: string): D1Statement;
  batch<T = unknown>(stmts: D1Statement[]): Promise<{ results?: T[] }[]>;
}
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<{ meta: { changes?: number; last_row_id?: number } }>;
}

export async function db(): Promise<D1> {
  const { env } = await getCloudflareContext({ async: true });
  const d = (env as unknown as { DB?: D1 }).DB;
  if (!d) throw new Error("D1 binding DB is missing. Check wrangler.jsonc and run npm run db:migrate.");
  return d;
}

export async function rows<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T[]> {
  return (await (await db()).prepare(sql).bind(...params).all<T>()).results;
}

export async function one<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T | null> {
  return (await db()).prepare(sql).bind(...params).first<T>();
}

export async function exec(sql: string, ...params: unknown[]) {
  return (await db()).prepare(sql).bind(...params).run();
}
