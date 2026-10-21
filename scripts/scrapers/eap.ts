import * as cheerio from "cheerio";
import { get, slugify } from "../lib/http";
import type { Cinema, Listing, Movie, Showtime, Theatre } from "../../lib/types";

const BASE = "https://eapmovies.com";
const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const cinema: Cinema = {
  id: "eap",
  name: "EAP Films & Theatres (Savoy)",
  website: BASE,
  bookingSite: `${BASE}/component/eapmovies/?controller=buyticket&task=book&Itemid=115`,
};

const EXPERIENCES: Record<string, string[]> = {
  "Savoy 3D Dolby ATMOS": ["Dolby Atmos", "3D"],
  "Sinexpo 3D": ["3D"],
  "Cinemax 3D": ["3D"],
};

/** Theatres come from EAP's theatre list; movies and per-date showtimes from the JSONP calls its own booking page makes. */
export async function scrape() {
  const $t = cheerio.load(await get(`${BASE}/component/eapmovies/?controller=theaters&view=theaterlist&Itemid=112`));
  const theatres: Theatre[] = [];
  const text = $t("body").text().replace(/\s+/g, " ");
  const body = text.slice(text.indexOf("Theaters"), text.indexOf("© 2018"));
  for (const chunk of body.split("More Info")) {
    const m = chunk.match(/(?:Theaters\s+)?(.+?)\s+-\s+([A-Za-z-]+)\s+Address\s*:\s*(.+?)\s+Telephone\s*:\s*(\+?\d+)/);
    if (!m) continue;
    const [, rawName, city, address, phone] = m;
    if (/temporarily closed/i.test(rawName)) continue;
    const n = rawName.trim();
    const base = Object.keys(EXPERIENCES).find((k) => n.startsWith(k));
    theatres.push({
      id: `eap-${slugify(n)}`, cinemaId: "eap", slug: slugify(`${n} ${city}`), name: n, city: city === "colombo" ? "Colombo" : city,
      address: address.trim(), mapsUrl: maps(`${n} ${city} Sri Lanka`),
      formats: base ? ["2D", ...EXPERIENCES[base]] : ["2D"], experiences: base ? EXPERIENCES[base] : [], phone,
    });
  }

  // The booking page's own read-only JSONP calls give every movie, its date range and its showtimes by theatre.
  const call = async <T>(task: string, data: object): Promise<T | null> => {
    const url = `${BASE}/index.php?option=com_eapmovies&controller=buyticket&task=${task}&format&callback=cb&data=${encodeURIComponent(JSON.stringify(data))}`;
    const body = (await get(url)).trim();
    const json = body.replace(/^cb\(/, "").replace(/\);?$/, "");
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  };

  interface EapMovie { mid: string; m_name: string; synopsis: string; runtime: string; m_img: string; you_tube_link: string; date_range: string[] }
  const list = (await call<EapMovie[]>("getMovieList", { m_id: 0, stripmovie: 0 })) ?? [];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" });
  const byName = (label: string) => theatres.find((x) => label.toLowerCase().startsWith(x.name.toLowerCase()));

  const movies: (Movie & { eapCid: string })[] = [];
  const showtimes: Showtime[] = [];
  const extraTheatres = new Map<string, Theatre>();

  for (const m of list) {
    const title = m.m_name.trim();
    const lang = title.match(/\((Sinhala|Tamil|Hindi|English|Telugu|Malayalam)/i)?.[1] ?? "";
    const clean = title.replace(/\s*\(.*$/, "").trim();
    const rt = m.runtime.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/);
    const runtimeMin = rt ? (+rt[1] || 0) * 60 + (+rt[2] || 0) || null : null;
    const poster = /no_image/i.test(m.m_img) ? "" : m.m_img;
    const embed = m.you_tube_link.match(/embed\/([\w-]+)/)?.[1];
    const id = `eap-${m.mid}`;
    movies.push({
      eapCid: m.mid, id, slug: slugify(title), title: clean, language: lang ? lang[0].toUpperCase() + lang.slice(1).toLowerCase() : "",
      genres: [], runtimeMin, certificate: "", releaseDate: "", status: "now_showing", featured: false,
      synopsis: m.synopsis.replace(/\s+/g, " ").replace(/^[“"]|[”"]$/g, "").trim(), cast: [], director: "",
      posterUrl: poster, backdropUrl: "", trailerUrl: embed ? `https://www.youtube.com/watch?v=${embed}` : "",
    });
    const format = /\b3D\b/.test(title) ? "3D" : "2D";
    const bookingUrl = `${BASE}/component/eapmovies/?controller=buyticket&task=book&cid=${m.mid}`;
    for (const date of m.date_range.filter((d) => d >= today)) {
      const res = await call<Record<string, any>>("getMovieAllShowTimeList", { movie_id: m.mid, movie_date: date, seat_enable: 0, tid: 0 });
      if (!res || typeof res.message === "string") continue;
      for (const v of Object.values(res)) {
        if (!v || typeof v !== "object" || !v.t_name) continue;
        let th = byName(`${v.t_name}`);
        if (!th) {
          // A venue EAP sells for but does not list on its theatres page.
          const key = `eap-${slugify(`${v.t_name} ${v.t_city}`)}`;
          th = extraTheatres.get(key) ?? {
            id: key, cinemaId: "eap", slug: slugify(`${v.t_name} ${v.t_city}`), name: String(v.t_name).replace(/\s+-\s+/g, " "), city: String(v.t_city).replace(/^colombo$/i, "Colombo"),
            address: "", mapsUrl: maps(`${v.t_name} ${v.t_city} Sri Lanka`), formats: ["2D"], experiences: [], phone: "",
          };
          extraTheatres.set(key, th);
        }
        for (const t of Object.values<any>(v.showtimes ?? {})) {
          if (t.status !== 1 || !t.showtime_name) continue;
          showtimes.push({ movieId: id, theatreId: th.id, date, time: String(t.showtime_name).slice(0, 5), format, bookingUrl });
        }
      }
    }
  }
  theatres.push(...extraTheatres.values());

  // A movie EAP lists but has no showtimes for still gets a booking link.
  const withTimes = new Set(showtimes.map((x) => x.movieId));
  const listings: Listing[] = movies
    .filter((m) => !withTimes.has(m.id))
    .map((m) => ({ movieId: m.id, cinemaId: "eap", bookingUrl: `${BASE}/component/eapmovies/?controller=buyticket&task=book&cid=${m.eapCid}` }));
  return { cinema, theatres, movies, showtimes, listings };
}
