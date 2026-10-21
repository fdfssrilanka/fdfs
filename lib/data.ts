import { regionOf } from "./geo";
import type { Cinema, Listing, Movie, Showtime, Theatre } from "./types";
import movies from "@/data/movies.json";
import cinemas from "@/data/cinemas.json";
import theatres from "@/data/theatres.json";
import showtimes from "@/data/showtimes.json";
import listings from "@/data/listings.json";

// All reads go through this module so the JSON files can be swapped for a database later.
const M = movies as Movie[];
const C = cinemas as Cinema[];
const T = theatres as Theatre[];
const S = showtimes as Showtime[];
const L = listings as Listing[];

export const LANGUAGES = ["Tamil", "Sinhala", "English", "Hindi"] as const;
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const getMovies = () => M;
export const getMovie = (slug: string) => M.find((m) => m.slug === slug);
export const getMovieById = (id: string) => M.find((m) => m.id === id);
export const getNowShowing = () => M.filter((m) => m.status === "now_showing");
export const getComingSoon = () => M.filter((m) => m.status === "coming_soon");
export const getFeatured = () => M.filter((m) => m.featured);
export const getMoviesByLanguage = (lang: string) => M.filter((m) => m.language.toLowerCase() === lang.toLowerCase());
export const getLanguages = () => [...new Set(M.map((m) => m.language).filter(Boolean))];

export const getCinema = (id: string) => C.find((c) => c.id === id);
export const getTheatres = () => T;
export const getTheatre = (slug: string) => T.find((t) => t.slug === slug);
export const getTheatreById = (id: string) => T.find((t) => t.id === id);
// "Cities" are regions: Colombo includes its suburbs (Wellawatte, Rajagiriya, Dehiwala...).
export const getCities = () => [...new Set(T.map((t) => regionOf(t.city)))].sort().map((name) => ({ name, slug: slugify(name) }));
export const getCity = (slug: string) => getCities().find((c) => c.slug === slug);
export const getTheatresByCity = (city: string) => T.filter((t) => regionOf(t.city) === city);

export const getShowtimes = () => S;
export const getShowtimesForMovie = (movieId: string) => S.filter((s) => s.movieId === movieId);
export const getShowtimesForTheatre = (theatreId: string) => S.filter((s) => s.theatreId === theatreId);
export const getListings = (movieId: string) => L.filter((l) => l.movieId === movieId);
export const getMoviesAtTheatre = (theatreId: string) => {
  const ids = new Set(getShowtimesForTheatre(theatreId).map((s) => s.movieId));
  return M.filter((m) => ids.has(m.id));
};
export const getMoviesInCity = (city: string) => {
  const ids = new Set(getTheatresByCity(city).flatMap((t) => getShowtimesForTheatre(t.id).map((s) => s.movieId)));
  return M.filter((m) => ids.has(m.id));
};
export const getGenres = (list: Movie[]) => [...new Set(list.flatMap((m) => m.genres))].sort();
export const hasShowtimes = (theatreId: string) => S.some((s) => s.theatreId === theatreId);

const DAY = 86_400_000;
const daysFrom = (date: string) => (new Date(`${date}T12:00:00Z`).getTime() - Date.now()) / DAY;

/** Orange poster corner label: NEW for fresh releases, SOON for imminent ones. */
export function getTag(m: Movie): string | undefined {
  if (!m.releaseDate) return undefined;
  const d = daysFrom(m.releaseDate);
  if (m.status === "now_showing" && d > -10) return "New";
  if (m.status === "coming_soon" && d <= 30) return "Soon";
  return undefined;
}

/** Premium formats a movie plays in, from its published showtimes. */
export function getPremiumFormats(movieId: string): string[] {
  const set = new Set(getShowtimesForMovie(movieId).map((s) => s.format));
  return ["IMAX", "3D", "Dolby Atmos"].filter((f) => set.has(f));
}

export function getNewAndComingSoon(excludeId?: string, limit = 8) {
  const fresh = M.filter((m) => m.status === "now_showing" && m.releaseDate && daysFrom(m.releaseDate) > -14).sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  const soon = M.filter((m) => m.status === "coming_soon").sort((a, b) => (a.releaseDate || "9").localeCompare(b.releaseDate || "9"));
  return [...fresh, ...soon].filter((m) => m.id !== excludeId && m.posterUrl).slice(0, limit);
}

export const getTheatresWithExperience = (name: string) => T.filter((x) => x.experiences.includes(name));

import offers from "@/data/offers.json";
import type { Offer } from "./types";
const O = offers as Offer[];
export const getOffers = () => O;
export const getOffersForCinemas = (cinemaIds: string[]) => O.filter((o) => cinemaIds.includes(o.cinemaId));

// ---- Towns / areas (finer than the region pages: Kiribathgoda, Dehiwala, Malabe, Wattala...) ----
const TOWN_FIX: Record<string, string> = { jaela: "Ja-ela", kaluthara: "Kalutara", wellawatta: "Wellawatte", dehiwela: "Dehiwala", rathnapura: "Ratnapura", mtlavinia: "Mount Lavinia" };
// Scope's cinemas are listed under "Colombo"; these two are searched by suburb.
const TOWN_BY_ID: Record<string, string> = { "scope-colpetty": "Kollupitiya", "scope-kiribathgoda": "Kiribathgoda" };

export function getTown(t: Theatre): string | null {
  const raw = (TOWN_BY_ID[t.id] ?? t.town ?? t.city).trim();
  if (!raw || /^colombo\b/i.test(raw)) return null;
  const name = TOWN_FIX[raw.toLowerCase().replace(/[^a-z]/g, "")] ?? raw;
  // The region pages already cover a district or city by its own name.
  if (getCities().some((c) => c.name.toLowerCase() === name.toLowerCase())) return null;
  return name;
}

export const getAreas = () => {
  const byTown = new Map<string, Theatre[]>();
  for (const t of T) {
    const town = getTown(t);
    if (town) byTown.set(town, [...(byTown.get(town) ?? []), t]);
  }
  return [...byTown.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, theatres]) => ({ name, slug: slugify(name), theatres }));
};
export const getArea = (slug: string) => getAreas().find((a) => a.slug === slug);
