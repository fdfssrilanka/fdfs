import Link from "next/link";
import { rows, one } from "@/lib/backend/db";
import { btn, btnGhost, card, input } from "@/components/backend/Shell";
import { deleteRow, updateRow, userTables } from "./actions";
import SqlConsole from "./SqlConsole";

const PAGE = 50;
const q = (id: string) => `"${id.replace(/"/g, '""')}"`;

export default async function DatabasePage({ searchParams }: { searchParams: Promise<{ t?: string; p?: string; edit?: string }> }) {
  const sp = await searchParams;
  const tables = await userTables();
  const table = tables.includes(sp.t ?? "") ? sp.t! : tables[0];
  const page = Math.max(0, Number(sp.p) || 0);
  const cols = (await rows<{ name: string; type: string }>(`PRAGMA table_info(${q(table)})`)).map((c) => c.name);
  const total = (await one<{ n: number }>(`SELECT COUNT(*) AS n FROM ${q(table)}`))?.n ?? 0;
  const data = await rows<Record<string, unknown> & { _rowid_: number }>(`SELECT rowid AS _rowid_, * FROM ${q(table)} ORDER BY rowid DESC LIMIT ${PAGE} OFFSET ${page * PAGE}`);
  const editing = sp.edit ? data.find((r) => r._rowid_ === Number(sp.edit)) ?? (await one<Record<string, unknown> & { _rowid_: number }>(`SELECT rowid AS _rowid_, * FROM ${q(table)} WHERE rowid = ?`, Number(sp.edit))) : null;
  const href = (o: Record<string, string | number>) => `/admin/database?${new URLSearchParams({ t: table, ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)])) })}`;

  return (
    <div className="space-y-6">
      <section className={card}>
        <h2 className="text-sm font-extrabold uppercase tracking-wider">Tables</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {tables.map((t) => <Link key={t} href={`/admin/database?t=${t}`} className={`min-h-9 border px-3 py-2 text-xs font-bold ${t === table ? "border-accent text-accent" : "border-line"}`}>{t}</Link>)}
        </div>
      </section>

      {editing && (
        <section className={card}>
          <h2 className="text-sm font-extrabold uppercase tracking-wider">Edit {table} #{editing._rowid_}</h2>
          <form action={updateRow} className="mt-3 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="table" value={table} /><input type="hidden" name="rowid" value={editing._rowid_} />
            {cols.filter((c) => c !== "password_hash").map((c) => (
              <label key={c} className="text-xs font-semibold text-muted">{c}
                <input name={`f_${c}`} defaultValue={editing[c] === null ? "" : String(editing[c])} className={`mt-1 ${input}`} />
              </label>
            ))}
            <div className="flex gap-2 md:col-span-2"><button className={btn}>Save</button><Link href={href({})} className={`${btnGhost} flex items-center`}>Cancel</Link></div>
          </form>
        </section>
      )}

      <section className={card}>
        <div className="flex items-baseline justify-between"><h2 className="text-sm font-extrabold uppercase tracking-wider">{table}</h2><span className="text-xs text-muted">{total} rows</span></div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-muted"><tr><th className="py-2 pr-3">#</th>{cols.map((c) => <th key={c} className="pr-4">{c}</th>)}<th /></tr></thead>
            <tbody>
              {data.map((r) => (
                <tr key={r._rowid_} className="border-t border-line align-top">
                  <td className="py-2 pr-3 text-muted">{r._rowid_}</td>
                  {cols.map((c) => <td key={c} className="max-w-64 truncate pr-4" title={c === "password_hash" ? "" : String(r[c] ?? "")}>{c === "password_hash" ? "••••" : r[c] === null ? <i className="text-muted">null</i> : String(r[c])}</td>)}
                  <td className="whitespace-nowrap">
                    <Link href={href({ p: page, edit: r._rowid_ })} className={`${btnGhost} mr-1 inline-flex items-center`}>Edit</Link>
                    <form action={deleteRow} className="inline"><input type="hidden" name="table" value={table} /><input type="hidden" name="rowid" value={r._rowid_} /><button className={btnGhost}>Delete</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs">
          {page > 0 && <Link className={btnGhost} href={href({ p: page - 1 })}>← Newer</Link>}
          {(page + 1) * PAGE < total && <Link className={btnGhost} href={href({ p: page + 1 })}>Older →</Link>}
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider">SQL console</h2>
        <p className="mb-3 text-xs text-muted">Runs directly on the database, including ALTER TABLE. Every statement is written to the audit log. Back up before destructive changes.</p>
        <SqlConsole />
      </section>
    </div>
  );
}
