import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import MovieShowtimes, { type OtherListing } from "@/components/MovieShowtimes";
import AdSquare from "@/components/AdSquare";
import CastCircles from "@/components/CastCircles";
import NewAndComingSoon from "@/components/NewAndComingSoon";
import HeartButton from "@/components/HeartButton";
import ShareButton from "@/components/ShareButton";
import TrailerCard from "@/components/TrailerCard";
import { Play } from "lucide-react";
import Poster from "@/components/Poster";
import TrailerButton from "@/components/TrailerButton";
import { BadgeRow } from "@/components/ExperienceBadge";
import OffersSection from "@/components/OffersSection";
import { getCinema, getListings, getMovie, getOffers, getOffersForCinemas, getMovies, getShowtimesForMovie, getTheatreById } from "@/lib/data";
import { formatReleaseDate, formatRuntime, youtubeId } from "@/lib/format";
import { regionOf } from "@/lib/geo";
import { joinList, theatreNames } from "@/lib/seo";
import { host, SITE_URL } from "@/lib/site";
import { t } from "@/lib/i18n";
import type { Theatre } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => getMovies().map((m) => ({ slug: m.slug }));

function context(slug: string) {
  const movie = getMovie(slug)!;
  const showtimes = getShowtimesForMovie(movie.id);
  const theatres = [...new Set(showtimes.map((s) => s.theatreId))].map((id) => getTheatreById(id)!).filter(Boolean) as Theatre[];
  const cities = [...new Set(theatres.map((x) => regionOf(x.city)))].sort();
  return { movie, showtimes, theatres, cities };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!getMovie(slug)) return {};
  const { movie, theatres } = context(slug);
  const names = joinList(theatres.slice(0, 3).map((x) => theatreNames(x).short)) + (theatres.length > 3 ? " and more" : "");
  const title = movie.status === "now_showing" ? `${movie.title} Tickets & Showtimes in Sri Lanka | fdfs.lk` : `${movie.title} in Sri Lanka – Release Date, Trailer & Tickets | fdfs.lk`;
  const description = movie.status === "now_showing"
    ? `${movie.title} (${movie.language}) showtimes${names ? ` at ${names}` : " in Sri Lanka"}. Book ${movie.title} tickets online on the cinema's own site. Ticket prices vary by cinema and format.`
    : `${movie.title} (${movie.language}) is coming to Sri Lankan cinemas${movie.releaseDate ? ` on ${formatReleaseDate(movie.releaseDate)}` : ""}. Watch the trailer and check cinema showtimes and tickets.`;
  const images = movie.posterUrl ? [{ url: movie.posterUrl, width: 400, height: 600, alt: `${movie.title} poster` }] : undefined;
  return { title, description, alternates: { canonical: `/movies/${movie.slug}` }, openGraph: { title, description, type: "video.movie", images }, twitter: { card: "summary_large_image", title, description } };
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getMovie(slug)) notFound();
  const { movie, showtimes, theatres, cities } = context(slug);

  const others: OtherListing[] = getListings(movie.id).map((l) => {
    const c = getCinema(l.cinemaId)!;
    return { movieId: movie.id, cinemaId: c.id, cinemaName: c.name, site: host(c.website), bookingUrl: l.bookingUrl };
  });
  const formats = [...new Set(showtimes.map((s) => s.format))].filter((f) => f !== "2D");
  const vid = youtubeId(movie.trailerUrl);

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Movie",
      name: movie.title,
      description: movie.synopsis,
      image: movie.posterUrl ? `${SITE_URL}${movie.posterUrl}` : undefined,
      inLanguage: movie.language,
      genre: movie.genres,
      datePublished: movie.releaseDate || undefined,
      director: movie.director ? { "@type": "Person", name: movie.director } : undefined,
      actor: movie.cast.map((name) => ({ "@type": "Person", name })),
      duration: movie.runtimeMin ? `PT${movie.runtimeMin}M` : undefined,
      trailer: vid ? { "@type": "VideoObject", name: `${movie.title} trailer`, embedUrl: `https://www.youtube.com/embed/${vid}`, thumbnailUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`, uploadDate: movie.releaseDate || undefined } : undefined,
    },
    ...[...showtimes].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 40).map((s) => {
      const th = getTheatreById(s.theatreId)!;
      return {
        "@context": "https://schema.org",
        "@type": "ScreeningEvent",
        name: `${movie.title} at ${th.name}`,
        startDate: `${s.date}T${s.time}:00+05:30`,
        videoFormat: s.format,
        workPresented: { "@type": "Movie", name: movie.title },
        location: { "@type": "MovieTheater", name: th.name, address: { "@type": "PostalAddress", streetAddress: th.address, addressLocality: th.city, addressCountry: "LK" } },
        offers: { "@type": "Offer", url: s.bookingUrl },
      };
    }),
  ];

  const opens = movie.releaseDate ? `${movie.status === "coming_soon" ? "Opens" : "Released"} ${formatReleaseDate(movie.releaseDate)}` : "";
  const where = joinList(theatres.map((x) => theatreNames(x).short));
  const faq: { q: string; a: string }[] = [
    ...(where ? [{ q: `Where can I watch ${movie.title} in Sri Lanka?`, a: `${movie.title} is showing at ${where}. Pick a date above for showtimes.` }] : []),
    { q: `How much are ${movie.title} tickets?`, a: "Ticket prices are set by each cinema and depend on the format and seat, so they aren't listed here. You'll see the price on the cinema's booking page." },
    { q: `How do I book ${movie.title} tickets?`, a: `Choose a showtime for ${movie.title} on this page. You'll go to the cinema's own site to pick seats and pay.` },
    ...(movie.runtimeMin ? [{ q: `How long is ${movie.title}?`, a: `${movie.title} is ${formatRuntime(movie.runtimeMin)} long.` }] : []),
    ...(movie.director ? [{ q: `Who directed ${movie.title}?`, a: movie.director }] : []),
    ...(movie.cast.length ? [{ q: `Who stars in ${movie.title}?`, a: movie.cast.join(", ") }] : []),
    ...(movie.synopsis ? [{ q: `What is ${movie.title} about?`, a: movie.synopsis }] : []),
  ];
  jsonLd.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  });

  const h2 = "mb-3 text-base font-extrabold uppercase tracking-wide sm:text-lg";
  const showtimesPanel = movie.status === "coming_soon" && !showtimes.length ? (
    <div id="showtimes" className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
      Showtimes aren&apos;t out yet.{movie.releaseDate && ` Opens ${formatReleaseDate(movie.releaseDate)}.`}
    </div>
  ) : (
    <MovieShowtimes showtimes={showtimes} theatres={theatres} cities={cities} others={others} offerCinemaIds={[...new Set(getOffers().map((o) => o.cinemaId))]} />
  );

  return (
    <>
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
      <section className="relative isolate overflow-hidden border-b border-line">
        <Image src={movie.backdropUrl || movie.posterUrl} alt="" fill priority sizes="100vw" className={`-z-10 object-cover ${movie.backdropUrl ? "object-right lg:object-center" : "scale-110 opacity-40 blur-2xl"}`} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/85 to-bg/10 max-sm:to-bg/60" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-bg to-transparent" />
        {/* Phone: poster beside the title, buttons in a full-width row underneath. Wider screens: poster left, everything else right. */}
        <div className="mx-auto grid max-w-7xl grid-cols-[7rem_minmax(0,1fr)] items-start gap-x-4 gap-y-5 px-4 py-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-x-6 sm:py-10">
          <div className="overflow-hidden rounded-lg border border-line shadow-2xl shadow-black/60 sm:row-span-2">
            <Poster src={movie.posterUrl} title={movie.title} sizes="176px" priority />
          </div>
          <div className="min-w-0 sm:self-end">
            <h1 className="font-display text-4xl uppercase leading-none sm:text-6xl">{movie.title}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/85">
              {opens && <span>{opens}</span>}
              {movie.certificate && <span className="rounded border border-ink/60 px-1.5 text-xs font-bold">{movie.certificate}</span>}
              {movie.runtimeMin && <span>{formatRuntime(movie.runtimeMin)}</span>}
              {movie.genres.length > 0 && <span>{movie.genres.join(" · ")}</span>}
              {movie.language && <span className="rounded bg-link2 px-2 py-0.5 text-xs font-bold text-white">{movie.language}</span>}
            </p>
            {formats.length > 0 && <div className="mt-3"><BadgeRow names={formats} size="sm" /></div>}
          </div>
          <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1 sm:self-start sm:gap-3">
            <TrailerButton url={movie.trailerUrl} title={movie.title} />
            <HeartButton id={movie.id} name={movie.title} kind="movie" label className="min-h-12 border border-white/40 px-4 sm:px-6" />
            <ShareButton title={movie.title} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-6">
        <OffersSection offers={getOffersForCinemas([...new Set([...theatres.map((x) => x.cinemaId), ...getListings(movie.id).map((l) => l.cinemaId)])])} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:grid lg:grid-cols-[minmax(0,56rem)_300px] lg:justify-between lg:gap-8">
        <div className="min-w-0 space-y-10">
          <h2 className="sr-only">{movie.title} showtimes and tickets in Sri Lanka</h2>
          {showtimesPanel}

          {vid && (
            <section aria-labelledby="videos">
              <h2 id="videos" className={h2}>Trailer</h2>
              <div className="max-w-sm">
                <TrailerCard title={`${movie.title}: Official trailer`} subtitle={movie.synopsis} image={movie.backdropUrl || movie.posterUrl} url={movie.trailerUrl} />
              </div>
            </section>
          )}

          <section aria-labelledby="info">
            <h2 id="info" className={h2}>More info</h2>
            <p className="leading-relaxed text-ink/85">{movie.synopsis || "Synopsis not available yet."}</p>
            <dl className="mt-4 space-y-1.5 text-sm">
              {movie.genres.length > 0 && <div className="flex gap-2"><dt className="font-bold uppercase">Genre:</dt><dd className="text-ink/85">{movie.genres.join(", ")}</dd></div>}
              {movie.language && <div className="flex gap-2"><dt className="font-bold uppercase">Language:</dt><dd className="text-ink/85">{movie.language}</dd></div>}
              {movie.releaseDate && <div className="flex gap-2"><dt className="font-bold uppercase">Release date:</dt><dd className="text-ink/85">{formatReleaseDate(movie.releaseDate)}</dd></div>}
              {movie.director && <div className="flex gap-2"><dt className="font-bold uppercase">{t("movie.director")}:</dt><dd className="text-ink/85">{movie.director}</dd></div>}
              {vid && (
                <div className="flex items-center gap-2"><dt className="font-bold uppercase">Videos:</dt>
                  <dd><a href="#videos" className="inline-flex min-h-8 items-center gap-1 font-bold uppercase text-link hover:underline"><Play className="size-3 fill-current" aria-hidden /> Watch videos</a></dd>
                </div>
              )}
            </dl>
          </section>

          <section aria-labelledby="cast">
            <h2 id="cast" className={h2}>Cast &amp; crew</h2>
            <CastCircles director={movie.director} cast={movie.cast} />
          </section>

          {(movie.posterUrl || movie.backdropUrl) && (
            <section aria-labelledby="photos">
              <h2 id="photos" className={h2}>Photos</h2>
              <div className="no-scrollbar flex gap-3 overflow-x-auto">
                {movie.posterUrl && <div className="relative aspect-[2/3] h-40 shrink-0 overflow-hidden rounded-lg border border-line sm:h-52"><Image src={movie.posterUrl} alt={`${movie.title} poster`} fill sizes="140px" className="object-cover" /></div>}
                {movie.backdropUrl && <div className="relative h-40 w-[34rem] max-w-[85vw] shrink-0 overflow-hidden rounded-lg border border-line sm:h-52"><Image src={movie.backdropUrl} alt={`${movie.title} banner`} fill sizes="544px" className="object-cover" /></div>}
              </div>
            </section>
          )}

          {faq.length > 0 && (
            <section aria-labelledby="faq">
              <h2 id="faq" className={h2}>Frequently asked questions</h2>
              <div className="divide-y divide-line rounded-xl border border-line">
                {faq.map((f) => (
                  <div key={f.q} className="p-4 sm:px-5">
                    <h3 className="text-sm font-bold">{f.q}</h3>
                    <p className="mt-1 text-sm text-ink/80">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <AdSquare />
      </div>
      <NewAndComingSoon excludeId={movie.id} />
    </>
  );
}
