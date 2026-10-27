import Link from "next/link";
import { logout } from "@/app/login/actions";
import type { Session } from "@/lib/backend/auth";

/** Page frame for the admin and owner areas: title bar, section links and sign-out. */
export default function Shell({ session, title, nav, children }: { session: Session; title: string; nav: { href: string; label: string }[]; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{session.role === "admin" ? "Admin" : "Theatre owner"}</p>
          <h1 className="font-display text-4xl uppercase leading-none">{title}</h1>
        </div>
        <form action={logout} className="flex items-center gap-3 text-sm">
          <span className="text-muted">{session.email}</span>
          <button className="min-h-10 border border-line px-4 font-semibold hover:text-accent">Sign out</button>
        </form>
      </div>
      <nav className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="min-h-10 border border-line px-4 py-2.5 hover:text-accent">{n.label}</Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export const card = "border border-line bg-surface p-4";
export const input = "block min-h-10 w-full border border-line bg-surface-2 px-3 text-sm text-ink outline-none focus:border-accent";
export const btn = "min-h-10 bg-accent px-4 text-sm font-extrabold text-accent-ink";
export const btnGhost = "min-h-9 border border-line px-3 text-xs font-semibold hover:text-accent";
