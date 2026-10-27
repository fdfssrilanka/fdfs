import Link from "next/link";
import { rows } from "@/lib/backend/db";
import { FORMATS, movieChoices, ownerContext } from "@/lib/backend/owner";
import { getMovieById } from "@/lib/data";
import { btnGhost, card, input } from "@/components/backend/Shell";
import { deleteShowtime, updatePrice } from "./actions";
import ShowtimeForm from "./ShowtimeForm";

export default async function OwnerHome({ searchParams }: { searchParams: Promise<{ theatre?: string }> }) {
  const { theatres } = await ownerContext();
  if (!theatres.length) return <p className={card}>No theatre is assigned to your account yet. Ask the fdfs.lk admin to assign one.</p>;
  const wanted = (await searchParams).theatre;
  const current = theatres.find((t) => t.id === wanted) ?? theatres[0];
  const movies = await movieChoices();
  const list = await rows<{ id: number; movie_id: string; date: string; time: string; format: string; price_lkr: number | null; title: string | null }>(
    `SELECT s.id, s.movie_id, s.date, s.time, s.format, s.price_lkr, m.title FROM owner_showtimes s LEFT JOIN custom_movies m ON m.id = s.movie_id
     WHERE s.theatre_id = ? AND s.date >= date('now', '-1 day') ORDER BY s.date, s.time LIMIT 400`, current.id);

  return (
    <div className="space-y-6">
      {theatres.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {theatres.map((t) => <Link key={t.id} href={`/owner?theatre=${t.id}`} className={`min-h-9 border px-3 py-2 text-xs font-bold ${t.id === current.id ? "border-accent text-accent" : "border-line"}`}>{t.name}</Link>)}
        </div>
      )}
      <section className={card}>
        <h2 className="text-sm font-extrabold uppercase tracking-wider">Add showtimes at {current.name}</h2>
        <p className="mb-4 mt-1 text-xs text-muted">This is a sample portal: what you add is stored for the admin and is not shown on the public site. Missing a movie? <Link href="/owner/movies" className="text-link underline">Add it first</Link>.</p>
        <ShowtimeForm theatre={current.id} movies={movies} formats={FORMATS} />
      </section>
      <section className={card}>
        <h2 className="text-sm font-extrabold uppercase tracking-wider">Upcoming showtimes</h2>
        {list.length === 0 ? <p className="mt-3 text-sm text-muted">None yet.</p> : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted"><tr><th className="py-2">Date</th><th>Time</th><th>Movie</th><th>Format</th><th>Price (LKR)</th><th /></tr></thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id} className="border-t border-line">
                    <td className="py-2">{s.date}</td><td>{s.time}</td><td>{getMovieById(s.movie_id)?.title ?? s.title ?? s.movie_id}</td><td>{s.format}</td>
                    <td>
                      <form action={updatePrice} className="flex gap-1"><input type="hidden" name="id" value={s.id} />
                        <input name="price" type="number" min={0} step={50} defaultValue={s.price_lkr ?? ""} aria-label="Price" className={`${input} !w-24`} /><button className={btnGhost}>Save</button></form>
                    </td>
                    <td><form action={deleteShowtime}><input type="hidden" name="id" value={s.id} /><button className={btnGhost}>Delete</button></form></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
