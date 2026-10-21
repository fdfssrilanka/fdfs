import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrackedLink from "@/components/TrackedLink";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import AdSquare from "@/components/AdSquare";
import { BadgeRow } from "@/components/ExperienceBadge";
import FaqList from "@/components/Faq";
import OfferTag from "@/components/OfferTag";
import OffersSection from "@/components/OffersSection";
import HeartButton from "@/components/HeartButton";
import JsonLd from "@/components/JsonLd";
import TheatreMovies from "@/components/TheatreMovies";
import Link from "next/link";
import { getCinema, getTown, slugify, getMoviesAtTheatre, getOffersForCinemas, getShowtimesForTheatre, getTheatre, getTheatres } from "@/lib/data";
import { ALSO_KNOWN_AS, joinList, theatreNames } from "@/lib/seo";
import { host, SITE_URL } from "@/lib/site";
import { t } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => getTheatres().map((x) => ({ slug: x.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const th = getTheatre((await params).slug);
  if (!th) return {};
  const { short, title } = theatreNames(th);
  const hasTimes = getShowtimesForTheatre(th.id).length > 0;
  const dirOnly = th.source === "nfc" && !hasTimes;
  return {
    title: dirOnly ? `${title} – Cinema in ${th.city}, Sri Lanka | fdfs.lk` : `${title} – Movies Today, Showtimes & Ticket Booking | fdfs.lk`,
    description: dirOnly
      ? `${th.name}, a cinema in ${th.address || th.city}${th.details ? ` (${th.details})` : ""}.${th.phone ? ` Call ${th.phone} to ask what's showing.` : ""}`
      : hasTimes
      ? `Movies at ${short} today: showtimes, formats and online ticket booking for ${th.name} in ${th.city}.`
      : `${th.name} in ${th.city}: address, formats and a link to the cinema's own site for showtimes and online ticket booking.`,
    alternates: { canonical: `/theatres/${th.slug}` },
  };
}

export default async function TheatrePage({ params }: { params: Promise<{ slug: string }> }) {
  const th = getTheatre((await params).slug);
  if (!th) notFound();
  const cinema = getCinema(th.cinemaId)!;
  const showtimes = getShowtimesForTheatre(th.id);
  const movies = getMoviesAtTheatre(th.id);
  const { short, title } = theatreNames(th);
  const site = host(th.bookingUrl ?? cinema.website);
  const fbOnly = site.includes("facebook.com");
  const dirOnly = th.source === "nfc" && showtimes.length === 0;
  const place = th.address.toLowerCase().includes(th.city.toLowerCase()) ? th.address : [th.address, th.city].filter(Boolean).join(", ");

  const faq = [
    ...(movies.length ? [{ q: `What movies are showing at ${short}?`, a: `${short} currently has showtimes for ${joinList(movies.slice(0, 8).map((m) => m.title))}${movies.length > 8 ? " and more" : ""}. Pick a date above to see the times.` }] : []),
    th.source === "nfc" && !th.bookingUrl
      ? { q: `How do I find out what's showing at ${short}?`, a: th.phone ? `${short} doesn't publish showtimes online that we can list. Call ${th.phone} to ask what's on.` : `${short} doesn't publish showtimes online that we can list. Ask the cinema directly.` }
      : fbOnly
        ? { q: `How do I find out what's showing at ${short}?`, a: `${short} posts its schedule on its Facebook page${th.phone ? ` and answers calls on ${th.phone}` : ""}. fdfs.lk doesn't sell tickets.` }
        : { q: `How do I book tickets at ${short}?`, a: `Choose a movie and showtime on fdfs.lk, then book on ${site}, ${cinema.name}'s own booking site. fdfs.lk doesn't sell tickets.` },
    ...(th.experiences.length ? [{ q: `What formats does ${short} have?`, a: `${short} offers ${joinList(th.experiences)}.` }] : []),
    ...(place ? [{ q: `Where is ${short}?`, a: `${th.name} is at ${place}.` }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:grid lg:grid-cols-[minmax(0,56rem)_300px] lg:justify-between lg:gap-8">
      <div className="min-w-0">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MovieTheater",
          name: th.name,
          alternateName: [title, ...(ALSO_KNOWN_AS[th.id] ?? [])],
          url: `${SITE_URL}/theatres/${th.slug}`,
          telephone: th.phone || undefined,
          address: { "@type": "PostalAddress", streetAddress: th.address || undefined, addressLocality: th.city, addressCountry: "LK" },
          hasMap: th.mapsUrl,
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">{cinema.name}</p>
        {getOffersForCinemas([th.cinemaId]).length > 0 && <OfferTag />}
      </div>
      <h1 className="mt-1 font-display text-4xl uppercase leading-none sm:text-5xl">{th.name}</h1>
      <p className="mt-2 flex items-start gap-2 text-muted"><MapPin aria-hidden className="mt-1 size-4 shrink-0" /> {place}</p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/80">
        {showtimes.length
          ? `Movies at ${short} today and this week: see what's showing at ${th.name}, compare showtimes by date and format, then book tickets online on ${site}.`
          : dirOnly && !th.bookingUrl
            ? `${th.name} is a cinema in ${th.address || th.city}. Showtimes aren't published online, so contact the cinema to find out what's on.`
            : fbOnly
              ? `${th.name} is a cinema in ${th.city}. Showtimes aren't published in a form we can list, so check its Facebook page or call to see what's on.`
              : `${th.name} is a cinema in ${th.city}. Showtimes aren't published in a form we can list yet, so use ${site} to see what's on and to book tickets online.`}
      </p>
      {th.details && <p className="mt-2 text-sm font-semibold text-ink/80">{th.details}</p>}
      {(ALSO_KNOWN_AS[th.id] ?? []).length > 0 && <p className="mt-2 text-sm text-muted">Also searched as: {(ALSO_KNOWN_AS[th.id] ?? []).join(" · ")}</p>}
      {getTown(th) && <p className="mt-2 text-sm"><Link href={`/areas/${slugify(getTown(th)!)}`} className="text-link underline underline-offset-2">All film halls and cinemas in {getTown(th)}</Link></p>}
      <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
        <HeartButton id={th.id} name={th.name} label className="border border-line px-4" />
        <a href={th.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-link hover:underline"><MapPin className="size-4" aria-hidden /> {t("movie.viewMap")}</a>
        {th.phone && <a href={`tel:${th.phone}`} className="inline-flex min-h-11 items-center gap-1.5 hover:text-accent"><Phone className="size-4" aria-hidden /> {th.phone}</a>}
      </div>
      {th.specs && th.specs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">{th.specs.map((s) => <span key={s} className="rounded border border-line px-2 py-0.5 text-sm font-bold text-ink/85">{s}</span>)}</div>
      )}
      {th.experiences.length > 0 && (
        <div className="mt-4">
          <BadgeRow names={th.experiences} />
        </div>
      )}

      <OffersSection offers={getOffersForCinemas([th.cinemaId])} className="mt-8" />

      <h2 className="mb-1 mt-10 text-xl font-extrabold">Movies at {short} today</h2>
      {showtimes.length > 0 ? (
        <TheatreMovies movies={movies} showtimes={showtimes} />
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-line p-6">
          <p className="text-sm text-muted">{dirOnly && !th.bookingUrl ? "Showtimes for this cinema aren't published online. Call to ask what's on." : t("theatre.noShowtimes")}</p>
          {th.bookingUrl || !dirOnly ? (
            <TrackedLink href={th.bookingUrl ?? cinema.bookingSite} track={{ kind: "theatre_site", theatreId: th.id, cinemaId: cinema.id }} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-accent-ink">
              {t("theatre.visitSite", { site })} <ExternalLink className="size-4" aria-hidden />
            </TrackedLink>
          ) : th.phone ? (
            <a href={`tel:${th.phone}`} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-accent-ink">
              <Phone className="size-4" aria-hidden /> Call {th.phone}
            </a>
          ) : null}
          {th.source === "nfc" && <p className="mt-4 text-xs text-muted">{th.confirmed ? "Listed in the National Film Corporation's cinema directory and a second directory, with a matching phone number or name and town. Confirm opening before you go." : "Listed in the National Film Corporation's cinema directory only. Confirm opening before you go."}</p>}
        </div>
      )}
      <div className="mt-10 max-w-3xl"><FaqList faq={faq} /></div>
      </div>
      <AdSquare />
    </div>
  );
}
