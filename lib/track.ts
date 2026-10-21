export type ClickKind = "showtime" | "book_button" | "other_cinema" | "theatre_site" | "booking_guide" | "offer";

export interface ClickEvent {
  kind: ClickKind;
  /** Destination (the cinema's booking page). */
  url: string;
  movieId?: string;
  theatreId?: string;
  cinemaId?: string;
  format?: string;
  date?: string;
  time?: string;
}

/** Fire-and-forget: sendBeacon survives the new tab opening and page unloads. */
export function trackClick(e: ClickEvent) {
  try {
    const body = JSON.stringify({ ...e, page: location.pathname });
    if (navigator.sendBeacon?.("/api/click", new Blob([body], { type: "application/json" }))) return;
    fetch("/api/click", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  } catch {}
}
