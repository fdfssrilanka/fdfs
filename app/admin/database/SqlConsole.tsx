"use client";

import { useActionState } from "react";
import { btn } from "@/components/backend/Shell";
import { runSql } from "./actions";

export default function SqlConsole() {
  const [res, action, pending] = useActionState(runSql, undefined);
  return (
    <form action={action} className="space-y-2">
      <textarea name="sql" rows={4} spellCheck={false} placeholder="SELECT * FROM clicks ORDER BY id DESC LIMIT 20;   or   ALTER TABLE users ADD COLUMN phone TEXT;" className="block w-full border border-line bg-surface-2 p-3 font-mono text-xs text-ink outline-none focus:border-accent" />
      <button disabled={pending} className={btn}>{pending ? "Running…" : "Run"}</button>
      {res?.error && <p role="alert" className="text-sm font-semibold text-accent">{res.error}</p>}
      {res?.changes !== undefined && <p className="text-sm font-semibold text-green">OK. {res.changes} row(s) changed.</p>}
      {res?.columns && (
        <div className="overflow-x-auto">
          {res.rows?.length === 0 ? <p className="text-sm text-muted">No rows.</p> : (
            <table className="w-full text-left font-mono text-xs">
              <thead className="text-muted"><tr>{res.columns.map((c) => <th key={c} className="py-1 pr-4">{c}</th>)}</tr></thead>
              <tbody>{res.rows?.map((r, i) => <tr key={i} className="border-t border-line">{r.map((v, j) => <td key={j} className="py-1 pr-4">{v === null ? <i className="text-muted">null</i> : String(v)}</td>)}</tr>)}</tbody>
            </table>
          )}
        </div>
      )}
    </form>
  );
}
