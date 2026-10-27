import { revalidatePath } from "next/cache";
import { audit, requireAdmin } from "@/lib/backend/auth";
import { exec, rows } from "@/lib/backend/db";
import { getMovieById, getTheatreById } from "@/lib/data";
import { btnGhost, card } from "@/components/backend/Shell";

async function remove(form: FormData) {
  "use server";
  const admin = await requireAdmin();
  const id = Number(form.get("id"));
  await exec("DELETE FROM owner_showtimes WHERE id = ?", id);
  await audit(admin, "showtime.delete", `#${id}`);
  revalidatePath("/admin/showtimes");
}

export default async function AllShowtimes() {
  const list = await rows<{ id: number; theatre_id: string; movie_id: string; date: string; time: string; format: string; price_lkr: number | null; email: string | null; title: string | null }>(
    `SELECT s.id, s.theatre_id, s.movie_id, s.date, s.time, s.format, s.price_lkr, u.email, m.title
     FROM owner_showtimes s LEFT JOIN users u ON u.id = s.created_by LEFT JOIN custom_movies m ON m.id = s.movie_id
     WHERE s.date >= date('now', '-1 day') ORDER BY s.date, s.time LIMIT 500`,
  );
  return (
    <section className={card}>
      <h2 className="text-sm font-extrabold uppercase tracking-wider">Showtimes entered by owners</h2>
      {list.length === 0 ? <p className="mt-3 text-sm text-muted">No owner showtimes yet.</p> : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-muted"><tr><th className="py-2">Date</th><th>Time</th><th>Theatre</th><th>Movie</th><th>Format</th><th>Price</th><th>Owner</th><th /></tr></thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="py-2">{s.date}</td><td>{s.time}</td>
                  <td>{getTheatreById(s.theatre_id)?.name ?? s.theatre_id}</td>
                  <td>{getMovieById(s.movie_id)?.title ?? s.title ?? s.movie_id}</td>
                  <td>{s.format}</td><td>{s.price_lkr ? `LKR ${s.price_lkr.toLocaleString()}` : "–"}</td>
                  <td className="text-muted">{s.email ?? "–"}</td>
                  <td><form action={remove}><input type="hidden" name="id" value={s.id} /><button className={btnGhost}>Delete</button></form></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
