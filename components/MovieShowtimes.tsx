"use client";
import { Armchair, ExternalLink, Info, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Showtime, Theatre } from "@/lib/types";
import { regionOf } from "@/lib/geo";
import { t } from "@/lib/i18n";
import DateStrip from "./DateStrip";
import ExperienceBadge, { BadgeRow, hasBadge } from "./ExperienceBadge";
import HeartButton from "./HeartButton";
import OfferTag from "./OfferTag";
import TimePills from "./TimePills";
import TrackedLink from "./TrackedLink";
import { useCity } from "./CityProvider";
import { useFavorites } from "./FavoritesProvider";
import { useDates, useNow } from "./useNow";

export interface OtherListing {
  movieId: string;
  cinemaId: string;
  cinemaName: string;
  site: string;
  bookingUrl: string;
}

const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");
const INFO: Record<string, string> = {
  IMAX: "IMAX with Laser screen",
  "Gold Class": "Gold Class: reclining seats and food served at your seat",
  "Dolby Atmos": "Dolby Atmos surround sound",
  "3D": "Digital 3D, glasses required",
  "2D": "Standard digital screen",
};

export default function MovieShowtimes({ showtimes, theatres, cities, others, offerCinemaIds = [] }: { showtimes: Showtime[]; theatres: Theatre[]; cities: string[]; others: OtherListing[]; offerCinemaIds?: string[] }) {
  const now = useNow();
  const { city: globalCity } = useCity();
  const { has: isSaved } = useFavorites();
  const [picked, setPicked] = useState<string | null>(null);
  const [cityOverride, setCityOverride] = useState<string | null>(null);
  const [format, setFormat] = useState("");

  const regionOfTheatre = useMemo(() => new Map(theatres.map((x) => [x.id, regionOf(x.city)])), [theatres]);

  // If the chosen city has no showtimes for this movie, fall back to every city instead of showing an empty page.
  const wanted = cityOverride ?? globalCity;
  const playsInWanted = !wanted || showtimes.some((s) => regionOfTheatre.get(s.theatreId) === wanted);
  const city = playsInWanted ? wanted : "";
  const fellBack = Boolean(wanted) && !playsInWanted;

  const inScope = useMemo(() => showtimes.filter((s) => !city || regionOfTheatre.get(s.theatreId) === city), [showtimes, city, regionOfTheatre]);
  const all = useMemo(() => [...new Set(inScope.map((s) => s.date))].sort(), [inScope]);
  const dates = useDates(all, now);
  const date = picked && dates.includes(picked) ? picked : (dates[0] ?? "");
  const formats = useMemo(() => [...new Set(inScope.map((s) => s.format))], [inScope]);
  const activeFormat = formats.includes(format) ? format : "";

  const byTheatre = useMemo(() => {
    const out: { theatre: Theatre; byFormat: Map<string, Showtime[]> }[] = [];
    for (const th of theatres) {
      const list = inScope.filter((s) => s.theatreId === th.id && s.date === date && (!activeFormat || s.format === activeFormat));
      if (!list.length) continue;
      const byFormat = new Map<string, Showtime[]>();
      for (const s of list) byFormat.set(s.format, [...(byFormat.get(s.format) ?? []), s]);
      out.push({ theatre: th, byFormat });
    }
    // Saved theatres first.
    return out.sort((a, b) => Number(isSaved("theatre", b.theatre.id)) - Number(isSaved("theatre", a.theatre.id)));
  }, [theatres, inScope, date, activeFormat, isSaved]);

  const chip = (active: boolean) => `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${active ? "border-link2 bg-link2 text-white" : "border-line bg-surface hover:border-link2"}`;

  return (
    <div id="showtimes" className="scroll-mt-32">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-base font-extrabold uppercase tracking-wide sm:text-lg">Theatres near</h2>
        <label className="relative inline-flex items-center gap-1.5 text-sm font-bold text-link">
          <MapPin className="size-4" aria-hidden />
          <span className="sr-only">{t("city.select")}</span>
          <select value={city} onChange={(e) => setCityOverride(e.target.value)} className="min-h-11 cursor-pointer rounded-md bg-transparent pr-1 text-link focus:outline-none">
            <option value="" className="bg-surface text-ink">{t("movie.allCities")}</option>
            {cities.map((c) => (
              <option key={c} value={c} className="bg-surface text-ink">{c}</option>
            ))}
          </select>
        </label>
      </div>
      {fellBack && <p className="mb-3 rounded-lg bg-surface px-3 py-2 text-sm text-muted">Not showing in {wanted}. Showing every city where it plays.</p>}

      {dates.length > 0 && <DateStrip dates={dates} selected={date} onSelect={setPicked} today={now?.date ?? null} />}

      {formats.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Format">
          <button className={chip(activeFormat === "")} onClick={() => setFormat("")}>{t("movie.allFormats")}</button>
          {formats.map((f) => (
            <button key={f} className={chip(activeFormat === f)} onClick={() => setFormat(f)}>{f}</button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-4">
        {byTheatre.map(({ theatre, byFormat }) => (
          <article key={theatre.id} className="overflow-hidden rounded-xl border border-line bg-bg">
            <div className="flex items-start justify-between gap-3 bg-surface px-4 py-4 sm:px-5">
              <div className="min-w-0">
                {offerCinemaIds.includes(theatre.cinemaId) && <OfferTag className="mb-2" />}
                <h3 className="text-base font-extrabold sm:text-lg">
                  <Link href={`/theatres/${theatre.slug}`} className="hover:text-link">{theatre.name}</Link>
                </h3>
                <p className="mt-0.5 text-sm text-muted">{theatre.address}</p>
                <a href={theatre.mapsUrl} target="_blank" rel="noopener noreferrer" className="-ml-2 mt-1 inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-link hover:underline sm:hidden">
                  <MapPin className="size-4" aria-hidden /> {t("movie.viewMap")}
                </a>
                {theatre.experiences.length > 0 && <div className="mt-3"><BadgeRow names={theatre.experiences} size="sm" max={4} /></div>}
              </div>
              <div className="flex shrink-0 items-center gap-1 text-sm">
                <a href={theatre.mapsUrl} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center gap-1.5 px-2 font-semibold text-link hover:underline sm:inline-flex">
                  <MapPin className="size-4" aria-hidden /> {t("movie.viewMap")}
                </a>
                <HeartButton id={theatre.id} name={theatre.name} />
              </div>
            </div>
            <div className="divide-y divide-line px-4 sm:px-5">
              {[...byFormat].map(([f, list]) => (
                <div key={f} className="py-5 text-warm">
                  <h4 className="mb-3 text-sm font-bold">
                    {f !== "2D" && hasBadge(f) ? <ExperienceBadge name={f} size="sm" /> : f === "2D" ? "Standard (2D)" : f}
                  </h4>
                  <div className="mb-4 flex items-center justify-between gap-3 border-l-4 border-soft bg-surface px-4 py-3 text-xs text-muted">
                    <span>{INFO[f] ?? `${f} screen`}</span>
                    <Info className="size-4 shrink-0" aria-hidden />
                  </div>
                  <TimePills showtimes={list} now={now} />
                  <TrackedLink href={list[0].bookingUrl} track={{ kind: "book_button", movieId: list[0].movieId, theatreId: theatre.id, format: f, date: list[0].date }} className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-link2 px-5 text-sm font-bold text-white hover:brightness-110" aria-label={`Book on ${host(list[0].bookingUrl)}`}>
                    <Armchair className="size-4" aria-hidden /> Book on {host(list[0].bookingUrl)}
                  </TrackedLink>
                </div>
              ))}
            </div>
          </article>
        ))}
        {byTheatre.length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">{t("movie.noShowtimes")}</p>}
      </div>

      {others.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("movie.otherBooking")}</h3>
          <ul className="space-y-3">
            {others.map((o) => (
              <li key={o.cinemaName}>
                <TrackedLink href={o.bookingUrl} track={{ kind: "other_cinema", movieId: o.movieId, cinemaId: o.cinemaId }} className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 hover:border-accent">
                  <span className="font-bold">{o.cinemaName}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                    {t("movie.bookOn", { site: o.site })} <ExternalLink className="size-4" aria-hidden />
                  </span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
