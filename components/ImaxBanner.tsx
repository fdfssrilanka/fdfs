import Image from "next/image";
import Link from "next/link";
import { getMovies, getShowtimes, getTheatreById } from "@/lib/data";

/** Promo banner built from real data: the first movie with an IMAX showtime and the theatre playing it. */
export default function ImaxBanner() {
  const imax = getShowtimes().find((s) => s.format === "IMAX");
  const movie = imax && getMovies().find((m) => m.id === imax.movieId);
  const theatre = imax && getTheatreById(imax.theatreId);
  if (!movie || !theatre) return null;
  const img = movie.backdropUrl || movie.posterUrl;
  return (
    <section className="cv-auto mx-auto w-full max-w-7xl px-4 py-6">
      <div className="relative isolate flex min-h-60 items-center overflow-hidden rounded-2xl border border-line">
        <Image src={img} alt="" fill sizes="1280px" className="-z-10 object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
        <div className="max-w-lg p-6 sm:p-10">
          <span className="rounded bg-accent px-2 py-1 text-[11px] font-black uppercase tracking-wider text-accent-ink">On the big screen</span>
          <h2 className="mt-3 font-display text-4xl uppercase leading-none sm:text-6xl">See {movie.title.replace(/\s*-\s*IMAX$/i, "")} in IMAX with Laser</h2>
          <p className="mt-2 text-sm text-ink/80 sm:text-base">Now showing at {theatre.name.replace("Multiplex - ", "")}, {theatre.address.split(",").slice(-1)[0].trim()}.</p>
          <Link href={`/movies/${movie.slug}#showtimes`} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-accent px-6 text-sm font-bold text-accent-ink hover:brightness-110">
            Get showtimes
          </Link>
        </div>
      </div>
    </section>
  );
}
