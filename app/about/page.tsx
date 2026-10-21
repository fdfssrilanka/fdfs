import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, CalendarDays, Database, Heart, MapPin, Search, ShieldCheck, Ticket } from "lucide-react";
import { getCities, getMovies, getNowShowing, getShowtimes, getTheatres } from "@/lib/data";

export const metadata: Metadata = {
  title: "About fdfs.lk – Sri Lanka Movie Showtimes, How It Works & Privacy | fdfs.lk",
  description: "fdfs.lk lists movie showtimes for Sri Lankan cinemas and links you to each cinema's own booking page. How it works, where the showtimes come from, and how we handle your location and data.",
  alternates: { canonical: "/about" },
};

const STEPS = [
  { icon: Search, title: "Pick a movie", text: "Browse what's showing today, by language, or search for a movie or cinema." },
  { icon: CalendarDays, title: "Choose a date and cinema", text: "See every cinema playing it, with showtimes by date and format, nearest first." },
  { icon: Ticket, title: "Book on the cinema's site", text: "Tap a showtime and you land on the cinema's own booking page to choose seats and pay." },
];

const PRIVACY = [
  { icon: MapPin, title: "Your location", text: "On your first visit we read your approximate location from your connection (through Cloudflare) to suggest a city. Tap Use my location for a precise match. It is used in your browser to pick a city and sort theatres, and is never stored on our servers." },
  { icon: Heart, title: "Saved movies and theatres", text: "When you tap a heart, the choice is saved in this browser only. We never receive it." },
  { icon: BarChart3, title: "Booking clicks", text: "When you tap a showtime or a booking button we count it: which movie, theatre and format, and your country. No cookies, no account, no personal details." },
];

export default function About() {
  const stats = [
    { n: getNowShowing().length, label: "movies now showing" },
    { n: getTheatres().length, label: "cinemas listed" },
    { n: getCities().length, label: "cities and districts" },
    { n: getShowtimes().length, label: "showtimes today and ahead" },
  ];
  const total = getMovies().length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">About</p>
        <h1 className="mt-1 font-display text-5xl uppercase leading-none sm:text-7xl">First day, first show, found fast</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/85">
          fdfs.lk helps you find which Sri Lankan cinemas are playing a movie, and when. Pick a film, choose a date, and jump to the cinema&apos;s own booking page.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/movies" className="inline-flex min-h-12 items-center rounded-full bg-link2 px-6 text-sm font-bold text-white hover:brightness-110">Browse movies</Link>
          <Link href="/theatres" className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-6 text-sm font-bold hover:border-accent hover:text-accent">Find a cinema</Link>
        </div>
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-4">
            <dd className="font-display text-4xl leading-none text-accent">{s.n}</dd>
            <dt className="mt-1 text-xs text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      <section aria-labelledby="how" className="mt-14">
        <h2 id="how" className="mb-4 text-base font-extrabold uppercase tracking-wide sm:text-lg">How it works</h2>
        <ol className="grid gap-3 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border border-line bg-surface p-5">
              <span className="absolute right-4 top-3 font-display text-5xl leading-none text-white/10">{i + 1}</span>
              <span className="flex size-11 items-center justify-center rounded-full bg-utility text-white"><s.icon className="size-5" aria-hidden /></span>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="data" className="mt-14">
        <h2 id="data" className="mb-4 text-base font-extrabold uppercase tracking-wide sm:text-lg">Where the showtimes come from</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <span className="flex size-11 items-center justify-center rounded-full bg-utility text-white"><Database className="size-5" aria-hidden /></span>
            <h3 className="mt-4 font-bold">Read from the cinemas&apos; own websites</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">Scope Cinemas, JP Cineplex, EAP and Savoy, and the STR theatres in Jaffna, Vavuniya and Batticaloa. {total} movies are tracked, and times refresh whenever we update. They can change, so check the cinema before you travel.</p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <span className="flex size-11 items-center justify-center rounded-full bg-utility text-white"><ShieldCheck className="size-5" aria-hidden /></span>
            <h3 className="mt-4 font-bold">Never guessed</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">Where a cinema doesn&apos;t publish showtimes we can read, we show its address and phone number or link to its booking page. Cinemas listed from the National Film Corporation directory say so, and should be confirmed before you go. We don&apos;t sell tickets: booking and payment happen on the cinema&apos;s site.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="privacy" className="mt-14">
        <h2 id="privacy" className="mb-4 text-base font-extrabold uppercase tracking-wide sm:text-lg">Your privacy</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {PRIVACY.map((p) => (
            <div key={p.title} className="rounded-xl border border-line bg-surface p-5">
              <span className="flex size-11 items-center justify-center rounded-full bg-utility text-white"><p.icon className="size-5" aria-hidden /></span>
              <h3 className="mt-4 font-bold">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          More detail: <Link href="/privacy" className="text-link underline underline-offset-2">privacy policy</Link>, <Link href="/cookies" className="text-link underline underline-offset-2">cookie policy</Link> and <Link href="/terms" className="text-link underline underline-offset-2">terms of use</Link>.
        </p>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Ads on fdfs.lk are served by Google AdSense, which may use cookies to show relevant ads. See{" "}
            <a href="https://policies.google.com/technologies/ads" className="text-link underline underline-offset-2">Google&apos;s advertising policy</a> for how to manage them.
          </p>
        )}
      </section>
    </div>
  );
}
