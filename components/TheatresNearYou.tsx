"use client";
import Link from "next/link";
import { LocateFixed, MapPin } from "lucide-react";
import type { Theatre } from "@/lib/types";
import { distanceToCity, regionOf } from "@/lib/geo";
import { t } from "@/lib/i18n";
import { useCity } from "./CityProvider";
import { useFavorites } from "./FavoritesProvider";
import { CitySelect } from "./Header";
import TheatreCard from "./TheatreCard";

export default function TheatresNearYou({ theatres, chains, cities }: { theatres: Theatre[]; chains: Record<string, string>; cities: string[] }) {
  const { city, coords, detected, locating, locate, locateError } = useCity();
  const { ids } = useFavorites();
  const saved = ids("theatre");
  // Saved theatres first, then theatres with online showtimes, then directory-only cinemas; nearest first within each.
  const rank = (x: Theatre) => (saved.includes(x.id) ? 0 : x.source === "nfc" ? 2 : 1);
  const list = theatres
    .filter((x) => !city || regionOf(x.city) === city)
    .map((x) => ({ x, km: coords && x.source !== "nfc" ? distanceToCity(coords, x.city) : null }))
    .sort((a, b) => rank(a.x) - rank(b.x) || (a.km ?? 0) - (b.km ?? 0))
    .slice(0, 12);

  return (
    <section className="cv-auto mx-auto w-full max-w-7xl px-4 py-6">
      <h2 className="text-base font-extrabold uppercase tracking-wide sm:text-lg">{t("row.theatresNear")}</h2>
      <div className="mb-3 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
          <MapPin className="size-4 text-link" aria-hidden /> {city || "All cities"}
        </span>
        <CitySelect cities={cities} className="h-9" />
        <button onClick={locate} disabled={locating} className="inline-flex min-h-9 items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-link hover:underline disabled:opacity-60">
          <LocateFixed className="size-4" aria-hidden /> {locating ? "Locating…" : "Use my location"}
        </button>
        <Link href={city ? `/cities/${city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : "/theatres"} className="text-xs font-bold uppercase tracking-wide text-link hover:underline">
          See more theatres
        </Link>
      </div>
      {detected && <p className="mb-3 text-xs text-muted">Showing {city} because that&apos;s closest to your connection. Change the city or use your precise location.</p>}
      {locateError && <p role="alert" className="mb-3 text-xs text-red-300">{locateError}</p>}
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
        {list.map(({ x, km }) => (
          <div key={x.id} className="w-72 shrink-0 snap-start">
            <TheatreCard theatre={x} chain={chains[x.cinemaId]} distanceKm={km} />
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted">No theatres listed in {city} yet.</p>}
      </div>
    </section>
  );
}
