"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Movie, Showtime } from "@/lib/types";
import { formatRuntime } from "@/lib/format";
import { t } from "@/lib/i18n";
import DateStrip from "./DateStrip";
import Poster from "./Poster";
import TimePills from "./TimePills";
import { useDates, useNow } from "./useNow";

export default function TheatreMovies({ movies, showtimes }: { movies: Movie[]; showtimes: Showtime[] }) {
  const now = useNow();
  const [picked, setPicked] = useState<string | null>(null);
  const all = useMemo(() => [...new Set(showtimes.map((s) => s.date))].sort(), [showtimes]);
  const dates = useDates(all, now);
  const date = picked && dates.includes(picked) ? picked : (dates[0] ?? "");

  const rows = useMemo(
    () =>
      movies
        .map((movie) => {
          const list = showtimes.filter((s) => s.movieId === movie.id && s.date === date);
          const byFormat = new Map<string, Showtime[]>();
          for (const s of list) byFormat.set(s.format, [...(byFormat.get(s.format) ?? []), s]);
          return { movie, byFormat };
        })
        .filter((r) => r.byFormat.size),
    [movies, showtimes, date],
  );

  return (
    <div id="showtimes">
      <DateStrip dates={dates} selected={date} onSelect={setPicked} today={now?.date ?? null} />
      <div className="mt-4 space-y-4">
        {rows.map(({ movie, byFormat }) => (
          <article key={movie.id} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
            <Link href={`/movies/${movie.slug}`} className="w-20 shrink-0 self-start overflow-hidden rounded-lg sm:w-24">
              <Poster src={movie.posterUrl} title={movie.title} sizes="96px" />
            </Link>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-extrabold leading-tight">
                <Link href={`/movies/${movie.slug}`} className="hover:text-accent">{movie.title}</Link>
              </h3>
              <p className="mt-1 text-xs text-muted">{[movie.language, formatRuntime(movie.runtimeMin), movie.genres.slice(0, 2).join(", ")].filter(Boolean).join(" · ")}</p>
              <div className="mt-4 divide-y divide-line">
                {[...byFormat].map(([f, list]) => (
                  <div key={f} className="py-4 first:pt-0 last:pb-0">
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{f}</h4>
                    <TimePills showtimes={list} now={now} />
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
        {rows.length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">{t("movie.noShowtimes")}</p>}
      </div>
    </div>
  );
}
