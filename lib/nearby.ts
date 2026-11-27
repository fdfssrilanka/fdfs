import { distanceKm, type Coords } from "./geo";
import { getTheatres, getTown, slugify } from "./data";
import type { Theatre } from "./types";

/**
 * Approximate centre of each town or suburb that has a listed cinema (town level, not the hall's exact spot).
 * Used only to rank "nearest film halls" for towns that have none of their own; distances are shown as "about".
 */
const TOWN: Record<string, Coords> = {
  Kollupitiya: { lat: 6.9115, lng: 79.851 }, Bambalapitiya: { lat: 6.894, lng: 79.855 }, Wellawatte: { lat: 6.8741, lng: 79.8603 },
  Pamankada: { lat: 6.877, lng: 79.872 }, Dehiwala: { lat: 6.8518, lng: 79.865 }, "Mount Lavinia": { lat: 6.828, lng: 79.869 },
  Borella: { lat: 6.9147, lng: 79.8778 }, Maradana: { lat: 6.929, lng: 79.865 }, Maligawatta: { lat: 6.939, lng: 79.868 },
  Dematagoda: { lat: 6.9367, lng: 79.8808 }, Rajagiriya: { lat: 6.9111, lng: 79.8888 }, Kaduwela: { lat: 6.933, lng: 79.984 },
  Malabe: { lat: 6.904, lng: 79.958 }, Maharagama: { lat: 6.848, lng: 79.9265 }, Homagama: { lat: 6.844, lng: 80.002 },
  Katubedda: { lat: 6.8, lng: 79.889 }, Moratuwa: { lat: 6.773, lng: 79.882 }, Kiribathgoda: { lat: 6.978, lng: 79.923 },
  Wattala: { lat: 6.989, lng: 79.892 }, Kadawatha: { lat: 7.001, lng: 79.953 }, Horana: { lat: 6.715, lng: 80.062 },
  Wadduwa: { lat: 6.667, lng: 79.93 }, Kalutara: { lat: 6.5854, lng: 79.9607 }, Kaluthara: { lat: 6.5854, lng: 79.9607 }, Mathugama: { lat: 6.522, lng: 80.114 },
  Ingiriya: { lat: 6.744, lng: 80.16 }, Kandy: { lat: 7.2906, lng: 80.6337 }, Gampola: { lat: 7.164, lng: 80.577 },
  Matale: { lat: 7.4675, lng: 80.6234 }, Nawalapitiya: { lat: 7.056, lng: 80.534 }, Kegalle: { lat: 7.2513, lng: 80.3464 },
  Alawwa: { lat: 7.293, lng: 80.24 }, Rambukkana: { lat: 7.323, lng: 80.394 }, Kurunegala: { lat: 7.4863, lng: 80.3647 },
  Kuliyapitiya: { lat: 7.469, lng: 80.04 }, Wariyapola: { lat: 7.628, lng: 80.238 }, Melsiripura: { lat: 7.64, lng: 80.507 },
};

/** Searched-for towns with no listed cinema of their own ("nugegoda film hall", "kottawa film halls"...). */
export const NEAR_TOWNS: { name: string; at: Coords }[] = [
  { name: "Nugegoda", at: { lat: 6.8649, lng: 79.8997 } },
  { name: "Kottawa", at: { lat: 6.841, lng: 79.965 } },
  { name: "Bandaragama", at: { lat: 6.714, lng: 79.988 } },
  { name: "Katukurunda", at: { lat: 6.556, lng: 79.969 } },
  { name: "Katugastota", at: { lat: 7.33, lng: 80.628 } },
  { name: "Polgahawela", at: { lat: 7.333, lng: 80.3 } },
];

/** Where a hall is: a hall-level pin when its map link has one, otherwise its town. Scope's Colombo halls are pinned by hand. */
const HALL: Record<string, Coords> = {
  "scope-ccc": { lat: 6.9177, lng: 79.856 }, "scope-hcm": { lat: 6.883, lng: 79.868 }, "pvr-ogf": { lat: 6.927, lng: 79.845 },
  "jp-kandy": { lat: 7.284, lng: 80.626 }, "kcc-multiplex": { lat: 7.2925, lng: 80.635 },
};
function coordsOf(t: Theatre): Coords | null {
  if (HALL[t.id]) return HALL[t.id];
  const pin = t.mapsUrl.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (pin) return { lat: +pin[1], lng: +pin[2] };
  for (const name of [getTown(t), t.town]) if (name && TOWN[name]) return TOWN[name];
  // A hall with a known town we have no point for is left out: falling back to its district centre
  // would put e.g. Hasalaka next to Kandy. Halls with no separate town sit in their city itself.
  if (t.town && t.town !== t.city) return null;
  return TOWN[t.city] ?? null;
}

export const getNearTowns = () => NEAR_TOWNS.map((n) => ({ ...n, slug: slugify(n.name) }));
export const getNearTown = (slug: string) => getNearTowns().find((n) => n.slug === slug);

/** The closest listed halls to a point, nearest first, within `maxKm` (straight-line). */
export function hallsNear(at: Coords, limit = 8, maxKm = 30) {
  return getTheatres()
    .map((t) => ({ t, c: coordsOf(t) }))
    .filter((x): x is { t: Theatre; c: Coords } => !!x.c)
    .map(({ t, c }) => ({ theatre: t, km: Math.max(1, Math.round(distanceKm(at, c))) }))
    .filter((x) => x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}
