import { get } from "../lib/http";
import { titleCase } from "./scope";
import type { Offer } from "../../lib/types";

const unescape = (h: string) =>
  h.replace(/\\"/g, '"').replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&").replace(/\\n/g, " ");
const strip = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/\s+/g, " ").trim();
const today = () => new Date().toISOString().slice(0, 10);
const day = (iso: string) => iso.replace(/^\$D/, "").slice(0, 10);
const meta = (h: string, prop: string) => h.match(new RegExp(`(?:property|name)="${prop}" content="([^"]*)"`))?.[1] ?? "";
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"');

/** Scope's /offers pages: title is the first paragraph of the description, dates in to_date, art in the S3 bucket. */
async function scope(): Promise<Offer[]> {
  const base = "https://www.scopecinemas.com";
  const slugs = [...new Set([...unescape(await get(`${base}/offers`)).matchAll(/href="\/offers\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
  const out: Offer[] = [];
  for (const slug of slugs) {
    const h = unescape(await get(`${base}/offers/${slug}`));
    const desc = h.match(/"description":"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
    const paras = [...desc.matchAll(/<p>(.*?)<\/p>/g)].map((m) => strip(m[1])).filter(Boolean);
    const validTo = day(h.match(/"to_date":"([^"]+)"/)?.[1] ?? "");
    // The stored date is midnight Colombo time expressed in UTC, so it falls on the day before the last valid day.
    const last = validTo ? new Date(new Date(`${validTo}T00:00:00Z`).getTime() + 86_400_000).toISOString().slice(0, 10) : "";
    const image = h.match(/https:\/\/scopecinemas-v2\.s3\.amazonaws\.com\/images\/[^"\\ ]*(?:400-x-600|banner)[^"\\ ]*\.(?:jpg|jpeg|png|webp)/)?.[0] ?? "";
    if (!paras.length) continue;
    out.push({
      id: `scope-${slug}`, cinemaId: "scope", title: titleCase(paras[0]), description: paras.slice(1).join(" ").replace(/BUY TICKETS/g, "").trim(),
      imageUrl: image, url: `${base}/offers/${slug}`, validTo: last,
    });
  }
  return out;
}

/** JP Cineplex /deals pages: og:title/og:image/og:description plus valid_to in the page data. */
async function jp(): Promise<Offer[]> {
  const base = "https://www.jpcineplex.com";
  const slugs = [...new Set([...unescape(await get(`${base}/deals`)).matchAll(/href="\/deals\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
  const out: Offer[] = [];
  for (const slug of slugs) {
    const h = unescape(await get(`${base}/deals/${slug}`));
    const title = decode(meta(h, "og:title")).replace(/\s*-\s*JP Cineplex$/, "");
    if (!title) continue;
    const description = decode(meta(h, "og:description")).replace(/([.!?])(?=[A-Z])/g, "$1 ");
    out.push({
      id: `jp-${slug}`, cinemaId: "jp", title, description: description.length > 220 ? `${description.slice(0, 217).replace(/\s+\S*$/, "")}…` : description,
      imageUrl: meta(h, "og:image"), url: `${base}/deals/${slug}`, validTo: day(h.match(/"valid_to":"([^"]+)"/)?.[1] ?? ""),
    });
  }
  return out;
}

/** Current promotions only: anything whose last valid day has passed is dropped. */
export async function scrape(): Promise<Offer[]> {
  const all = [...(await scope()), ...(await jp())];
  return all.filter((o) => !o.validTo || o.validTo >= today());
}
