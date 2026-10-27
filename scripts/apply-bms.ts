import { readFileSync, writeFileSync } from "node:fs";
import type { Showtime } from "../lib/types";
import { applyBms, cinema } from "./scrapers/bookmyshow";
import { deriveSpecs } from "./lib/specs";
import { isUpcomingShowtime } from "./lib/showtime-window";
import { createShowtimesCsv } from "./lib/showtimes-csv";

/** Re-applies the BookMyShow snapshot to the data files without running the full scrape. Safe to repeat: earlier BookMyShow rows are cleared first. */
const dir = new URL("../data/", import.meta.url);
const read = (f: string) => JSON.parse(readFileSync(new URL(f, dir), "utf8"));
const write = (f: string, v: unknown) => writeFileSync(new URL(f, dir), JSON.stringify(v, null, 2) + "\n");

const showtimes = read("showtimes.json").filter((s: Showtime) => !s.bookingUrl.startsWith("https://lk.bookmyshow.com/"));
const theatres = read("theatres.json");
const movies = read("movies.json");
const result = applyBms(theatres, showtimes, movies);
const movieIds = new Set(movies.map((movie: { id: string }) => movie.id));
const theatreIds = new Set(theatres.map((theatre: { id: string }) => theatre.id));
const currentShowtimes = showtimes.filter((showtime: Showtime) =>
  isUpcomingShowtime(showtime) && movieIds.has(showtime.movieId) && theatreIds.has(showtime.theatreId),
);
write("movies.json", movies);
write("showtimes.json", currentShowtimes);
write("theatres.json", deriveSpecs(theatres));
const cinemas = read("cinemas.json").filter((c: { id: string }) => c.id !== cinema.id);
write("cinemas.json", [...cinemas, cinema]);
writeFileSync(new URL("../public/showtimes.csv", import.meta.url), createShowtimesCsv(currentShowtimes, movies, theatres));
console.log(result, `${currentShowtimes.length} upcoming showtimes total (${showtimes.length - currentShowtimes.length} expired or unmatched sessions removed)`);
