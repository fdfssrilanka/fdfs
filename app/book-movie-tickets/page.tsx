import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import FaqList from "@/components/Faq";
import TrackedLink from "@/components/TrackedLink";
import PageIntro from "@/components/PageIntro";
import { getNowShowing } from "@/lib/data";
import { host } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Movie Tickets Online in Sri Lanka – How to Book Film Tickets | fdfs.lk",
  description: "How to book movie tickets online in Sri Lanka: find your movie and showtime on fdfs.lk, then book on the cinema's own site. Booking sites for Scope, Savoy, PVR and more.",
  alternates: { canonical: "/book-movie-tickets" },
};

const SITES = [
  { name: "Scope Cinemas", note: "Colombo City Centre, Havelock City Mall, Colpetty, Kiribathgoda", url: "https://www.scopecinemas.com/movies/now-showing" },
  { name: "EAP / Savoy Cinemas", note: "Savoy, Rajagiriya, Gampaha, Kurunegala and more", url: "https://eapmovies.com/component/eapmovies/?controller=buyticket&task=book&Itemid=115" },
  { name: "PVR Cinemas", note: "One Galle Face, Colombo", url: "https://www.pvrcinemas.lk/" },
  { name: "KCC Multiplex", note: "Kandy City Centre, Kandy", url: "https://kccmultiplex.lk/buy-tickets/" },
];

const FAQ = [
  { q: "How do I book movie tickets online in Sri Lanka?", a: "Find your movie on fdfs.lk, choose a date and a cinema, then tap a showtime. The cinema's own booking page opens, where you pick seats and pay." },
  { q: "Does fdfs.lk sell tickets?", a: "No. fdfs.lk lists showtimes and links to the cinema. Payment and your ticket come from the cinema." },
  { q: "Can I book film tickets for any cinema?", a: "Most cinemas we list have online booking. A few, such as single-screen halls, may only sell at the box office; check the theatre page." },
  { q: "How much is a movie ticket in Sri Lanka?", a: "Prices depend on the cinema, format (2D, 3D, IMAX, Gold Class) and seat. The cinema's booking page shows the exact price before you pay." },
];

export default function BookPage() {
  const now = getNowShowing();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageIntro h1="Book movie tickets online in Sri Lanka">Movie ticket booking takes a minute: find a showtime here, then book on the cinema&apos;s own site.</PageIntro>
      <ol className="mb-10 space-y-3">
        {["Pick a movie from the " + now.length + " now showing.", "Choose a date and a cinema near you.", "Tap a showtime to open the cinema's booking page.", "Choose seats and pay on the cinema's site."].map((step, i) => (
          <li key={step} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-black text-accent-ink">{i + 1}</span>
            <span className="pt-1">{step}</span>
          </li>
        ))}
      </ol>
      <h2 className="mb-3 text-xl font-extrabold">Cinema booking sites</h2>
      <ul className="mb-10 space-y-3">
        {SITES.map((s) => (
          <li key={s.name}>
            <TrackedLink href={s.url} track={{ kind: "booking_guide", cinemaId: s.name }} className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 hover:border-accent">
              <span><span className="block font-bold">{s.name}</span><span className="block text-xs text-muted">{s.note}</span></span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent">{host(s.url)} <ExternalLink className="size-4" aria-hidden /></span>
            </TrackedLink>
          </li>
        ))}
      </ul>
      <FaqList faq={FAQ} />
      <p className="mt-6"><Link href="/movies" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 text-sm font-bold text-accent-ink">See movies now showing</Link></p>
    </div>
  );
}
