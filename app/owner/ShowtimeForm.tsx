"use client";

import { useActionState } from "react";
import { btn, input } from "@/components/backend/Shell";
import { addShowtimes } from "./actions";

export default function ShowtimeForm({ theatre, movies, formats }: { theatre: string; movies: { id: string; label: string }[]; formats: string[] }) {
  const [state, action, pending] = useActionState(addShowtimes, undefined);
  const today = new Date().toISOString().slice(0, 10);
  const label = "text-xs font-semibold text-muted";
  return (
    <form action={action} className="grid gap-3 md:grid-cols-3">
      <input type="hidden" name="theatre" value={theatre} />
      <label className={`${label} md:col-span-2`}>Movie
        <select name="movie" required className={`mt-1 ${input}`}><option value="">Choose…</option>{movies.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select>
      </label>
      <label className={label}>Format
        <select name="format" className={`mt-1 ${input}`}>{formats.map((f) => <option key={f}>{f}</option>)}</select>
      </label>
      <label className={label}>Start date<input name="date" type="date" required defaultValue={today} className={`mt-1 ${input}`} /></label>
      <label className={label}>Repeat for how many days<input name="days" type="number" min={1} max={30} defaultValue={1} className={`mt-1 ${input}`} /></label>
      <label className={label}>Ticket price (LKR)<input name="price" type="number" min={0} step={50} placeholder="e.g. 1200" className={`mt-1 ${input}`} /></label>
      <label className={`${label} md:col-span-2`}>Times (24-hour, comma separated)<input name="times" required placeholder="10:00, 13:30, 19:15" className={`mt-1 ${input}`} /></label>
      <label className={label}>Booking link (optional)<input name="url" type="url" placeholder="https://…" className={`mt-1 ${input}`} /></label>
      <div className="md:col-span-3">
        <button disabled={pending} className={btn}>{pending ? "Saving…" : "Add showtimes"}</button>
        {state?.error && <p role="alert" className="mt-2 text-sm font-semibold text-accent">{state.error}</p>}
        {state?.ok && <p className="mt-2 text-sm font-semibold text-green">{state.ok}</p>}
      </div>
    </form>
  );
}
