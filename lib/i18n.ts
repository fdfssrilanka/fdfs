// UI strings live here so Sinhala/Tamil dictionaries can be added later without touching components.
const en = {
  "nav.movies": "Movies",
  "nav.theatres": "Theatres",
  "nav.comingSoon": "Coming Soon",
  "search.placeholder": "Search movies, theatres",
  "city.select": "Select city",
  "hero.getShowtimes": "Get Showtimes",
  "hero.watchTrailer": "Watch Trailer",
  "row.nowShowing": "Now Showing",
  "row.comingSoon": "Coming Soon",
  "row.language": "{lang} Movies",
  "row.theatresNear": "Theatres near you",
  "card.nowShowing": "Now Showing",
  "card.releasing": "Releasing {date}",
  "movie.showtimes": "Showtimes",
  "movie.overview": "Overview",
  "movie.cast": "Cast",
  "movie.trailer": "Trailer",
  "movie.director": "Director",
  "movie.allCities": "All cities",
  "movie.allFormats": "All formats",
  "movie.noShowtimes": "No showtimes published for this date.",
  "movie.otherBooking": "Also showing at",
  "movie.bookOn": "Book on {site}",
  "movie.viewMap": "View map",
  "theatre.noShowtimes": "Showtimes for this theatre aren't published yet.",
  "theatre.visitSite": "Check showtimes on {site}",
  "theatre.nowShowingHere": "Showing here",
  "filter.all": "All",
  "filter.genre": "Genre",
  "filter.language": "Language",
  "empty.movies": "No movies match these filters.",
  "footer.disclaimer": "fdfs.lk lists showtimes from public cinema websites. Tickets are sold by the cinemas.",
} as const;

export type StringKey = keyof typeof en;

export function t(key: StringKey, vars: Record<string, string | number> = {}): string {
  return Object.entries(vars).reduce((s: string, [k, v]) => s.replace(`{${k}}`, String(v)), en[key]);
}
