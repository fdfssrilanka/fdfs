"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarClock, ChevronDown, CirclePlay, Clapperboard, Heart, Languages, LocateFixed, MapPin, Menu, Popcorn, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import Logo from "./Logo";
import { useCity } from "./CityProvider";
import { useFavorites } from "./FavoritesProvider";

export interface SearchItem {
  type: "Movie" | "Theatre";
  title: string;
  sub: string;
  href: string;
}

const NAV = [
  { label: t("nav.movies"), href: "/movies", icon: Clapperboard },
  { label: t("nav.theatres"), href: "/theatres", icon: Popcorn },
  { label: t("nav.comingSoon"), href: "/coming-soon", icon: CalendarClock },
  { label: "Trailers", href: "/#trailers", icon: CirclePlay },
];
const LANGS = ["Tamil", "Sinhala", "English", "Hindi"];

function SavedLink({ pathname }: { pathname: string }) {
  const { total } = useFavorites();
  return (
    <Link href="/saved" className={`relative flex w-20 flex-col items-center gap-1 py-1 text-[11px] font-semibold hover:text-accent ${pathname === "/saved" ? "text-accent" : "text-ink/90"}`}>
      <Heart className="size-6" aria-hidden strokeWidth={1.75} />
      Saved
      {total > 0 && <span className="absolute right-4 top-0 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black leading-4 text-accent-ink">{total}</span>}
    </Link>
  );
}

function LanguageMenu() {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <details key={pathname} ref={ref} className="relative">
      <summary className="flex w-20 cursor-pointer list-none flex-col items-center gap-1 py-1 text-[11px] font-semibold text-ink/90 hover:text-accent [&::-webkit-details-marker]:hidden">
        <Languages className="size-6" aria-hidden strokeWidth={1.75} />
        Languages
      </summary>
      <ul className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-line bg-surface p-1 shadow-xl">
        {LANGS.map((l) => (
          <li key={l}>
            <Link href={`/language/${l.toLowerCase()}`} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-surface-2 hover:text-accent">{l} movies</Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

function SearchBox({ items, autoFocus = false, onDone }: { items: SearchItem[]; autoFocus?: boolean; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => i.title.toLowerCase().includes(s)).slice(0, 8) : [];
  }, [q, items]);
  const open = (href: string) => {
    router.push(href);
    setQ("");
    onDone?.();
  };

  return (
    <div className="relative w-full">
      <input
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && results[0] && open(results[0].href)}
        type="search"
        placeholder={t("search.placeholder")}
        aria-label={t("search.placeholder")}
        className="h-11 w-full rounded-full border border-line bg-bg pl-5 pr-14 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <button aria-label="Search" onClick={() => results[0] && open(results[0].href)} className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-link2 text-white">
        <Search className="size-4" aria-hidden />
      </button>
      {q.trim() && (
        <ul className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
          {results.length ? (
            results.map((r) => (
              <li key={r.href}>
                <Link href={r.href} onClick={() => open(r.href)} className="flex min-h-12 items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-surface-2">
                  <span className="truncate font-semibold">{r.title}</span>
                  <span className="shrink-0 text-xs text-muted">{r.type} · {r.sub}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-muted">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}

export function CitySelect({ cities, className = "" }: { cities: string[]; className?: string }) {
  const { city, setCity, locate, locating, detected } = useCity();
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <label className="relative inline-flex h-full min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface pl-3 pr-8 text-sm font-semibold">
        <MapPin aria-hidden className="size-4 text-link" />
        <span className="sr-only">{t("city.select")}</span>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="max-w-32 cursor-pointer appearance-none bg-transparent pr-1 text-ink focus:outline-none">
          <option value="" className="bg-surface">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c} className="bg-surface">{c}{detected && c === city ? " (auto)" : ""}</option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 size-4 text-muted" />
      </label>
      <button onClick={locate} disabled={locating} aria-label="Use my location" title="Use my location" className="flex size-9 shrink-0 items-center justify-center rounded-full text-link hover:bg-surface disabled:opacity-60">
        <LocateFixed className={`size-5 ${locating ? "animate-pulse" : ""}`} aria-hidden />
      </button>
    </div>
  );
}

export default function Header({ items, cities }: { items: SearchItem[]; cities: string[] }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-nav">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:h-[4.5rem]">
        <button aria-label="Open menu" onClick={() => setMenu(true)} className="-ml-2 flex size-11 items-center justify-center md:hidden">
          <Menu />
        </button>
        <Logo />
        <div className="mx-4 hidden max-w-lg flex-1 md:block">
          <SearchBox items={items} />
        </div>
        <nav aria-label="Primary" className="ml-auto hidden items-center md:flex">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={`flex w-20 flex-col items-center gap-1 py-1 text-[11px] font-semibold hover:text-accent ${pathname === href ? "text-accent" : "text-ink/90"}`}>
              <Icon className="size-6" aria-hidden strokeWidth={1.75} />
              {label}
            </Link>
          ))}
          <LanguageMenu />
          <SavedLink pathname={pathname} />
          <CitySelect cities={cities} className="ml-3" />
        </nav>
        <button aria-label="Search" onClick={() => setSearch((s) => !s)} className="ml-auto flex size-11 items-center justify-center md:hidden">
          {search ? <X /> : <Search />}
        </button>
      </div>
      {search && (
        <div className="border-t border-line px-4 py-2 md:hidden">
          <SearchBox items={items} autoFocus onDone={() => setSearch(false)} />
        </div>
      )}
      {menu && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal>
          <button aria-label="Close menu" className="absolute inset-0 bg-black/70" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-4 overflow-y-auto bg-bg p-4">
            <div className="flex items-center justify-between">
              <Logo />
              <button aria-label="Close menu" onClick={() => setMenu(false)} className="flex size-11 items-center justify-center"><X /></button>
            </div>
            <CitySelect cities={cities} />
            <ul>
              {[...NAV, { label: "Saved", href: "/saved", icon: Heart }, ...LANGS.map((l) => ({ label: `${l} movies`, href: `/language/${l.toLowerCase()}`, icon: Clapperboard }))].map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="flex min-h-12 items-center gap-3 border-b border-line text-base font-semibold"><Icon className="size-5 text-accent" aria-hidden />{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
