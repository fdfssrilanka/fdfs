import * as cheerio from "cheerio";
import { get, slugify } from "../lib/http";
import type { Cinema, Movie, Showtime, Theatre } from "../../lib/types";

const BASE = "https://ticketmaster.lk";
const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** STR Films runs seven theatres in the north and east (https://strfilms.site) and sells tickets through Ticketmaster.lk. */
export const cinema: Cinema = { id: "str", name: "STR Films Theatres", website: "https://strfilms.site", bookingSite: `${BASE}/` };

// Addresses and phones come from the dialus.lk directory where listed; blanks are unverified.
const t = (key: string, name: string, city: string, address: string, phone: string): Theatre => ({
  id: `str-${key}`, cinemaId: "str", slug: slugify(`${name} ${city}`), name, city, address, mapsUrl: maps(`${name} ${city} Sri Lanka`), formats: ["2D"], experiences: [], phone,
});
export const theatres: Theatre[] = [
  t("rajah-1", "Rajah 1 Cinema", "Jaffna", "Kasturiyar Road, Jaffna", "+94212227232"),
  t("rajah-2", "Rajah 2 Cinema", "Jaffna", "Kasturiyar Road, Jaffna", "+94212227232"),
  t("amutha", "Amutha Cinema", "Vavuniya", "Vavuniya Town", ""),
  t("vasanthy", "Vasanthy Cinema", "Vavuniya", "No. 40, Kandy Road, Vavuniya", "+94242221410"),
  t("shanthi", "Shanthi Cinema", "Batticaloa", "Kallady, Batticaloa", "+94652223516"),
  t("suganthi", "Suganthi Cinema", "Batticaloa", "", ""),
  t("saraswathi", "Saraswathi Cinema", "Trincomalee", "", ""),
];

const byLabel = (label: string) => {
  const l = label.toLowerCase().replace(/\s+/g, " ").trim();
  return theatres.find((x) => l.startsWith(x.name.replace(" Cinema", "").toLowerCase()));
};

export async function scrape() {
  const home = await get(`${BASE}/`);
  const links = [...new Set([...home.matchAll(/href="(https:\/\/ticketmaster\.lk\/show\/[^"]+)"/g)].map((m) => m[1]))];
  const movies: Movie[] = [];
  const showtimes: Showtime[] = [];

  for (const url of links) {
    const $ = cheerio.load(await get(url));
    const title = $("header.show-header h1").first().text().trim();
    if (!title) continue;
    const synopsis = $("header.show-header .info p").first().text().replace(/\s+/g, " ").trim();
    const lang = synopsis.match(/\b(Tamil|Sinhala|Hindi|English|Telugu|Malayalam)\b/)?.[1] ?? "";
    const img = $("header.show-header .img img").attr("src") ?? "";
    const bg = ($("header.show-header").attr("style") ?? "").match(/url\(([^)]+)\)/)?.[1] ?? "";
    const id = `str-${slugify(title)}`;
    movies.push({
      id, slug: slugify(title), title, language: lang, genres: [], runtimeMin: null, certificate: "", releaseDate: "", status: "now_showing", featured: false,
      synopsis, cast: [], director: "", posterUrl: img, backdropUrl: bg, trailerUrl: "",
    });
    $("table.show-time-tb tr").each((_, tr) => {
      const th = byLabel($(tr).find("th").text());
      if (!th) return;
      $(tr).find("time").each((__, el) => {
        const dt = $(el).attr("datetime") ?? "";
        if (dt) showtimes.push({ movieId: id, theatreId: th.id, date: dt.slice(0, 10), time: dt.slice(11, 16), format: "2D", bookingUrl: url });
      });
    });
  }
  return { cinema, theatres, movies, showtimes };
}
