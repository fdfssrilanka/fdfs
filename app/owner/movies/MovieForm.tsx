"use client";

import { useActionState } from "react";
import { btn, input } from "@/components/backend/Shell";
import { addMovie } from "../actions";

export default function MovieForm() {
  const [state, action, pending] = useActionState(addMovie, undefined);
  const label = "text-xs font-semibold text-muted";
  return (
    <form action={action} className="grid gap-3 md:grid-cols-2">
      <label className={label}>Title<input name="title" required className={`mt-1 ${input}`} /></label>
      <label className={label}>Language<select name="language" className={`mt-1 ${input}`}>{["Sinhala", "Tamil", "English", "Hindi"].map((l) => <option key={l}>{l}</option>)}</select></label>
      <label className={label}>Genres (comma separated)<input name="genres" placeholder="Drama, Romance" className={`mt-1 ${input}`} /></label>
      <label className={label}>Runtime (minutes)<input name="runtime" type="number" min={1} max={400} className={`mt-1 ${input}`} /></label>
      <label className={`${label} md:col-span-2`}>Poster link (optional, https)<input name="poster" type="url" className={`mt-1 ${input}`} /></label>
      <div className="md:col-span-2">
        <button disabled={pending} className={btn}>{pending ? "Saving…" : "Add movie"}</button>
        {state?.error && <p role="alert" className="mt-2 text-sm font-semibold text-accent">{state.error}</p>}
        {state?.ok && <p className="mt-2 text-sm font-semibold text-green">{state.ok}</p>}
      </div>
    </form>
  );
}
