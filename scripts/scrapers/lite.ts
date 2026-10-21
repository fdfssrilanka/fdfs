import type { Cinema, Listing, Theatre } from "../../lib/types";

/** Lite Cinemas' 13 venues as listed on https://www.litecinemas.lk/theaters (name, town, projection, sound, 3D, A/C). */
export const LITE_URL = "https://www.litecinemas.lk/theaters";

export const cinema: Cinema = { id: "lite", name: "Lite Cinemas", website: "https://www.litecinemas.lk", bookingSite: LITE_URL };

interface Venue { id: string; name: string; town: string; city: string; projection: string; sound: string; threeD: boolean; ac: boolean; phone?: string }

const V = (id: string, name: string, town: string, city: string, projection: string, sound: string, threeD = true, ac = true): Venue => ({ id, name, town, city, projection, sound, threeD, ac });

export const VENUES: Venue[] = [
  V("nfc-max-lite", "MaxX Lite 3D Cinema", "Moratuwa", "Colombo", "2K Laser", "Dolby 7.1"),
  V("nfc-amity-lite", "Amity Lite 3D Cinema", "Maharagama", "Colombo", "2K Laser", "Dolby 5.1"),
  V("lite-aqua-negombo", "Aqua Lite 3D Cinema", "Negombo", "Gampaha", "2K Projection", "Dolby 7.1"),
  V("nfc-sky-lite", "Sky Lite 3D Cinema", "Matara", "Matara", "2K Projection", "Dolby 7.1"),
  V("nfc-city-cinema", "City Lite 3D Cinema", "Mount Lavinia", "Colombo", "2K Projection", "Dolby 7.1"),
  V("nfc-vox-lite", "VoxX Lite 3D Cinema", "Avissawella", "Colombo", "2K Projection", "Dolby 5.1"),
  V("lite-priska-kalutara", "Priska Lite 3D Cinema", "Kalutara", "Kalutara", "2K Projection", "Dolby 7.1"),
  V("nfc-cinesha-cinema-misty-lite", "Misty Lite 3D Cinema", "Nawalapitiya", "Kandy", "2K Projection", "Dolby 7.1"),
  V("nfc-vijayanthi-kaduwela", "Vijayanthi by Lite Cinemas", "Kaduwela", "Colombo", "2K Projection", "Dolby 7.1"),
  V("nfc-nikado-kadawatha", "Nikado by Lite Cinemas", "Kadawatha", "Gampaha", "2K Projection", "Dolby 7.1"),
  V("nfc-lekha-homagama", "Lite Cinema (Lekha)", "Homagama", "Colombo", "2K Projection", "Dolby 7.1"),
  V("lite-neela-dankotuwa", "Neela by Lite Cinemas", "Dankotuwa", "Puttalam", "2K Projection", "Dolby 5.1"),
  V("nfc-sarasavi-alawwa", "Sarasavi by Lite Cinemas", "Alawwa", "Kurunegala", "2K Projection", "Dolby 5.1", false),
];

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Rename, re-brand and add specs to the Lite venues already in the list; add any that are missing. */
export function applyLite(theatres: Theatre[]): Theatre[] {
  for (const v of VENUES) {
    const specs = [v.projection, v.sound, ...(v.threeD ? ["3D"] : []), ...(v.ac ? ["AC"] : [])];
    const experiences = [...(v.threeD ? ["3D"] : []), ...(v.ac ? ["Air Conditioned"] : [])];
    const formats = ["2D", ...(v.threeD ? ["3D"] : [])];
    let th = theatres.find((x) => x.id === v.id);
    if (!th) {
      th = { id: v.id, cinemaId: "lite", slug: slugify(v.name), name: v.name, city: v.city, town: v.town, address: `${v.town}, ${v.city}`, mapsUrl: maps(`${v.name} ${v.town} Sri Lanka`), formats, experiences, phone: "" };
      theatres.push(th);
    }
    th.name = v.name;
    th.cinemaId = "lite";
    th.town = v.town;
    th.formats = formats;
    th.experiences = experiences;
    th.specs = specs;
    th.bookingUrl = LITE_URL;
    th.mapsUrl = maps(`${v.name} ${v.town} Sri Lanka`);
    th.confirmed = true;
    delete th.source;
  }
  return theatres;
}

/** Movies Lite's own pages list as showing (https://www.litecinemas.lk/movies/<slug>), mapped to our movie ids. Per-time showtimes sit inside Lite's BookMyShow widget, so we link out instead. */
export const LISTINGS: Listing[] = [
  ["scope-eda-re-sinhala", "eda-raa"],
  ["scope-jailer-2-tamil", "jailer-2"],
  ["scope-ahasa-tharam-sinhala", "ahasa-tharam"],
  ["scope-cricket-sadu-sinhala", "cricket-sadu"],
].map(([movieId, slug]) => ({ movieId, cinemaId: "lite", bookingUrl: `https://www.litecinemas.lk/movies/${slug}` }));
