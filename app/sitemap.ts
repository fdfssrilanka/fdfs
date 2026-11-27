import type { MetadataRoute } from "next";
import { LANGUAGES, getAreas, getCities, getGenrePages, getMovies, getTheatres, hasShowtimes } from "@/lib/data";
import { getChains } from "@/lib/chains";
import { getNearTowns } from "@/lib/nearby";
import { EXPERIENCE_PAGES } from "@/lib/experience-pages";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages built from showtimes change with every data refresh, so they carry the build date.
  // Pages that don't (directory-only cinemas, legal pages) carry no date, so the dates we do send stay believable.
  const lastModified = new Date();
  const u = (path: string, priority: number, fresh = true) => ({ url: `${SITE_URL}${path}`, priority, ...(fresh ? { lastModified } : {}) });
  return [
    u("/", 1),
    u("/movies", 0.9),
    u("/theatres", 0.8),
    u("/areas", 0.6),
    u("/experiences", 0.7),
    u("/coming-soon", 0.7),
    u("/imax", 0.7),
    u("/offers", 0.6),
    u("/book-movie-tickets", 0.7, false),
    u("/cinema-contact-numbers", 0.5, false),
    u("/about", 0.3, false),
    u("/terms", 0.2, false),
    u("/privacy", 0.2, false),
    u("/cookies", 0.2, false),
    ...LANGUAGES.map((l) => u(`/language/${l.toLowerCase()}`, 0.7)),
    ...getChains().map((c) => u(`/cinemas/${c.slug}`, 0.7)),
    ...getGenrePages().map((g) => u(`/genres/${g.slug}`, 0.5)),
    ...getCities().map((c) => u(`/cities/${c.slug}`, 0.7)),
    ...getAreas().map((a) => u(`/areas/${a.slug}`, 0.5, a.theatres.some((t) => hasShowtimes(t.id)))),
    ...getNearTowns().map((n) => u(`/areas/${n.slug}`, 0.5)),
    u("/new-releases", 0.8),
    ...EXPERIENCE_PAGES.map((page) => u(`/experiences/${page.slug}`, 0.6)),
    ...getMovies().map((m) => ({
      ...u(`/movies/${m.slug}`, 0.8),
      ...(m.posterUrl ? { images: [new URL(m.posterUrl, SITE_URL).toString()] } : {}),
    })),
    ...getTheatres().map((x) => u(`/theatres/${x.slug}`, hasShowtimes(x.id) ? 0.7 : 0.4, hasShowtimes(x.id))),
  ];
}
