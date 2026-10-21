import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, ChevronDown, Heart, MapPin } from "lucide-react";
import { getCinema, getCities, getFeatured, getNowShowing, getShowtimes, getTheatres, hasShowtimes } from "@/lib/data";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About fdfs.lk – Sri Lanka Movie Showtimes, How It Works & Privacy | fdfs.lk",
  description: "fdfs.lk lists movie showtimes for Sri Lankan cinemas and links you to each cinema's own booking page. How it works, where the showtimes come from, and how we handle your location and data.",
  alternates: { canonical: "/about" },
};

const STEPS = [
  { title: "Pick a movie", text: "Browse what's on today, filter by language, or search for a movie or cinema." },
  { title: "Choose a date and a cinema", text: "Every cinema playing it, with showtimes by date and format, nearest first." },
  { title: "Book on the cinema's site", text: "Tap a showtime to open the cinema's own booking page, where you choose seats and pay." },
];

const FAQ = [
  { q: "Do you sell tickets?", a: "No. fdfs.lk lists showtimes and sends you to the cinema's own site to book. Payment, refunds and tickets are handled by the cinema." },
  { q: "How up to date are the showtimes?", a: "They're read from the cinemas' websites each time we refresh our data, and cinemas can change or cancel shows. The cinema's page is always the final word, so check it before you travel." },
  { q: "Why does a cinema say to call?", a: "It's listed from the National Film Corporation's cinema directory and doesn't publish showtimes online that we can read. We show its address and phone number instead of guessing." },
  { q: "Why don't I see ticket prices?", a: "Cinemas don't publish prices in a form we can read, so we don't show any. The price appears on the cinema's booking page." },
  { q: "A cinema or movie is missing.", a: CONTACT_EMAIL ? `We list cinemas that publish showtimes online or appear in public directories. Tell us what's missing at ${CONTACT_EMAIL}.` : "We list cinemas that publish showtimes online or appear in public directories, and add more as their sites allow." },
];

const PRIVACY = [
  { icon: MapPin, title: "Location", text: "Your approximate location picks a city on your first visit. It's used in your browser and never stored by us." },
  { icon: Heart, title: "Saved items", text: "Hearts are saved in this browser only. We never receive them." },
  { icon: BarChart3, title: "Booking clicks", text: "We count which showtimes get tapped, with your country. No cookies, no account, no personal details." },
];

export default function About() {
  const hero = getFeatured().find((m) => m.backdropUrl);
  const stats = [
    { n: getNowShowing().length, label: "movies now showing" },
    { n: getTheatres().length, label: "cinemas listed" },
    { n: getCities().length, label: "cities and districts" },
    { n: getShowtimes().length, label: "showtimes loaded" },
  ];
  // Cinemas whose showtimes we read live, with how many of their theatres have times today.
  const live = new Map<string, { name: string; theatres: number }>();
  for (const t of getTheatres()) {
    if (!hasShowtimes(t.id)) continue;
    const c = getCinema(t.cinemaId);
    if (c) live.set(c.id, { name: c.name, theatres: (live.get(c.id)?.theatres ?? 0) + 1 });
  }
  const listedOnly = getTheatres().filter((t) => !hasShowtimes(t.id)).length;

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-line">
        {hero && <Image src={hero.backdropUrl} alt="" fill priority sizes="100vw" className="-z-10 object-cover object-right opacity-60" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/85 to-bg/30 max-sm:to-bg/70" />
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-24">
          <h1 className="max-w-3xl font-display text-6xl uppercase leading-[0.9] sm:text-8xl">First day,<br />first show,<br /><span className="text-accent">found fast.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/90">fdfs.lk shows you which Sri Lankan cinemas are playing a movie and when, then takes you straight to the cinema&apos;s own booking page.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/movies" className="inline-flex min-h-12 items-center rounded-full bg-link2 px-6 text-sm font-bold text-white hover:brightness-110">Browse movies</Link>
            <Link href="/theatres" className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-6 text-sm font-bold hover:border-accent hover:text-accent">Find a cinema</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <dl className="-mt-px grid grid-cols-2 divide-line border-b border-line sm:grid-cols-4 sm:divide-x">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-4 py-6 ${i % 2 === 1 ? "max-sm:border-l max-sm:border-line" : ""} ${i > 1 ? "max-sm:border-t max-sm:border-line" : ""}`}>
              <dd className="font-display text-5xl leading-none text-accent">{s.n}</dd>
              <dt className="mt-1 text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>

        <section aria-labelledby="how" className="py-14">
          <h2 id="how" className="font-display text-4xl uppercase sm:text-5xl">How it works</h2>
          <ol className="mt-8 space-y-0">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-10 last:pb-0">
                {i < STEPS.length - 1 && <span aria-hidden className="absolute left-[1.35rem] top-14 h-[calc(100%-3.5rem)] w-px bg-line" />}
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent font-display text-2xl text-white">{i + 1}</span>
                <div className="pt-1">
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 max-w-xl text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="sources" className="border-t border-line py-14">
          <h2 id="sources" className="font-display text-4xl uppercase sm:text-5xl">Where the showtimes come from</h2>
          <p className="mt-3 max-w-2xl text-muted">Read from each cinema&apos;s own website. We never guess a time.</p>
          <h3 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><span className="size-2 rounded-full bg-green" aria-hidden /> Live showtimes</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[...live.values()].map((c) => (
              <li key={c.name} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold">
                {c.name} <span className="font-normal text-muted">· {c.theatres} {c.theatres === 1 ? "cinema" : "cinemas"}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><span className="size-2 rounded-full bg-muted" aria-hidden /> Listed, call to confirm</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">{listedOnly} more cinemas appear in the National Film Corporation&apos;s directory and other public listings. They show an address and phone number, and should be confirmed before you go.</p>
        </section>

        <section aria-labelledby="faq" className="border-t border-line py-14">
          <h2 id="faq" className="font-display text-4xl uppercase sm:text-5xl">Questions</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="max-w-2xl pb-4 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="privacy" className="border-t border-line py-14">
          <h2 id="privacy" className="font-display text-4xl uppercase sm:text-5xl">Your privacy</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PRIVACY.map((p) => (
              <div key={p.title}>
                <p.icon className="size-7 text-accent" aria-hidden strokeWidth={1.75} />
                <h3 className="mt-3 font-bold">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            Read the full <Link href="/privacy" className="text-link underline underline-offset-2">privacy policy</Link>, <Link href="/cookies" className="text-link underline underline-offset-2">cookie policy</Link> and <Link href="/terms" className="text-link underline underline-offset-2">terms of use</Link>.
          </p>
          {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
            <p className="mt-3 text-sm text-muted">
              Ads are served by Google AdSense, which may use cookies. See <a href="https://policies.google.com/technologies/ads" className="text-link underline underline-offset-2">Google&apos;s advertising policy</a>.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
