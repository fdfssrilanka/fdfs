import type { Metadata } from "next";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import FaqList from "@/components/Faq";
import ExperienceCards from "@/components/ExperienceCards";
import ImaxBanner from "@/components/ImaxBanner";
import NewAndComingSoon from "@/components/NewAndComingSoon";
import OffersSection from "@/components/OffersSection";
import PosterCard from "@/components/PosterCard";
import PromoStrip, { type Promo } from "@/components/PromoStrip";
import TheatresNearYou from "@/components/TheatresNearYou";
import TrailerCard from "@/components/TrailerCard";
import { getCinema, getCities, getOffers, getComingSoon, getMovies, getMoviesByLanguage, getNowShowing, getPremiumFormats, getShowtimes, getTag, getTheatreById, getTheatres } from "@/lib/data";
import { formatReleaseDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { Movie } from "@/lib/types";

export const metadata: Metadata = {
  title: "Movies Showing in Sri Lanka Today – Movie Showtimes & Ticket Booking | fdfs.lk",
  description: "Now showing movies in Sri Lanka: today's movie showtimes at cinemas in Colombo and beyond, new releases in Tamil, Sinhala, English and Hindi, and links to book tickets online.",
  alternates: { canonical: "/" },
};

const POSTER_SLIDE = "basis-[38%] sm:basis-[26%] md:basis-[20%] lg:basis-[14.28%]";

/** Only the first row (visible without scrolling) loads eagerly; the rest lazy-load. */
function Posters({ movies, first = false }: { movies: Movie[]; first?: boolean }) {
  return movies.map((m, i) => <PosterCard key={m.id} movie={m} compact priority={first && i < 3} eager={first && i >= 3 && i < 7} tag={getTag(m)} formats={getPremiumFormats(m.id)} />);
}

export default function Home() {
  const chains = Object.fromEntries(getTheatres().map((x) => [x.cinemaId, getCinema(x.cinemaId)?.name ?? ""]));
  const now = getNowShowing();
  const soon = getComingSoon();
  const trailers = [...now, ...soon].filter((m) => m.trailerUrl && (m.backdropUrl || m.posterUrl));

  const imax = getShowtimes().find((s) => s.format === "IMAX");
  const imaxMovie = imax && getMovies().find((m) => m.id === imax.movieId);
  const imaxTheatre = imax && getTheatreById(imax.theatreId);
  const next = [...soon].filter((m) => m.releaseDate).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))[0];
  const promos: Promo[] = [
    { icon: "ticket", lead: `${now.length} movies now showing`, text: "Pick a movie to see every theatre and showtime.", href: "/movies" },
    ...now.filter((m) => m.trailerUrl).slice(0, 3).map((m) => ({ icon: "ticket" as const, lead: `Get tickets for ${m.title}`, text: `${m.language} · see showtimes at every cinema`, href: `/movies/${m.slug}#showtimes` })),
    ...(imaxMovie && imaxTheatre ? [{ icon: "imax" as const, lead: "In IMAX with Laser:", text: `${imaxMovie.title.replace(/\s*-\s*IMAX$/i, "")} at ${imaxTheatre.name.replace("Multiplex - ", "")}`, href: `/movies/${imaxMovie.slug}#showtimes` }] : []),
    ...(next ? [{ icon: "soon" as const, lead: "Coming soon:", text: `${next.title} · ${formatReleaseDate(next.releaseDate)}`, href: `/movies/${next.slug}` }] : []),
    { icon: "trailer", lead: "Watch trailers", text: "for new and upcoming releases.", href: "/#trailers" },
  ];

  const faq = [
    { q: "What movies are showing in Sri Lanka today?", a: `${now.length} movies are showing right now, including ${now.slice(0, 4).map((m) => m.title).join(", ")}. Open any movie to see every cinema, date and showtime.` },
    { q: "How do I book movie tickets online in Sri Lanka?", a: "Pick a movie, choose a date and a cinema, then tap a showtime. You'll go to the cinema's own booking page, where you choose seats and pay. fdfs.lk doesn't sell tickets." },
    { q: "How do I find cinemas near me?", a: "Choose your city at the top of the page, or tap Use my location. Theatres are listed nearest first, with their address, formats and a map link." },
    { q: "Which languages can I find?", a: "Tamil, Sinhala, English and Hindi movies, with new and upcoming releases listed separately." },
  ];

  return (
    <>
      <h1 className="sr-only">Movies now showing in Sri Lanka: movie showtimes and online ticket booking</h1>
      <PromoStrip promos={promos} />
      <Carousel title={t("row.nowShowing")} href="/movies" linkLabel="See all movies" slideClass={POSTER_SLIDE}>
        <Posters movies={now} first />
      </Carousel>
      <Carousel title={t("row.comingSoon")} href="/coming-soon" linkLabel="See all movies" slideClass={POSTER_SLIDE} defer>
        <Posters movies={soon} />
      </Carousel>
      {["Tamil", "Sinhala", "English", "Hindi"].map((lang) => (
        <Carousel key={lang} title={t("row.language", { lang })} href={`/language/${lang.toLowerCase()}`} linkLabel="See all movies" slideClass={POSTER_SLIDE} defer>
          <Posters movies={getMoviesByLanguage(lang).filter((m) => m.status === "now_showing")} />
        </Carousel>
      ))}
      <Carousel title="Trailers" id="trailers" slideClass="basis-[80%] sm:basis-[48%] lg:basis-[32%]" arrowTop="top-[28%]" defer>
        {trailers.map((m) => (
          <TrailerCard key={m.id} title={`Trailer: ${m.title}`} subtitle={m.synopsis} image={m.backdropUrl || m.posterUrl} url={m.trailerUrl} />
        ))}
      </Carousel>
      <TheatresNearYou theatres={getTheatres()} chains={chains} cities={getCities().map((c) => c.name)} />
      <ImaxBanner />
      <OffersSection offers={getOffers()} title="Offers" bare={false} />
      <ExperienceCards />
      <NewAndComingSoon />
      <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-ink/80">
          <h2 className="text-base font-extrabold uppercase tracking-wide text-ink sm:text-lg">Now showing movies in Sri Lanka</h2>
          <p>
            fdfs.lk lists movie showtimes for cinemas across Sri Lanka, from <Link href="/cities/colombo" className="text-link underline underline-offset-2">cinemas in Colombo</Link> to
            Kandy, Negombo and more. See which new movies are on today, compare movie times by theatre, and go straight to the cinema to book.
          </p>
          <p>
            Browse <Link href="/language/tamil" className="text-link underline underline-offset-2">Tamil movies</Link>, <Link href="/language/sinhala" className="text-link underline underline-offset-2">Sinhala films</Link>,{" "}
            <Link href="/language/english" className="text-link underline underline-offset-2">English movies</Link> and <Link href="/language/hindi" className="text-link underline underline-offset-2">Hindi movies</Link>, check what&apos;s{" "}
            <Link href="/coming-soon" className="text-link underline underline-offset-2">coming soon</Link>, find <Link href="/imax" className="text-link underline underline-offset-2">IMAX cinemas</Link>, or read{" "}
            <Link href="/book-movie-tickets" className="text-link underline underline-offset-2">how to book movie tickets online</Link>.
          </p>
        </div>
        <div className="max-w-3xl"><FaqList faq={faq} /></div>
      </section>
    </>
  );
}
