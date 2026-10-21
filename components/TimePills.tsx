"use client";
import { formatTime, formatTimeShort, isPast } from "@/lib/format";
import type { Showtime } from "@/lib/types";
import TrackedLink from "./TrackedLink";

export default function TimePills({ showtimes, now }: { showtimes: Showtime[]; now: { date: string; time: string } | null }) {
  const sorted = [...showtimes].sort((a, b) => a.time.localeCompare(b.time));
  return (
    <ul className="flex flex-wrap gap-2">
      {sorted.map((s) => {
        const past = now ? isPast(s.date, s.time, now) : false;
        const cls = "flex h-[35px] w-[71px] items-center justify-center rounded text-base font-bold leading-4 text-white";
        return (
          <li key={`${s.theatreId}-${s.time}-${s.format}`}>
            {past ? (
              <span aria-disabled className={`${cls} cursor-not-allowed bg-surface-2 !text-muted/70 line-through`}>{formatTimeShort(s.time)}</span>
            ) : (
              <TrackedLink href={s.bookingUrl} track={{ kind: "showtime", movieId: s.movieId, theatreId: s.theatreId, format: s.format, date: s.date, time: s.time }} className={`${cls} bg-showtime no-underline transition-colors duration-300 hover:bg-showtime/80`} aria-label={`${formatTimeShort(s.time)} (${formatTime(s.time)})`}>
                {formatTimeShort(s.time)}
              </TrackedLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
