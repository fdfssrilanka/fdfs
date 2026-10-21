import { readFileSync, writeFileSync } from "node:fs";
import { deriveSpecs } from "./lib/specs";
import { LISTINGS, applyLite, cinema } from "./scrapers/lite";

/** Applies the Lite Cinemas venue list to the existing data files without re-running the full scrape. */
const dir = new URL("../data/", import.meta.url);
const theatres = deriveSpecs(applyLite(JSON.parse(readFileSync(new URL("theatres.json", dir), "utf8"))));
writeFileSync(new URL("theatres.json", dir), JSON.stringify(theatres, null, 2) + "\n");
const cinemas = JSON.parse(readFileSync(new URL("cinemas.json", dir), "utf8")).filter((c: { id: string }) => c.id !== "lite");
cinemas.push(cinema);
writeFileSync(new URL("cinemas.json", dir), JSON.stringify(cinemas, null, 2) + "\n");
console.log(`lite venues applied; ${theatres.length} theatres`);
const listings = JSON.parse(readFileSync(new URL("listings.json", dir), "utf8")).filter((l: { cinemaId: string }) => l.cinemaId !== "lite");
writeFileSync(new URL("listings.json", dir), JSON.stringify([...listings, ...LISTINGS], null, 2) + "\n");
