import type { Movie, Showtime, Theatre } from "../../lib/types";

const cell = (value: string | number | undefined) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export function createShowtimesCsv(showtimes: Showtime[], movies: Movie[], theatres: Theatre[]) {
  const movieById = new Map(movies.map((movie) => [movie.id, movie]));
  const theatreById = new Map(theatres.map((theatre) => [theatre.id, theatre]));
  const rows = [...showtimes].sort((a, b) =>
    `${a.date} ${a.time} ${movieById.get(a.movieId)?.title ?? ""} ${theatreById.get(a.theatreId)?.name ?? ""}`.localeCompare(
      `${b.date} ${b.time} ${movieById.get(b.movieId)?.title ?? ""} ${theatreById.get(b.theatreId)?.name ?? ""}`,
    ),
  );
  const lines = [
    ["date", "time", "movie", "theatre", "city", "format", "price_lkr", "booking_url"].join(","),
    ...rows.map((showtime) => {
      const movie = movieById.get(showtime.movieId);
      const theatre = theatreById.get(showtime.theatreId);
      if (!movie || !theatre) {
        throw new Error(`Cannot export showtime with missing movie or theatre: ${showtime.movieId}, ${showtime.theatreId}`);
      }
      return [
        showtime.date,
        showtime.time,
        movie.title,
        theatre.name,
        theatre.city,
        showtime.format,
        showtime.price,
        showtime.bookingUrl,
      ].map(cell).join(",");
    }),
  ];
  return `${lines.join("\n")}\n`;
}
