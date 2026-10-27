import { readFileSync } from "node:fs";
import type { Cinema, Movie, Showtime, Theatre } from "../../lib/types";

/**
 * Showtimes and ticket prices from lk.bookmyshow.com, read from the snapshot in data/raw/bookmyshow.txt.
 * BookMyShow blocks scripted requests, so the snapshot is collected by loading each movie page in a normal
 * browser session (see data/SOURCES.md). Only theatres with no showtimes from their own site are filled in.
 */
export const cinema: Cinema = { id: "bms", name: "BookMyShow Sri Lanka", website: "https://lk.bookmyshow.com", bookingSite: "https://lk.bookmyshow.com" };

/** BookMyShow venue code → our theatre id. Venues not listed here are created as new theatres (NEW below). */
const VENUE_TO_THEATRE: Record<string, string> = {
  ALCN: "lite-aqua-negombo", CACC: "nfc-cinecity-maradana", CLCL: "nfc-city-cinema", CCDL: "eap-concord",
  LCCS: "scope-colpetty", LCCL: "scope-colpetty", MCCO: "nfc-majestic-city", MAXC: "nfc-max-lite", MLCN: "nfc-cinesha-cinema-misty-lite",
  PLLK: "nfc-prasanna-lite", PLCK: "lite-priska-kalutara", PVGT: "pvr-ogf", RCKT: "nfc-regal-katubedda", RCBD: "nfc-regal-bandarawela",
  MCJA: "ceylon-majestic-jaffna", RCNE: "nfc-regal-nuwara-eliya", RRCD: "nfc-regal-dematagoda", RXXE: "nfc-rex-badulla",
  SCMM: "nfc-samanala-melsiripura", SASC: "nfc-sas-trincomalee", SCWT: "eap-savoy-3d-dolby-atmos", SPRG: "eap-savoy-premier-rajagiriya",
  SCMH: "scope-hcm", SCDL: "scope-hcm", SCIM: "scope-hcm", CCCS: "scope-ccc", SCGS: "scope-ccc", SCTT: "scope-ccc", SCDA: "scope-ccc",
  SCKI: "nfc-seran-cinema", SKKS: "nfc-sky-lite", VCCM: "nfc-wijya-cinema", VOXX: "nfc-vox-lite", AAMM: "nfc-amity-lite",
  JPRP: "eap-jothi", LSSK: "scope-kiribathgoda", LLLM: "nfc-lekha-homagama", NLCD: "lite-neela-dankotuwa", NJCM: "nfc-new-janaki",
  NNCC: "nfc-nikado-kadawatha", RCGA: "nfc-regal-gampaha", RCAG: "eap-regal", RCBB: "nfc-ritz-borella", SCCA: "nfc-sarasavi-alawwa",
  SMGS: "eap-savoy-metro-gampaha", SCMA: "eap-savoy-metro-maharagama", SSCO: "nfc-shamrock-wennappuwa", SNKG: "eap-sinexpo-3d",
  VLCK: "nfc-vijayanthi-kaduwela", RCAC: "nfc-ricky-colombo-02",
};

/** Venues we did not have: name shown on fdfs.lk and the district they sit in. */
const NEW: Record<string, { name: string; city: string; town: string }> = {
  IMDK: { name: "Imperial 3D Cinema", city: "Kurunegala", town: "Kurunegala" },
  RLCP: { name: "Regal Cinemas Polonnaruwa", city: "Polonnaruwa", town: "Polonnaruwa" },
  RCNM: { name: "Ruoo Cinema", city: "Gampaha", town: "Katunayake" },
  CKCK: { name: "CK Cinema", city: "Gampaha", town: "Kirindiwela" },
  SKCM: { name: "SK Cinema", city: "Matara", town: "Matara" },
  TCCK: { name: "Tarzen Cinema", city: "Kegalle", town: "Kegalle" },
  CBBT: { name: "Cinelma Theater", city: "Badulla", town: "Badulla" },
};

/** BookMyShow movie index (file order) → our movie id. Movies we have no page for are left out and not imported. */
const MOVIE_TO_ID: Record<string, string> = {
  "jailer-2": "scope-jailer-2-tamil", "eda-ra": "scope-eda-re-sinhala", "ahasa-tharam": "scope-ahasa-tharam-sinhala",
  "man-hoyanne-premayak": "eap-2002", "teardrop-nation-episode-1": "scope-teardrop-nation-foundations-of-conflict-ep-1",
  "teardrop-nation-episode-2": "scope-teardrop-nation-the-trigger-ep-2", "teardrop-nation-episode-3": "scope-teardrop-nation-battle-for-peace-ep-3",
  "adaraneeya-tharuwak": "scope-adaraneeya-tharuwak-sinhala", "street-fighter": "scope-street-fighter", dorothy: "eap-2024",
  baththa: "scope-baththa-tamil", clayface: "scope-clayface-2026", "heart-of-the-beast": "scope-heart-of-the-beast",
  "meesaya-murukku-2": "eap-2020", "cricket-sadu": "scope-cricket-sadu-sinhala", "avengers-endgame-encore-3d": "scope-avengers-endgame-encore-2026",
  digger: "scope-digger-2026", "resident-evil": "scope-resident-evil", "linkin-park-unshatter": "scope-linkin-park-unshatter",
};

