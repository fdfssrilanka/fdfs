import { rows } from "@/lib/backend/db";
import { ownerContext } from "@/lib/backend/owner";
import { card } from "@/components/backend/Shell";
import MovieForm from "./MovieForm";

export default async function OwnerMovies() {
  await ownerContext();
  const list = await rows<{ title: string; language: string; genres: string; runtime_min: number | null }>("SELECT title, language, genres, runtime_min FROM custom_movies ORDER BY created_at DESC LIMIT 100");
  return (
    <div className="space-y-6">
      <section className={card}>
        <h2 className="text-sm font-extrabold uppercase tracking-wider">Add a movie that isn&apos;t listed</h2>
        <p className="mb-4 mt-1 text-xs text-muted">Most current releases are already in the list when you add showtimes. Use this for local or special screenings.</p>
        <MovieForm />
      </section>
      <section className={card}>
        <h2 className="text-sm font-extrabold uppercase tracking-wider">Movies added by owners</h2>
        {list.length === 0 ? <p className="mt-3 text-sm text-muted">None yet.</p> : (
          <ul className="mt-3 space-y-1 text-sm">{list.map((m, i) => <li key={i}><b>{m.title}</b> <span className="text-muted">{[m.language, m.genres, m.runtime_min && `${m.runtime_min} min`].filter(Boolean).join(" · ")}</span></li>)}</ul>
        )}
      </section>
    </div>
  );
}
