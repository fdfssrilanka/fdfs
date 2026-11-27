import { get } from "../lib/http";
import { titleCase } from "./scope";
import type { Cinema, Listing, Movie, Showtime, Theatre } from "../../lib/types";

const BASE = "https://eapmovies.com";

export const cinema: Cinema = {
  id: "eap",
  name: "EAP Films & Theatres (Savoy)",
  website: BASE,
  bookingSite: `${BASE}/showtimes`,
};

/** EAP's location slug → the id, page slug and short name fdfs.lk has always used for that hall, so its address doesn't change. */
const KNOWN: Record<string, { id: string; slug: string; name: string }> = {
  "savoy-metro-maharagama": { id: "eap-savoy-metro-maharagama", slug: "savoy-metro-maharagama-maharagama", name: "Savoy Metro Maharagama" },
  "savoy-metro-gampaha": { id: "eap-savoy-metro-gampaha", slug: "savoy-metro-gampaha-gampaha", name: "Savoy Metro Gampaha" },
  "savoy-premier-rajagiriya": { id: "eap-savoy-premier-rajagiriya", slug: "savoy-premier-rajagiriya-rajagiriya", name: "Savoy Premier Rajagiriya" },
  "regal-ambalangoda": { id: "eap-regal", slug: "regal-ambalangoda", name: "Regal" },
  "sinexpo-3d-kurunegala": { id: "eap-sinexpo-3d", slug: "sinexpo-3d-kurunegala", name: "Sinexpo 3D" },
  "jothi-rathnapura": { id: "eap-jothi", slug: "jothi-rathnapura", name: "Jothi" },
  "willmax-anuradhapura": { id: "eap-willmax", slug: "willmax-anuradhapura", name: "Willmax" },
  "cinemax-3d-jaela": { id: "eap-cinemax-3d", slug: "cinemax-3d-jaela", name: "Cinemax 3D" },
  "concord-dehiwala": { id: "eap-concord", slug: "concord-dehiwala", name: "Concord" },
  "savoy-3d-dolby-atmos-wellawatte": { id: "eap-savoy-3d-dolby-atmos", slug: "savoy-3d-dolby-atmos-wellawatte", name: "Savoy 3D Dolby ATMOS" },
};

/** The hall's experience label on eapmovies.com → the badges we show. */
const EXPERIENCES: Record<string, string[]> = { "Dolby Atmos": ["Dolby Atmos", "3D"], "3D Digital": ["3D"] };

/** The site is a Next.js app: its data sits in the page as a stream of escaped string chunks. Join them back into one text. */
const flight = (html: string) => [...html.matchAll(/self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g)].map((m) => JSON.parse(m[1]) as string).join("");

/** The JSON array stored under `key` in that text (brackets inside strings are skipped). */
function arrayAt<T = unknown>(text: string, key: string): T[] {
  const start = text.indexOf(`"${key}":[`);
  if (start < 0) return [];
  const i = start + key.length + 3;
  let depth = 0;
  let inString = false;
  for (let j = i; j < text.length; j++) {
    const c = text[j];
    if (inString) {
      if (c === "\\") j++;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === "[") depth++;
    else if (c === "]" && --depth === 0) return JSON.parse(text.slice(i, j + 1));
  }
  return [];
}

const strip = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#x27;|&apos;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
/** "2026-11-12T18:30:00.000Z" (midnight in Colombo, written in UTC) → "2026-11-13". */
const colomboDate = (iso: unknown) => {
  const t = typeof iso === "string" ? Date.parse(iso.replace(/^\$D/, "")) : NaN;
  return Number.isNaN(t) ? "" : new Date(t + 5.5 * 3_600_000).toISOString().slice(0, 10);
};
const runtime = (s: string) => {
  const m = (s ?? "").match(/(\d+)\s*HR\s*(\d+)\s*MIN/i);
  return m ? +m[1] * 60 + +m[2] || null : null;
};
const youtube = (u: unknown) => {
  const id = typeof u === "string" ? u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/)?.[1] : undefined;
  return id ? `https://www.youtube.com/watch?v=${id}` : "";
};

interface Session { date: string; session_start_time: string; experience_name: string }
interface Location { location_slug: string; theater_name: string; city: string; map_url: string; tel_no1: string; sessions: Session[] }
interface SessionMovie { movie_slug: string; movie_name: string; movie_image: string; genres: string[]; language: string; run_time: string; release_date: string | null; movie_data?: { trailer_youtube_url?: string }; locations: Location[] }
interface ListMovie { slug: string; name: string; image: string; genres: { genre: string }[]; language: string; run_time: string; synopsis: string; release_date: string; trailer_youtube_url: string }
interface SiteTheatre { name: string; city: string; slug: string; address_line1: string; map_url: string; experiences: string[] }

/**
 * eapmovies.com (relaunched as "Savoy Cinemas" in November 2026). Three kinds of page are read:
 * /locations (the halls), /showtimes (every session of every movie for all published dates) and /movies/<slug> (cast, director, synopsis).
 */
