import { get, extractArray, slugify } from "../lib/http";
import type { Cinema, Movie, Showtime, Theatre } from "../../lib/types";

const BASE = "https://www.scopecinemas.com";
const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const cinema: Cinema = {
  id: "scope",
  name: "Scope Cinemas",
  website: BASE,
  bookingSite: `${BASE}/movies/now-showing`,
};

/** Curated from each cinema page under /cinemas/<slug>. `vista` is the code Scope's ticketing system uses. */
const SEED: (Theatre & { vista: string })[] = [
  {
    id: "scope-ccc", vista: "CCC", cinemaId: "scope", slug: "scope-cinemas-colombo-city-centre",
    name: "Scope Cinemas Multiplex - Colombo City Centre", city: "Colombo",
    address: "137, Sir James Pieris Mawatha, Colombo 2", mapsUrl: maps("Scope Cinemas Colombo City Centre, Colombo 2"),
    formats: ["2D", "3D", "Gold Class", "Dolby Atmos"], experiences: ["Gold Class", "Dolby Atmos", "4K", "3D", "2D"], phone: "+94112083065",
  },
  {
    id: "scope-hcm", vista: "HCM", cinemaId: "scope", slug: "scope-cinemas-havelock-city-mall",
    name: "Scope Cinemas Multiplex - Havelock City Mall", city: "Colombo",
    address: "Havelock City Mall, 324 Havelock Road, Colombo 5", mapsUrl: maps("Scope Cinemas Havelock City Mall, Colombo 5"),
    formats: ["2D", "IMAX", "Dolby Atmos"], experiences: ["IMAX", "Director's Lounge", "Dolby Atmos", "4K", "Laser", "3D", "2D"], phone: "+94112590814",
  },
  {
    id: "scope-colpetty", vista: "LIBERTY", cinemaId: "scope", slug: "scope-cinemas-colpetty",
    name: "Liberty by Scope Cinemas - Colpetty", city: "Colombo",
    address: "No. 35, Srimath Anagarika Dharmapala Mawatha, Colombo 3", mapsUrl: maps("Liberty by Scope Cinemas, Colpetty, Colombo 3"),
    formats: ["2D", "3D"], experiences: ["3D", "2D"], phone: "+94112325266",
  },
  {
    id: "scope-kiribathgoda", vista: "KIT", cinemaId: "scope", slug: "liberty-by-scope-cinemas-kiribathgoda",
    name: "Liberty By Scope Cinemas - Kiribathgoda", city: "Kiribathgoda",
    address: "No. 94, Makola Road, Kiribathgoda", mapsUrl: maps("Liberty by Scope Cinemas, Kiribathgoda"),
    formats: ["2D", "3D"], experiences: ["Balcony Seating", "3D", "2D"], phone: "+94112269005",
  },
];

