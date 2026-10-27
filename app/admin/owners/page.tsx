import { rows } from "@/lib/backend/db";
import { getTheatreById, getTheatres } from "@/lib/data";
import { btn, btnGhost, card, input } from "@/components/backend/Shell";
import { assignTheatre, deleteOwner, resetPassword, setDisabled, unassignTheatre } from "./actions";
import CreateOwnerForm from "./CreateOwnerForm";

export default async function OwnersPage() {
  const owners = await rows<{ id: number; email: string; name: string; disabled: number; last_login_at: string | null; created_at: string }>("SELECT id, email, name, disabled, last_login_at, created_at FROM users WHERE role = 'owner' ORDER BY created_at DESC");
  const links = await rows<{ user_id: number; theatre_id: string }>("SELECT user_id, theatre_id FROM owner_theatres");
  const counts = await rows<{ created_by: number; n: number }>("SELECT created_by, COUNT(*) AS n FROM owner_showtimes WHERE date >= date('now') GROUP BY created_by");
  const options = getTheatres().map((t) => ({ id: t.id, label: `${t.name} (${t.town ?? t.city})` })).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="space-y-6">
      <datalist id="theatre-options">{options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</datalist>
      <section className={card}>
        <h2 className="text-sm font-extrabold uppercase tracking-wider">Add a theatre owner</h2>
        <p className="mt-1 text-xs text-muted">Owners sign in at /login and can only edit the theatres you assign. Start typing a theatre name in the box, then pick it from the list.</p>
        <CreateOwnerForm />
      </section>

      {owners.length === 0 && <p className="text-sm text-muted">No owners yet.</p>}
      {owners.map((o) => {
        const mine = links.filter((l) => l.user_id === o.id);
        return (
          <section key={o.id} className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold">{o.name || o.email} {o.disabled ? <span className="ml-2 border border-accent px-1.5 text-[10px] font-bold uppercase text-accent">Disabled</span> : null}</h3>
                <p className="text-xs text-muted">{o.email} · joined {o.created_at.slice(0, 10)} · last sign-in {o.last_login_at ?? "never"} · {counts.find((c) => c.created_by === o.id)?.n ?? 0} upcoming showtimes</p>
              </div>
              <div className="flex gap-2">
                <form action={setDisabled}><input type="hidden" name="user" value={o.id} /><input type="hidden" name="disabled" value={o.disabled ? "0" : "1"} /><button className={btnGhost}>{o.disabled ? "Enable" : "Disable"}</button></form>
                <form action={deleteOwner}><input type="hidden" name="user" value={o.id} /><button className={btnGhost}>Delete</button></form>
              </div>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {mine.length === 0 && <li className="text-xs text-muted">No theatres assigned.</li>}
              {mine.map((l) => (
                <li key={l.theatre_id}>
                  <form action={unassignTheatre} className="flex items-center gap-2 bg-surface-2 py-1 pl-3 pr-1 text-xs font-semibold">
                    <input type="hidden" name="user" value={o.id} /><input type="hidden" name="theatre" value={l.theatre_id} />
                    {getTheatreById(l.theatre_id)?.name ?? l.theatre_id}
                    <button className="px-2 py-1 text-muted hover:text-accent" aria-label="Remove theatre">✕</button>
                  </form>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <form action={assignTheatre} className="flex gap-2">
                <input type="hidden" name="user" value={o.id} />
                <input name="theatre" list="theatre-options" placeholder="Add theatre…" className={input} />
                <button className={btn}>Add</button>
              </form>
              <form action={resetPassword} className="flex gap-2">
                <input type="hidden" name="user" value={o.id} />
                <input name="password" type="text" minLength={10} placeholder="New password (10+ chars)" autoComplete="off" className={input} />
                <button className={btn}>Reset</button>
              </form>
            </div>
          </section>
        );
      })}
    </div>
  );
}
