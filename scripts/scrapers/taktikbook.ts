import { get } from "../lib/http";
import type { Cinema } from "../../lib/types";

const BASE = "https://www.taktikbook.lk";

/** TakTikBook is an online ticketing portal for several regional cinemas. Its theatre pages carry real addresses, phones and an online-booking flag. */
export const cinema: Cinema = { id: "taktikbook", name: "TakTikBook (online booking)", website: BASE, bookingSite: BASE };

export interface TtTheatre { name: string; slug: string; city: string; address: string; phone: string; online: boolean }

const field = (seg: string, key: string) => seg.match(new RegExp(`${key}: '([^']*)'`))?.[1] ?? "";

export async function scrape(): Promise<TtTheatre[]> {
  const list = await get(`${BASE}/theaters`);
  const slugs = [...list.matchAll(/name: '[^']*',\s*slug: '([^']*)',\s*image/g)].map((m) => m[1]);
  const out: TtTheatre[] = [];
  for (const slug of slugs) {
    const h = await get(`${BASE}/theater/${slug}`);
    const seg = h.slice(Math.max(0, h.indexOf("theater: unescape({")), h.indexOf("theater: unescape({") + 3000);
    const tel = field(seg, "tel_no1").replace(/\D/g, "");
    out.push({
      name: field(seg, "name"), slug, city: field(seg, "city"), address: field(seg, "address_line1"),
      phone: tel ? `+94${tel.replace(/^94/, "").replace(/^0/, "")}` : "", online: /online_booking: 1/.test(seg),
    });
  }
  return out;
}
