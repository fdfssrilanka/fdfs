const UA = "fdfs.lk-bot/1.0 (+https://fdfs.lk; movie showtime aggregator)";
const DELAY_MS = 1000;
let last = 0;

export async function get(url: string): Promise<string> {
  const wait = last + DELAY_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  last = Date.now();
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,*/*" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

export async function download(url: string, dest: string): Promise<boolean> {
  const { writeFile } = await import("node:fs/promises");
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return false;
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch {
    return false;
  }
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Pull a JSON array out of a Next.js RSC payload, e.g. `"sessionList":[...]`. */
export function extractArray(html: string, key: string): any[] {
  const h = html.replace(/\\"/g, '"');
  const start = h.indexOf(`"${key}":[`);
  if (start < 0) return [];
  const i = start + key.length + 3;
  let depth = 0;
  for (let j = i; j < h.length; j++) {
    if (h[j] === "[") depth++;
    else if (h[j] === "]" && --depth === 0) return JSON.parse(h.slice(i, j + 1));
  }
  return [];
}
