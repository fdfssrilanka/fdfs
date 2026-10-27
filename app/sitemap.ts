import type { MetadataRoute } from "next";
import { LANGUAGES, getAreas, getCities, getMovies, getTheatres } from "@/lib/data";
import { EXPERIENCE_PAGES } from "@/lib/experience-pages";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, priority: number) => ({ url: `${SITE_URL}${path}`, priority });
  return [
    u("/", 1),
    u("/movies", 0.9),
    u("/theatres", 0.8),
    u("/experiences", 0.7),
    u("/coming-soon", 0.7),
    u("/imax", 0.7),
    u("/offers", 0.6),
    u("/book-movie-tickets", 0.7),
    u("/about", 0.3),
    u("/terms", 0.2),
    u("/privacy", 0.2),
    u("/cookies", 0.2),
    ...LANGUAGES.map((l) => u(`/language/${l.toLowerCase()}`, 0.7)),
    ...getCities().map((c) => u(`/cities/${c.slug}`, 0.7)),
    ...getAreas().map((a) => u(`/areas/${a.slug}`, 0.5)),
    ...EXPERIENCE_PAGES.map((page) => u(`/experiences/${page.slug}`, 0.6)),
    ...getMovies().map((m) => ({
      ...u(`/movies/${m.slug}`, 0.8),
      ...(m.posterUrl ? { images: [new URL(m.posterUrl, SITE_URL).toString()] } : {}),
    })),
    ...getTheatres().map((x) => u(`/theatres/${x.slug}`, 0.6)),
  ];
}
