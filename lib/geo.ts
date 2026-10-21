export interface Coords {
  lat: number;
  lng: number;
}

// Approximate town-centre coordinates, enough to pick the nearest city. Not theatre-level positions.
const CITY_COORDS: Record<string, Coords> = {
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Wellawatte: { lat: 6.8741, lng: 79.8603 },
  Rajagiriya: { lat: 6.9111, lng: 79.8888 },
  Dematagoda: { lat: 6.9367, lng: 79.8808 },
  Dehiwala: { lat: 6.8518, lng: 79.865 },
  Maharagama: { lat: 6.848, lng: 79.9265 },
  Kiribathgoda: { lat: 6.978, lng: 79.923 },
  Gampaha: { lat: 7.0873, lng: 79.9925 },
  Jaela: { lat: 7.0744, lng: 79.8919 },
  Negombo: { lat: 7.2008, lng: 79.8737 },
  Kandy: { lat: 7.2906, lng: 80.6337 },
  Kurunegala: { lat: 7.4863, lng: 80.3647 },
  Anuradhapura: { lat: 8.3114, lng: 80.4037 },
  Rathnapura: { lat: 6.6828, lng: 80.3992 },
  Ambalangoda: { lat: 6.2355, lng: 80.054 },
  Jaffna: { lat: 9.6615, lng: 80.0255 },
  Chavakachcheri: { lat: 9.6592, lng: 80.1626 },
  Vavuniya: { lat: 8.7542, lng: 80.4982 },
  Batticaloa: { lat: 7.7102, lng: 81.6924 },
  Trincomalee: { lat: 8.5874, lng: 81.2152 },
  Kalutara: { lat: 6.5854, lng: 79.9607 },
  Matale: { lat: 7.4675, lng: 80.6234 },
  "Nuwara Eliya": { lat: 6.9497, lng: 80.7891 },
  Galle: { lat: 6.0535, lng: 80.221 },
  Matara: { lat: 5.9549, lng: 80.555 },
  Hambantota: { lat: 6.1241, lng: 81.1185 },
  Kilinochchi: { lat: 9.3803, lng: 80.377 },
  Mannar: { lat: 8.981, lng: 79.9044 },
  Ampara: { lat: 7.2912, lng: 81.6724 },
  Puttalam: { lat: 8.0408, lng: 79.8394 },
  Polonnaruwa: { lat: 7.9403, lng: 81.0188 },
  Badulla: { lat: 6.9934, lng: 81.055 },
  Monaragala: { lat: 6.8728, lng: 81.3507 },
  Kegalle: { lat: 7.2513, lng: 80.3464 },
  Ratnapura: { lat: 6.6828, lng: 80.3992 },
};

// People say "Colombo" for the whole metro area, so its suburbs share one region. Same for Jaffna's outskirts.
const REGION: Record<string, string> = {
  Wellawatte: "Colombo", Rajagiriya: "Colombo", Dematagoda: "Colombo", Dehiwala: "Colombo", Maharagama: "Colombo", Kiribathgoda: "Colombo",
  Chavakachcheri: "Jaffna",
  Rathnapura: "Ratnapura",
};

export const regionOf = (city: string) => REGION[city] ?? city;

export function distanceKm(a: Coords, b: Coords) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export const distanceToCity = (from: Coords, city: string) => (CITY_COORDS[city] ? Math.round(distanceKm(from, CITY_COORDS[city])) : null);

/** Region of the closest city that has theatres, or null if the visitor is far from all of them (e.g. abroad). */
export function nearestRegion(from: Coords, maxKm = 150): string | null {
  let best: { city: string; km: number } | null = null;
  for (const [city, c] of Object.entries(CITY_COORDS)) {
    const km = distanceKm(from, c);
    if (!best || km < best.km) best = { city, km };
  }
  return best && best.km <= maxKm ? regionOf(best.city) : null;
}