const FORMAT: Record<string, string> = {
  "Digital 2D": "2D", "Digital 3D": "3D", "IMAX with Laser": "IMAX", "Gold Class": "Gold Class", "Dolby Atmos": "Dolby Atmos",
};

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
function parseRelease(text: string): string {
  const m = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})/);
  const mo = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1;
  return m && mo >= 0 ? `${m[3]}-${String(mo + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}

const unescape = (h: string) => h.replace(/\\"/g, '"').replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\n/g, "\n");
const KEEP = new Set(["IMAX", "EP", "2D", "3D", "II", "III", "NTB"]);
export const titleCase = (t: string) =>
  /[a-z]/.test(t.replace(/\([^)]*\)/g, "")) ? t : t.replace(/[A-Z][A-Z']+/g, (w) => (KEEP.has(w) ? w : w[0] + w.slice(1).toLowerCase()));
const strip = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/\s+/g, " ").trim();

function languageOf(title: string): string {
  const m = title.match(/\((SINHALA|TAMIL|HINDI|ENGLISH|TELUGU|MALAYALAM)\)/i);
  if (m) return m[1][0] + m[1].slice(1).toLowerCase();
  // Some titles carry no bracketed label but are written in Sinhala or Tamil script.
  if (/[\u0D80-\u0DFF]/.test(title)) return "Sinhala";
  if (/[\u0B80-\u0BFF]/.test(title)) return "Tamil";
  return "English";
}

async function movieDetail(slug: string) {
  const h = unescape(await get(`${BASE}/movies/${slug}`));
  const title = (h.match(/<title>([^<|]+?)\s*\|\s*Scope Cinemas/)?.[1] ?? slug).trim();
  const syn = h.slice(Math.max(0, h.indexOf('"SYNOPSIS"'))).match(/"__html":"(.*?)"\}\}/)?.[1] ?? "";
  const director = h.match(/"children":"Directors?"\}\],\["\$","p",null,\{[^}]*"children":"([^"]+)"/)?.[1] ?? "";
  const cast = h.match(/"children":"Cast"\}\],\["\$","p",null,\{[^}]*"children":"([^"]+)"/)?.[1] ?? "";
  const release = h.match(/Releasing[^"<]{0,40}/)?.[0] ?? "";
  return {
    title,
    synopsis: strip(syn),
    director,
    cast: cast ? cast.split(/,\s*/) : [],
    releaseDate: parseRelease(release),
    trailerUrl: h.match(/"trailer":"(https:\/\/www\.youtube\.com\/[^"]+)"/)?.[1] ?? "",
    backdropUrl: h.match(/https:\/\/scopecinemas-v2\.s3\.amazonaws\.com\/images\/[^"]*1500-x-425[^"]*\.jpg/)?.[0] ?? "",
  };
}

const slugsFrom = (html: string) => [...new Set([...unescape(html).matchAll(/href="\/movies\/([a-z0-9-]+)"/g)].map((m) => m[1]))].filter((s) => !["now-showing", "coming-soon"].includes(s));

const key = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

/** normalised title -> poster URL, from each card's <img alt="The movie TITLE">. Matching by title avoids pairing an image with the next card's link. */
function postersFrom(html: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of unescape(html).matchAll(/<img alt="The movie ([^"]*)"[^>]*?src="(https:[^"]+)"/g)) {
    const k = key(m[1].replace(/\([^)]*\)/g, ""));
    if (k && !out.has(k)) out.set(k, m[2]);
  }
  return out;
}

/** Guard against wrong artwork: the image file name Scope uses always contains the film's name. */
export function artworkMatches(slug: string, url: string): boolean {
  const file = key(new URL(url).pathname.split("/").pop() ?? "");
  return file.includes(key(slug).slice(0, 6));
}

export async function scrape() {
  const nowHtml = await get(`${BASE}/movies/now-showing`);
  const soonHtml = await get(`${BASE}/movies/coming-soon`);
  const nowSlugs = slugsFrom(nowHtml);
  const soonSlugs = slugsFrom(soonHtml);
  const posters = new Map([...postersFrom(nowHtml), ...postersFrom(soonHtml)]);
  const cleanTitle = (t: string) => key(t.replace(/\([^)]*\)/g, ""));

  // One showtimes page carries every session for every movie, for all published dates.
  const page = await get(`${BASE}/movies/${nowSlugs[0]}/showtimes`);
  const sessions = extractArray(page, "sessionList");
  const theatreByVista = new Map(SEED.map((t) => [t.vista, t]));

  const info = new Map<string, any>();
  for (const s of sessions) if (!info.has(s.movie_data.slug)) info.set(s.movie_data.slug, s.movie_data);
  const slugs = [...new Set([...nowSlugs, ...info.keys(), ...soonSlugs])];

  const movies: Movie[] = [];
  for (const slug of slugs) {
    const d = await movieDetail(slug);
    const md = info.get(slug);
    const hasSessions = !!md;
    const status = hasSessions || !soonSlugs.includes(slug) ? "now_showing" : "coming_soon";
    movies.push({
      id: `scope-${slug}`, slug, title: titleCase(d.title.replace(/\s*\((SINHALA|TAMIL|HINDI|ENGLISH)\)\s*$/i, "").trim()),
      language: languageOf(d.title),
      genres: md?.genres ?? [], runtimeMin: md ? md.duration.hours * 60 + md.duration.minutes : null,
      certificate: md?.rating ?? "", releaseDate: d.releaseDate, status, featured: false,
      synopsis: d.synopsis, cast: d.cast, director: d.director,
      posterUrl: md?.movieImage ?? posters.get(cleanTitle(d.title)) ?? "", backdropUrl: d.backdropUrl, trailerUrl: d.trailerUrl,
    });
  }

  for (const m of movies) {
    for (const [what, url] of [["poster", m.posterUrl], ["backdrop", m.backdropUrl]] as const) {
      if (url && !artworkMatches(m.slug, url)) {
        console.warn(`wrong ${what} for ${m.slug}: ${url}; dropped`);
        if (what === "poster") m.posterUrl = "";
        else m.backdropUrl = "";
      }
    }
  }

  const showtimes: Showtime[] = [];
  for (const s of sessions) {
    const t = theatreByVista.get(s.Cinema_strID);
    if (!t || s.Session_strStatus !== "O") continue;
    showtimes.push({
      movieId: `scope-${s.movie_data.slug}`, theatreId: t.id, date: s.date, time: s.date_time.slice(11, 16),
      format: FORMAT[s.experience_name] ?? s.experience_name,
      bookingUrl: `${BASE}/movies/${s.movie_data.slug}/showtimes`,
    });
  }

  return { cinema, theatres: SEED.map(({ vista, ...t }) => t), movies, showtimes };
}
