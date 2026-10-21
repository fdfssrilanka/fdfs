import Link from "next/link";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/site";

const LINKS = [
  { href: "/terms", label: "Terms of use" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie policy" },
];

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="mb-2 mt-10 scroll-mt-24 text-xl font-extrabold">{children}</h2>;
}

export function Contact() {
  return (
    <>
      <H2 id="contact">Contact</H2>
      <p>
        {CONTACT_EMAIL ? (
          <>Questions about this page? Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-link underline underline-offset-2">{CONTACT_EMAIL}</a>.</>
        ) : (
          <>Questions about this page? Use the contact details published on fdfs.lk.</>
        )}
      </p>
    </>
  );
}

/** Shared layout for the Terms, Privacy and Cookie pages: title, updated date, a contents list and links to the other two. */
export default function LegalPage({ title, current, toc, children }: { title: string; current: string; toc: { id: string; label: string }[]; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <aside className="mb-8 lg:mb-0">
        <nav aria-label="Legal pages" className="lg:sticky lg:top-24">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Legal</p>
          <ul className="flex flex-wrap gap-2 lg:block lg:space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={l.href === current ? "page" : undefined} className={`inline-flex min-h-9 items-center rounded-full border px-4 text-sm font-semibold lg:w-full lg:rounded-md lg:border-0 lg:px-3 ${l.href === current ? "border-accent bg-accent text-white lg:bg-surface-2 lg:text-accent" : "border-line text-ink/85 hover:text-accent"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mb-2 mt-6 hidden text-xs font-bold uppercase tracking-wider text-muted lg:block">On this page</p>
          <ul className="hidden space-y-1 lg:block">
            {toc.map((t) => (
              <li key={t.id}><a href={`#${t.id}`} className="inline-flex min-h-8 items-center text-sm text-muted hover:text-ink">{t.label}</a></li>
            ))}
          </ul>
        </nav>
      </aside>
      <article className="min-w-0 max-w-3xl text-sm leading-relaxed text-ink/85 [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="font-display text-5xl uppercase leading-none text-ink sm:text-6xl">{title}</h1>
        <p className="mt-3 text-muted">Last updated {LEGAL_UPDATED}</p>
        {children}
      </article>
    </div>
  );
}
