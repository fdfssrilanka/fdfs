import { readFileSync, writeFileSync } from "node:fs";
import { applyBms, cinema } from "./scrapers/bookmyshow";
import { deriveSpecs } from "./lib/specs";

/** Re-applies the BookMyShow snapshot to the data files without running the full scrape. Safe to repeat: earlier BookMyShow rows are cleared first. */
const dir = new URL("../data/", import.meta.url);
const read = (f: string) => JSON.parse(readFileSync(new URL(f, dir), "utf8"));
const write = (f: string, v: unknown) => writeFileSync(new URL(f, dir), JSON.stringify(v, null, 2) + "\n");

const showtimes = read("showtimes.json").filter((s: { bookingUrl: string }) => !s.bookingUrl.startsWith("https://lk.bookmyshow.com/"));
const theatres = read("theatres.json");
const movies = read("movies.json");
const result = applyBms(theatres, showtimes, movies);
write("movies.json", movies);
write("showtimes.json", showtimes);
write("theatres.json", deriveSpecs(theatres));
const cinemas = read("cinemas.json").filter((c: { id: string }) => c.id !== cinema.id);
write("cinemas.json", [...cinemas, cinema]);
console.log(result, `${showtimes.length} showtimes total`);