export async function scrape() {
  const site = arrayAt<SiteTheatre>(flight(await get(`${BASE}/locations`)), "theaterList");
  const sessionMovies = arrayAt<SessionMovie>(flight(await get(`${BASE}/showtimes`)), "sessionsList");
  const listed = arrayAt<ListMovie>(flight(await get(`${BASE}/movies`)), "initialMovieList");
  if (!site.length || !sessionMovies.length) throw new Error("eapmovies.com: no theatres or sessions found; the page layout has probably changed");

  const phones = new Map<string, string>();
  for (const m of sessionMovies) for (const l of m.locations) if (l.tel_no1) phones.set(l.location_slug, l.tel_no1);

  const theatres: Theatre[] = site.map((t) => {
    const known = KNOWN[t.slug] ?? { id: `eap-${t.slug}`, slug: t.slug, name: t.name };
    const badges = [...new Set(t.experiences.flatMap((e) => EXPERIENCES[e] ?? []))];
    const address = t.address_line1.trim();
    return {
      ...known, cinemaId: "eap", city: t.city.replace(/^colombo$/i, "Colombo"),
      address: /colombo \d/i.test(address) || address.toLowerCase().includes(t.city.toLowerCase().slice(0, 5)) ? address : `${address}, ${t.city}`,
      mapsUrl: t.map_url.trim(), formats: ["2D", ...badges], experiences: badges, phone: phones.get(t.slug) ?? "",
    };
  });
  const theatreId = new Map(site.map((t, i) => [t.slug, theatres[i].id]));

  const slugs = [...new Set([...sessionMovies.map((m) => m.movie_slug), ...listed.map((m) => m.slug)])];
  const movies: (Movie & { eapCid: string })[] = [];
  const showtimes: Showtime[] = [];

  for (const slug of slugs) {
    const s = sessionMovies.find((m) => m.movie_slug === slug);
    const l = listed.find((m) => m.slug === slug);
    const rawTitle = (s?.movie_name ?? l?.name ?? slug).trim();
    const bracket = rawTitle.match(/\((Sinhala|Tamil|Hindi|English|Telugu|Malayalam)\)/i)?.[1] ?? "";
    const language = [s?.language, l?.language].find((x) => x && x !== "Other") ?? (bracket ? bracket[0].toUpperCase() + bracket.slice(1).toLowerCase() : "");

    // The movie's own page has the people and the wide banner.
    const page = flight(await get(`${BASE}/movies/${slug}`));
    const at = page.indexOf(`"slug":"${slug}","you_tube_link"`);
    const near = at >= 0 ? page.slice(Math.max(0, at - 6000), at + 6000) : "";
    const list = (key: string): string[] => { try { return JSON.parse(near.match(new RegExp(`"${key}":(\\[[^\\]]*\\])`))?.[1] ?? "[]"); } catch { return []; } };
    const synopsis = near.match(/"synopsis":("(?:[^"\\]|\\.)*")/)?.[1];

    const id = `eap-${slug}`;
    movies.push({
      eapCid: slug, id, slug, title: titleCase(rawTitle.replace(/\s*\([^)]*\)\s*$/, "").replace(/\s+[23]D$/i, "").trim()), language,
      genres: s?.genres?.length ? s.genres : (l?.genres ?? []).map((g) => g.genre),
      runtimeMin: runtime(s?.run_time ?? l?.run_time ?? ""), certificate: "", releaseDate: colomboDate(s?.release_date ?? l?.release_date), status: "now_showing", featured: false,
      synopsis: strip(synopsis ? JSON.parse(synopsis) : (l?.synopsis ?? "")), cast: arrayAt<{ actor_name: string }>(near, "movieCastList").map((c) => c.actor_name).filter(Boolean), director: list("directors").join(", "),
      posterUrl: s?.movie_image ?? l?.image ?? "", backdropUrl: near.match(/"banner_image":"(https:[^"]+)"/)?.[1] ?? "",
      trailerUrl: youtube(s?.movie_data?.trailer_youtube_url ?? l?.trailer_youtube_url),
    });

    const is3d = /\b3D\b/.test(rawTitle);
    const bookingUrl = `${BASE}/showtimes?movie_slug=${slug}`;
    for (const loc of s?.locations ?? []) {
      const th = theatreId.get(loc.location_slug);
      if (!th) continue;
      for (const x of loc.sessions) {
        const time = x.session_start_time?.slice(11, 16);
        if (!x.date || !/^\d\d:\d\d$/.test(time ?? "")) continue;
        showtimes.push({ movieId: id, theatreId: th, date: x.date, time, format: is3d ? "3D" : x.experience_name === "Dolby Atmos" ? "Dolby Atmos" : "2D", bookingUrl });
      }
    }
  }

  // A movie EAP lists but has no showtimes for still gets a link to its page.
  const withTimes = new Set(showtimes.map((x) => x.movieId));
  const listings: Listing[] = movies.filter((m) => !withTimes.has(m.id)).map((m) => ({ movieId: m.id, cinemaId: "eap", bookingUrl: `${BASE}/movies/${m.eapCid}` }));
  return { cinema, theatres, movies, showtimes, listings };
}
