import type { Movie } from "../../lib/types";

const DROP = new Set(["i", "sinhala", "tamil", "hindi", "english", "2026", "eap", "imax", "2d", "3d"]);

/** Comparable key from a slug: drops language/format suffixes so "jailer-2-tamil" and "jailer-2" meet. */
export const slugBase = (slug: string) => slug.split("-").filter((t) => t && !DROP.has(t)).join("-");

const titleKey = (t: string) =>
  t.replace(/\([^)]*\)/g, "").replace(/[^\x00-\x7F]/g, " ").toLowerCase().replace(/\b(i|imax|2d|3d|sinhala|tamil|hindi|english)\b/g, " ").replace(/[^a-z0-9]/g, "");

/** Find the movie already known under another site's naming, preferring the plain (non-IMAX) edition. */
export function findMovie(movies: Movie[], title: string, slug: string): Movie | undefined {
  const base = slugBase(slug);
  const tk = titleKey(title);
  const hits = movies.filter((m) => (tk && titleKey(m.title) === tk) || slugBase(m.slug) === base);
  return hits.find((m) => !/imax/i.test(m.slug)) ?? hits[0];
}
