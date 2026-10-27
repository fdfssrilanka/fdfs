"use server";

import { revalidatePath } from "next/cache";
import { audit } from "@/lib/backend/auth";
import { db, exec, one } from "@/lib/backend/db";
import { FORMATS, ownerContext } from "@/lib/backend/owner";

export interface FormState { error?: string; ok?: string }

async function ownsTheatre(theatreId: string) {
  const ctx = await ownerContext();
  if (!ctx.theatres.some((t) => t.id === theatreId)) throw new Error("Not your theatre");
  return ctx.session;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Adds one row per time, repeated for `days` consecutive days. */
export async function addShowtimes(_p: FormState | undefined, form: FormData): Promise<FormState> {
  const theatreId = String(form.get("theatre"));
  const who = await ownsTheatre(theatreId);
  const movieId = String(form.get("movie"));
  const date = String(form.get("date"));
  const days = Math.min(30, Math.max(1, Number(form.get("days")) || 1));
  const format = String(form.get("format"));
  const price = form.get("price") ? Math.round(Number(form.get("price"))) : null;
  const url = String(form.get("url") ?? "").trim();
  const times = [...new Set(String(form.get("times") ?? "").split(/[\s,;]+/).filter(Boolean))];

  if (!movieId) return { error: "Choose a movie." };
  if (!DATE.test(date)) return { error: "Choose a start date." };
  if (!times.length || times.some((t) => !TIME.test(t))) return { error: "Enter times as 24-hour HH:MM, separated by commas, e.g. 10:00, 13:30, 19:15." };
  if (!FORMATS.includes(format)) return { error: "Choose a format." };
  if (price !== null && (!Number.isFinite(price) || price < 0 || price > 100000)) return { error: "Price looks wrong." };
  if (url && !/^https:\/\//.test(url)) return { error: "Booking link must start with https://" };
  const known = await one("SELECT 1 FROM custom_movies WHERE id = ?", movieId);
  if (!known && !(await import("@/lib/data")).getMovieById(movieId)) return { error: "Unknown movie." };

  const d = await db();
  const stmts = [];
  for (let i = 0; i < days; i++) {
    const day = new Date(`${date}T00:00:00Z`);
    day.setUTCDate(day.getUTCDate() + i);
    const iso = day.toISOString().slice(0, 10);
    for (const t of times) {
      stmts.push(d.prepare("INSERT INTO owner_showtimes (theatre_id, movie_id, date, time, format, price_lkr, booking_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(theatreId, movieId, iso, t, format, price, url, who.id));
    }
  }
  await d.batch(stmts);
  await audit(who, "showtime.add", `${theatreId} ${movieId} ${date} ×${days}d ${times.join(",")}`);
  revalidatePath("/owner");
  return { ok: `Added ${stmts.length} showtime${stmts.length === 1 ? "" : "s"}.` };
}

export async function deleteShowtime(form: FormData) {
  const id = Number(form.get("id"));
  const row = await one<{ theatre_id: string }>("SELECT theatre_id FROM owner_showtimes WHERE id = ?", id);
  if (!row) return;
  const who = await ownsTheatre(row.theatre_id);
  await exec("DELETE FROM owner_showtimes WHERE id = ?", id);
  await audit(who, "showtime.delete", `#${id}`);
  revalidatePath("/owner");
}

export async function updatePrice(form: FormData) {
  const id = Number(form.get("id"));
  const row = await one<{ theatre_id: string }>("SELECT theatre_id FROM owner_showtimes WHERE id = ?", id);
  if (!row) return;
  const who = await ownsTheatre(row.theatre_id);
  const raw = String(form.get("price") ?? "");
  const price = raw ? Math.round(Number(raw)) : null;
  if (price !== null && (!Number.isFinite(price) || price < 0 || price > 100000)) return;
  await exec("UPDATE owner_showtimes SET price_lkr = ? WHERE id = ?", price, id);
  await audit(who, "showtime.price", `#${id} → ${price}`);
  revalidatePath("/owner");
}

export async function addMovie(_p: FormState | undefined, form: FormData): Promise<FormState> {
  const { session } = await ownerContext();
  const title = String(form.get("title") ?? "").trim();
  if (title.length < 2) return { error: "Enter the movie title." };
  const poster = String(form.get("poster") ?? "").trim();
  if (poster && !/^https:\/\//.test(poster)) return { error: "Poster link must start with https://" };
  const runtime = form.get("runtime") ? Math.round(Number(form.get("runtime"))) : null;
  const id = `custom-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  await exec("INSERT INTO custom_movies (id, title, language, genres, runtime_min, poster_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", id, title, String(form.get("language") ?? ""), String(form.get("genres") ?? ""), runtime, poster, session.id);
  await audit(session, "movie.add", title);
  revalidatePath("/owner/movies");
  revalidatePath("/owner");
  return { ok: `Added “${title}”. You can now pick it when adding showtimes.` };
}
