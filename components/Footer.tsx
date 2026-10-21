import Link from "next/link";
import { getCities, getNowShowing, getTheatres } from "@/lib/data";
import { t } from "@/lib/i18n";
import Logo from "./Logo";

function Col({ title, links, className = "", wide = false }: { title: string; links: { label: string; href: string }[]; className?: string; wide?: boolean }) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-ink">{title}</h3>
      <ul className={wide ? "columns-2 gap-x-6 sm:columns-3 lg:columns-1" : ""}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-9 items-center text-sm text-link hover:underline">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const cities = getCities();
  const theatres = getTheatres().slice(0, 6);
  return (
    <footer className="mt-12 border-t border-line bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Logo />
          <p className="mt-3 text-sm text-muted">{getNowShowing().length} movies now showing across Sri Lanka.</p>
        </div>
        <Col title="Movies" links={[{ label: t("row.nowShowing"), href: "/movies" }, { label: t("row.comingSoon"), href: "/coming-soon" }]} />
        <Col title="Theatres" links={[{ label: "All theatres", href: "/theatres" }, ...theatres.map((x) => ({ label: x.name, href: `/theatres/${x.slug}` }))]} />
        <Col title="Cities" wide className="col-span-2 sm:col-span-3 lg:col-span-1" links={cities.map((c) => ({ label: c.name, href: `/cities/${c.slug}` }))} />
        <Col title="Languages" links={["Tamil", "Sinhala", "English", "Hindi"].map((l) => ({ label: l, href: `/language/${l.toLowerCase()}` }))} />
        <Col title="More" links={[{ label: "Book movie tickets", href: "/book-movie-tickets" }, { label: "IMAX cinemas", href: "/imax" }, { label: "Special offers", href: "/offers" }, { label: "Premium experiences", href: "/#experiences" }, { label: "About fdfs.lk", href: "/about" }]} />
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        <p className="px-4">{t("footer.disclaimer")}</p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 px-4">
          <Link href="/terms" className="inline-flex min-h-8 items-center hover:text-ink">Terms of use</Link>
          <Link href="/privacy" className="inline-flex min-h-8 items-center hover:text-ink">Privacy policy</Link>
          <Link href="/cookies" className="inline-flex min-h-8 items-center hover:text-ink">Cookie policy</Link>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} fdfs.lk</p>
      </div>
    </footer>
  );
}
