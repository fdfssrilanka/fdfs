import { get } from "../lib/http";
import type { Cinema, Movie, Showtime, Theatre } from "../../lib/types";

const BASE = "https://www.jpcineplex.com";

export const cinema: Cinema = { id: "jp", name: "JP Cineplex", website: BASE, bookingSite: `${BASE}/movies` };

export const theatre: Theatre = {
  id: "jp-kandy", cinemaId: "jp", slug: "jp-cineplex-kandy", name: "JP Cineplex", city: "Kandy",
  address: "No. 377, Peradeniya Road, Kandy", mapsUrl: "https://maps.app.goo.gl/4cS9JLjx91uosgHeA",
  formats: ["Platinum", "Gold", "Luxe", "Silver"], experiences: ["Platinum", "Luxe", "Food to Seat", "Couple Seats", "Dolby Atmos", "Laser", "3D"], phone: "0710186186",
};

const unescape = (h: string) => h.replace(/\\"/g, '"').replace(/\\u003c/g, "<").replace(/\\u003e/g, ">");
const strip = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/\s+/g, " ").trim();

function arrayAfter(h: string, key: string): any[] {
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

const list = (v: unknown): string[] => (typeof v === "string" ? [...v.matchAll(/'([^']+)'/g)].map((m) => m[1].trim()) : Array.isArray(v) ? v.map(String) : []);
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** Sessions carry epoch milliseconds and a direct booking link per showtime. */
export async function scrape() {
  const slugs = [...new Set([...unescape(await get(`${BASE}/`)).matchAll(/href="\/movies\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
  const movies: Movie[] = [];
  const showtimes: Showtime[] = [];

  for (const slug of slugs) {
    const h = unescape(await get(`${BASE}/movies/${slug}`));
    const m = arrayAfter(h, "movieList")[0];
    if (!m) continue;
    const cert = h.match(/<!-- -->\| (U\/A|U|A|PG-13|PG|G|R|12\+|16\+|18\+)<\/p>/)?.[1] ?? "";
    const tokens = list(m.genres);
    const lang = ["Tamil", "Sinhala", "Hindi", "English", "Telugu", "Malayalam"].find((l) => tokens.includes(l))
      ?? (/[඀-෿]/.test(m.movie_name) ? "Sinhala" : /[஀-௿]/.test(m.movie_name) ? "Tamil" : "English");
    const sessions: any[] = Array.isArray(m.sessions) ? m.sessions : [];
    const id = `jp-${slug}`;
    movies.push({
      id, slug, title: String(m.movie_name).replace(/\s+/g, " ").trim(),
      language: lang, genres: tokens.filter((t) => t !== lang), runtimeMin: (m.run_time_hours ?? 0) * 60 + (m.run_time_minutes ?? 0) || null,
      certificate: cert, releaseDate: m.release_date ?? "",
      status: sessions.length || (m.release_date && new Date(m.release_date) <= new Date()) ? "now_showing" : "coming_soon", featured: false,
      synopsis: strip(m.synopsis ?? ""), cast: (Array.isArray(m.movieCastList) ? m.movieCastList : []).map((a: any) => a.actor_name).filter(Boolean),
      director: list(m.directed_by).join(", "), posterUrl: m.mobile_movie_image || m.movie_image || "", backdropUrl: "", trailerUrl: m.trailer_youtube_url || "",
    });
    for (const s of sessions) {
      const p = Object.fromEntries(fmt.formatToParts(new Date(Number(s.session_start_time))).map((x) => [x.type, x.value]));
      showtimes.push({
        movieId: id, theatreId: theatre.id, date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}`,
        format: s.screen_name, bookingUrl: s.session_web_url,
      });
    }
  }
  return { cinema, theatres: [theatre], movies, showtimes };
}
