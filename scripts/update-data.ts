import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { download } from "./lib/http";
import { toWebp } from "./lib/images";
import * as scope from "./scrapers/scope";
import * as eap from "./scrapers/eap";
import * as pvr from "./scrapers/pvr";
import * as other from "./scrapers/other";
import * as jp from "./scrapers/jp";
import * as tm from "./scrapers/ticketmaster";
import * as nfc from "./scrapers/nfc";
import * as tt from "./scrapers/taktikbook";
import * as offersScraper from "./scrapers/offers";
import * as dialus from "./scrapers/dialus";
import { findMovie } from "./lib/match";
import type { Movie, Showtime } from "../lib/types";

const DATA = path.join(process.cwd(), "data");
const IMG = path.join(process.cwd(), "public", "images");
const exists = (p: string) => access(p).then(() => true, () => false);

/** Download artwork once, then keep a resized WebP copy under /public/images. */
async function localImage(url: string, dir: "posters" | "backdrops" | "offers", slug: string): Promise<string> {
  if (!url) return "";
  const webp = path.join(IMG, dir, `${slug}.webp`);
  if (!(await exists(webp))) {
    await mkdir(path.dirname(webp), { recursive: true });
    const ext = path.extname(new URL(url).pathname).toLowerCase() || ".jpg";
    const raw = path.join(IMG, dir, `${slug}${ext}`);
    if (!(await download(url, raw))) return console.warn("image failed", url), "";
    try {
      await toWebp(raw, dir);
    } catch (err) {
      console.warn("image convert failed", url, (err as Error).message);
      return "";
    }
  }
  return `/images/${dir}/${slug}.webp`;
}

async function main() {
  const [s, e, j, t, n] = [await scope.scrape(), await eap.scrape(), await jp.scrape(), await tm.scrape(), await nfc.scrape()];
  const ttTheatres = await tt.scrape();
  const movies: Movie[] = [...s.movies];
  const showtimes: Showtime[] = [...s.showtimes];
  const listings = [];

  /** Reuse a movie another site already lists (filling its gaps), otherwise add it. Returns the id to use. */
  const adopt = (m: Movie): string => {
    const match = findMovie(movies, m.title, m.slug);
    if (!match) {
      let slug = m.slug;
      while (movies.some((x) => x.slug === slug)) slug += "-2";
      movies.push({ ...m, slug });
      return m.id;
    }
    match.certificate ||= m.certificate;
    match.runtimeMin ||= m.runtimeMin;
    match.trailerUrl ||= m.trailerUrl;
    match.director ||= m.director;
    if (!match.genres.length) match.genres = m.genres;
    if (!match.cast.length) match.cast = m.cast;
    return match.id;
  };

  for (const src of [j, t]) {
    const ids = new Map(src.movies.map((m) => [m.id, adopt(m)]));
    for (const st of src.showtimes) showtimes.push({ ...st, movieId: ids.get(st.movieId) ?? st.movieId });
  }

  // EAP: movies it also shares with other cinemas reuse them; its showtimes follow the same ids.
  {
    const ids = new Map<string, string>();
    for (const m of e.movies) {
      const { eapCid, ...movie } = m;
      void eapCid;
      ids.set(m.id, adopt({ ...movie, slug: `${movie.slug}-eap` }));
    }
    for (const st of e.showtimes) showtimes.push({ ...st, movieId: ids.get(st.movieId) ?? st.movieId });
    for (const l of e.listings) listings.push({ ...l, movieId: ids.get(l.movieId) ?? l.movieId });
  }

  for (const m of movies) {
    m.posterUrl = await localImage(m.posterUrl, "posters", m.slug);
    m.backdropUrl = await localImage(m.backdropUrl, "backdrops", m.slug);
  }
  const offers = await offersScraper.scrape();
  for (const o of offers) o.imageUrl = await localImage(o.imageUrl, "offers", o.id);

  const featured = movies.filter((m) => m.status === "now_showing" && m.backdropUrl && m.trailerUrl).slice(0, 5);
  featured.forEach((m) => (m.featured = true));

  const theatres = [...s.theatres, ...e.theatres, ...pvr.theatres, ...j.theatres, ...t.theatres, ...other.theatres];
  for (const th of theatres) {
    const extra = n.enrich[th.id];
    if (!extra) continue;
    th.phone ||= extra.phone;
    th.details ||= extra.details;
  }

  // TakTikBook knows some of the directory-only cinemas better (full address, phone, online booking).
  const words = (x: string) => x.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter((w) => w.length >= 3 && !["cinema", "new", "the"].includes(w));
  for (const th of n.theatres) {
    const hit = ttTheatres.find((x) => th.address.toLowerCase().includes(x.city.toLowerCase()) && words(x.name).some((w) => words(th.name).includes(w)));
    if (!hit) continue;
    if (hit.address.length > th.address.length) th.address = `${hit.address}, ${hit.city}`;
    th.phone ||= hit.phone;
    if (hit.online) {
      th.cinemaId = "taktikbook";
      th.bookingUrl = `https://www.taktikbook.lk/theater/${hit.slug}`;
    }
  }

  // Cross-check directory-only cinemas against a second directory: same phone number, or same town and a shared name word.
  const dl = await dialus.scrape();
  const digits = (p: string) => p.replace(/\D/g, "").replace(/^94/, "0").slice(-10);
  const nameWords = (x: string) => x.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter((w) => w.length >= 3 && !["cinema", "cinemas", "theatre", "theater", "the", "new"].includes(w));
  let confirmed = 0;
  for (const th of [...n.theatres, ...theatres]) {
    if (th.source !== "nfc") continue;
    const town = th.address.split(",")[0].toLowerCase();
    const hit = dl.find((d) => (th.phone && d.phone && digits(th.phone) === d.phone) || (d.town.toLowerCase().includes(town) && nameWords(d.name).some((w) => nameWords(th.name).includes(w))));
    if (!hit) continue;
    th.confirmed = true;
    confirmed++;
    if (hit.address.length > th.address.length + 8 && hit.address.toLowerCase().includes(town)) th.address = hit.address.replace(/,?\s*Sri Lanka\.?$/i, "");
    th.phone ||= `+94${hit.phone.replace(/^0/, "")}`;
  }
  console.log(`directory cross-check: ${confirmed} of ${n.theatres.length} directory-only cinemas matched a second directory (${dl.length} entries read)`);

  const out = {
    "movies.json": movies,
    "cinemas.json": [s.cinema, e.cinema, pvr.cinema, j.cinema, t.cinema, ...other.cinemas, n.cinema, tt.cinema],
    "theatres.json": [...theatres, ...n.theatres],
    "showtimes.json": showtimes,
    "listings.json": listings,
    "offers.json": offers,
  };
  await mkdir(DATA, { recursive: true });
  for (const [f, v] of Object.entries(out)) await writeFile(path.join(DATA, f), JSON.stringify(v, null, 2) + "\n");
  console.log(`${movies.length} movies, ${out["theatres.json"].length} theatres, ${showtimes.length} showtimes, ${listings.length} listings, ${offers.length} offers`);
}

main().catch((err) => (console.error(err), process.exit(1)));
