import * as cheerio from "cheerio";
import { get } from "../lib/http";

export interface DialusEntry { name: string; town: string; address: string; phone: string; district: string }

const DISTRICTS = ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"];

/** Dialus.lk's per-district theatre directory: a second, independent source used only to cross-check the NFC list. */
export async function scrape(): Promise<DialusEntry[]> {
  const out: DialusEntry[] = [];
  for (const district of DISTRICTS) {
    let html: string;
    try {
      html = await get(`https://dialus.lk/all/list/${encodeURIComponent(district)}/theaters`);
    } catch {
      continue;
    }
    const $ = cheerio.load(html);
    $(".cardd").each((_, card) => {
      const spans = $(card).find(".headerr span").map((__, el) => $(el).text().trim()).get();
      const paras = $(card).find(".contentt p").map((__, el) => $(el).text().replace(/\s+/g, " ").trim()).get();
      const phone = (paras[paras.length - 1] ?? "").replace(/\D/g, "").slice(0, 10);
      if (spans[0]) out.push({ name: spans[0], town: spans[1] ?? "", address: paras[0] ?? "", phone, district });
    });
  }
  return out;
}
