const TZ = "Asia/Colombo";

export const todayInColombo = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);

export function nowParts(now = new Date()) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  return { date: todayInColombo(now), time: p.replace(/^24/, "00") };
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** Compact label for time buttons: 14:30 -> "2:30p". */
export function formatTimeShort(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}${h < 12 ? "a" : "p"}`;
}

export const isPast = (date: string, time: string, now: { date: string; time: string }) =>
  date < now.date || (date === now.date && time <= now.time);

export function dateParts(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  return {
    day: d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
    num: d.getUTCDate(),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
  };
}

export function formatRuntime(min: number | null) {
  if (!min) return "";
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`;
}

export function formatReleaseDate(date: string) {
  if (!date) return "";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export const youtubeId = (url: string) => url.match(/(?:v=|embed\/|youtu\.be\/)([\w-]{11})/)?.[1] ?? "";
