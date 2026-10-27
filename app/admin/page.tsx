import { rows, one } from "@/lib/backend/db";
import { getMovieById, getTheatreById } from "@/lib/data";
import { card } from "@/components/backend/Shell";

const KIND: Record<string, string> = { showtime: "Showtime buttons", book_button: "Book buttons", other_cinema: "Other cinema links", theatre_site: "Theatre websites", booking_guide: "Booking guide", offer: "Offers" };

function Tile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className={card}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function Bars({ data, name }: { data: { label: string; n: number }[]; name: (l: string) => string }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  if (!data.length) return <p className="text-sm text-muted">No clicks recorded yet.</p>;
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.label} className="text-sm">
          <div className="flex justify-between gap-3"><span className="truncate">{name(d.label)}</span><span className="font-bold">{d.n}</span></div>
          <div className="mt-1 h-1.5 bg-surface-2"><div className="h-full bg-accent" style={{ width: `${(d.n / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export default async function AdminHome() {
  const count = async (where: string) => (await one<{ n: number }>(`SELECT COUNT(*) AS n FROM clicks ${where}`))?.n ?? 0;
  const [today, week, month, all] = await Promise.all([
    count("WHERE ts >= date('now')"),
    count("WHERE ts >= datetime('now', '-7 days')"),
    count("WHERE ts >= datetime('now', '-30 days')"),
    count(""),
  ]);
  const top = (col: string, limit = 8) => rows<{ label: string; n: number }>(`SELECT ${col} AS label, COUNT(*) AS n FROM clicks WHERE ${col} != '' AND ts >= datetime('now', '-30 days') GROUP BY ${col} ORDER BY n DESC LIMIT ${limit}`);
  const [perDay, byKind, byMovie, byTheatre, byHost, byCountry, owners, ownerShows, audits] = await Promise.all([
    rows<{ label: string; n: number }>("SELECT date(ts) AS label, COUNT(*) AS n FROM clicks WHERE ts >= datetime('now', '-14 days') GROUP BY date(ts) ORDER BY label"),
    top("kind"), top("movie_id", 10), top("theatre_id", 10), top("host"), top("country"),
    one<{ n: number }>("SELECT COUNT(*) AS n FROM users WHERE role = 'owner'"),
    one<{ n: number }>("SELECT COUNT(*) AS n FROM owner_showtimes WHERE date >= date('now')"),
    rows<{ ts: string; user_email: string; action: string; detail: string }>("SELECT ts, user_email, action, detail FROM audit_log ORDER BY id DESC LIMIT 12"),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Tile label="Clicks today" value={today} />
        <Tile label="Last 7 days" value={week} />
        <Tile label="Last 30 days" value={month} />
        <Tile label="All time" value={all} />
        <Tile label="Theatre owners" value={owners?.n ?? 0} />
        <Tile label="Upcoming owner showtimes" value={ownerShows?.n ?? 0} />
      </div>

      <section className={card}>
        <h2 className="text-sm font-extrabold uppercase tracking-wider">Clicks per day, last 14 days</h2>
        <div className="mt-4 flex h-32 items-end gap-1.5">
          {perDay.length === 0 && <p className="text-sm text-muted">No clicks recorded yet.</p>}
          {perDay.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${d.n}`}>
              <span className="text-[10px] font-bold">{d.n}</span>
              <div className="w-full bg-accent" style={{ height: `${Math.max(4, (d.n / Math.max(...perDay.map((x) => x.n))) * 90)}px` }} />
              <span className="text-[9px] text-muted">{d.label.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className={card}><h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider">What was clicked (30 days)</h2><Bars data={byKind} name={(l) => KIND[l] ?? l} /></section>
        <section className={card}><h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider">Top movies (30 days)</h2><Bars data={byMovie} name={(l) => getMovieById(l)?.title ?? l} /></section>
        <section className={card}><h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider">Top theatres (30 days)</h2><Bars data={byTheatre} name={(l) => getTheatreById(l)?.name ?? l} /></section>
        <section className={card}><h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider">Where visitors went (30 days)</h2><Bars data={byHost} name={(l) => l} /></section>
        <section className={card}><h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider">Visitor countries (30 days)</h2><Bars data={byCountry} name={(l) => l} /></section>
        <section className={card}>
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider">Recent activity</h2>
          {audits.length === 0 ? <p className="text-sm text-muted">Nothing yet.</p> : (
            <ul className="space-y-1.5 text-xs">
              {audits.map((a, i) => <li key={i}><span className="text-muted">{a.ts}</span> · <b>{a.user_email || "system"}</b> {a.action} {a.detail && <span className="text-muted">{a.detail}</span>}</li>)}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