/** Movies BookMyShow lists that no other source had. Details from each movie's BookMyShow page; posters saved in public/images/posters. */
const EXTRA_MOVIES: (Omit<Movie, "id" | "status" | "featured" | "certificate" | "backdropUrl" | "trailerUrl" | "posterUrl"> & { bms: string; status?: Movie["status"] })[] = [
  { bms: "ayu", slug: "ayu-sinhala", title: "Ayu", language: "Sinhala", genres: ["Drama"], runtimeMin: 116, releaseDate: "2025-10-02", synopsis: "A young doctor starts married life full of hope, then a run of misfortunes upends it, and she is forced to face the person behind her suffering.", cast: ["Sandra Mack", "Malani Fonseka", "Jagath Manuwarna", "Ashan Dias", "Samanalee Fonseka"], director: "Chathra Weeraman" },
  { bms: "dinga", slug: "dinga-sinhala", title: "Dinga", language: "Sinhala", genres: ["Drama"], runtimeMin: null, releaseDate: "2026-10-16", synopsis: "An inexperienced young man tries a drastic fix to escape his nightmares and peer pressure, setting off an unexpected chain of events in modern Colombo.", cast: [], director: "" },
  { bms: "drishyam-the-conclusion", slug: "drishyam-the-conclusion-hindi", title: "Drishyam: The Conclusion", language: "Hindi", genres: ["Drama", "Mystery", "Thriller"], runtimeMin: null, releaseDate: "2026-10-02", synopsis: "The final chapter of the Drishyam thriller series.", cast: ["Ajay Devgn", "Tabu", "Shriya Saran", "Rajat Kapoor", "Ishita Dutta", "Jaideep Ahlawat", "Prakash Raj"], director: "Abhishek Pathak" },
  { bms: "angel-and-the-badman", slug: "angel-and-the-badman", title: "Angel And The Badman", language: "English", genres: ["Western", "Drama"], runtimeMin: 105, releaseDate: "2026-10-23", status: "coming_soon", synopsis: "", cast: ["Zachary Levi", "Neal McDonough", "Tommy Lee Jones"], director: "Julio Quintana" },
  { bms: "udta-teer", slug: "udta-teer-hindi", title: "Udta Teer", language: "Hindi", genres: ["Comedy", "Spy"], runtimeMin: null, releaseDate: "2026-10-23", status: "coming_soon", synopsis: "", cast: ["Ayushmann Khurrana", "Sara Ali Khan", "Rahul Bose", "Ram Kapoor"], director: "Akash A. Kaushik" },
  { bms: "porattam", slug: "porattam-tamil", title: "Porattam", language: "Tamil", genres: ["Drama", "Sports"], runtimeMin: null, releaseDate: "2026-10-02", synopsis: "A gifted footballer from a poor coastal town fights to reach the national team while facing debt, personal loss and repeated setbacks.", cast: ["Reegan Kandiah"], director: "Raj Sivaraj" },
  { bms: "anbil-avan", slug: "anbil-avan-tamil", title: "Anbil Avan", language: "Tamil", genres: ["Romance", "Action", "Drama"], runtimeMin: 154, releaseDate: "2026-10-02", synopsis: "", cast: ["Ashok Selvan", "Preity Mukhundhan", "Revathi"], director: "R Kaarthikeyan" },
  { bms: "villain", slug: "villain-sinhala", title: "Villain", language: "Sinhala", genres: ["Action"], runtimeMin: null, releaseDate: "2024-01-04", synopsis: "", cast: ["Kelum Aryan", "Dasuni Sinethma", "Sudhiksha Samadhi", "Sanju Samarasinghe", "Sheran Peiris"], director: "Lassana Jayasekara" },
  { bms: "ethalaya", slug: "ethalaya-sinhala", title: "Ethalaya", language: "Sinhala", genres: ["Action"], runtimeMin: 98, releaseDate: "2020-03-05", synopsis: "", cast: ["Kelum Kularatne", "Chamathka Lakmini", "Shehani Perera"], director: "Nalaka Vithanage" },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export interface BmsResult { added: number; theatresWith: number; skippedHasOwnTimes: number; unmatchedMovies: string[] }

/** Adds BookMyShow showtimes (with prices) for theatres that have none yet, creating the few theatres we were missing. Mutates both arrays. */
export function applyBms(theatres: Theatre[], showtimes: Showtime[], movieList: Movie[], file = new URL("../../data/raw/bookmyshow.txt", import.meta.url)): BmsResult {
  const text = readFileSync(file, "utf8").split("\n");
  const section = (name: string) => {
    const i = text.indexOf(name);
    const out: string[] = [];
    for (let k = i + 1; k < text.length && !/^[A-Z]+$/.test(text[k]); k++) if (text[k]) out.push(text[k]);
    return out;
  };
  const venues = new Map(section("VENUES").map((l) => { const [i, rest] = l.split("="); const [code, name, lat, lng] = rest.split("|"); return [i, { code, name, lat, lng }]; }));
  const movies = new Map(section("MOVIES").map((l) => { const [i, rest] = l.split("="); const [code, slug] = rest.split("|"); return [i, { code, slug }]; }));
  const groups = new Map(section("GROUPS").map((l) => { const [i, g] = l.split("="); return [i, g]; }));

  for (const m of EXTRA_MOVIES) {
    const id = `bms-${m.slug}`;
    MOVIE_TO_ID[m.bms] = id;
    const { bms: _bms, status, ...rest } = m;
    const at = movieList.findIndex((x) => x.id === id);
    const full: Movie = { ...rest, id, status: status ?? "now_showing", featured: false, certificate: "", backdropUrl: "", trailerUrl: "", posterUrl: `/images/posters/${m.slug}.webp`, synopsis: m.synopsis || `${m.title} is a ${m.language} film showing in Sri Lanka.` };
    if (at >= 0) movieList[at] = full;
    else movieList.push(full);
  }

  const hasOwn = new Set(showtimes.map((s) => s.theatreId));
  const byId = new Map(theatres.map((t) => [t.id, t]));
  const result: BmsResult = { added: 0, theatresWith: 0, skippedHasOwnTimes: 0, unmatchedMovies: [] };
  const touched = new Set<string>();
  const unmatched = new Set<string>();
  const skipped = new Set<string>();

  const theatreFor = (v: { code: string; name: string; lat: string; lng: string }): Theatre | undefined => {
    const known = VENUE_TO_THEATRE[v.code];
    if (known) return byId.get(known);
    const n = NEW[v.code];
    if (!n) return undefined;
    const id = `bms-${slugify(n.name)}-${slugify(n.town)}`;
    let t = byId.get(id);
    if (!t) {
      t = { id, cinemaId: cinema.id, slug: slugify(`${n.name} ${n.town}`), name: n.name, city: n.city, town: n.town, address: `${n.town}, ${n.city}`, mapsUrl: `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`, formats: ["2D"], experiences: [], phone: "", confirmed: true };
      theatres.push(t);
      byId.set(id, t);
    }
    return t;
  };

  for (const line of section("LINES")) {
    const [key, rest] = line.split("=");
    const [mi, vi, gi] = key.split(".");
    const [times, days] = rest.split("@");
    const movie = movies.get(mi)!;
    const movieId = MOVIE_TO_ID[movie.slug];
    if (!movieId) { unmatched.add(movie.slug); continue; }
    const venue = venues.get(vi)!;
    const th = theatreFor(venue);
    if (!th) continue;
    if (hasOwn.has(th.id)) { skipped.add(th.id); continue; }
    const format = /3D$/.test(groups.get(gi) ?? "") ? "3D" : "2D";
    for (const d of days.split(",")) {
      if (d === "25") continue; // no tab for the 25th on the site; the page just repeats today
      const date = `2026-10-${d.padStart(2, "0")}`;
      for (const t of times.split(",")) {
        const [hhmm, price] = t.split(":");
        const lowest = price ? Number(price.split("-")[0]) : undefined;
        showtimes.push({
          movieId, theatreId: th.id, date, time: `${hhmm.slice(0, 2)}:${hhmm.slice(2)}`, format,
          bookingUrl: `https://lk.bookmyshow.com/buytickets/${movie.slug}-sri-lanka/movie-snlk-${movie.code}-MT/${date.replaceAll("-", "")}`,
          ...(lowest ? { price: lowest } : {}),
        });
        result.added++;
      }
    }
    touched.add(th.id);
  }
  for (const id of touched) {
    const t = byId.get(id)!;
    if (t.cinemaId === "nfc") t.cinemaId = cinema.id;
    delete t.source;
    t.confirmed = true;
    if (t.formats.length === 0) t.formats = ["2D"];
  }
  result.theatresWith = touched.size;
  result.skippedHasOwnTimes = skipped.size;
  result.unmatchedMovies = [...unmatched];
  return result;
}
