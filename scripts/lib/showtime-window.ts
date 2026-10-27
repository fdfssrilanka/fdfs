import type { Showtime } from "../../lib/types";

export function colomboDateTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

export function isUpcomingShowtime(showtime: Pick<Showtime, "date" | "time">, now = new Date()) {
  const current = colomboDateTime(now);
  return showtime.date > current.date || (showtime.date === current.date && showtime.time >= current.time);
}
