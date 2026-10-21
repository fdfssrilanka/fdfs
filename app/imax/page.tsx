import type { Metadata } from "next";
import Link from "next/link";
import FaqList from "@/components/Faq";
import PageIntro from "@/components/PageIntro";
import PosterCard from "@/components/PosterCard";
import TheatreCard from "@/components/TheatreCard";
import { getCinema, getMovies, getShowtimes, getTheatresWithExperience } from "@/lib/data";
import { joinList, theatreNames } from "@/lib/seo";

export const metadata: Metadata = {
  title: "IMAX Cinema in Sri Lanka – IMAX Movies & Showtimes | fdfs.lk",
  description: "IMAX movie theater listings in Sri Lanka: which cinemas have IMAX screens, which movies are playing in IMAX and their showtimes.",
  alternates: { canonical: "/imax" },
};

export default function ImaxPage() {
  const theatres = getTheatresWithExperience("IMAX");
  const ids = new Set(getShowtimes().filter((s) => s.format === "IMAX").map((s) => s.movieId));
  const movies = getMovies().filter((m) => ids.has(m.id));
  const names = joinList(theatres.map((x) => theatreNames(x).short));
  const faq = [
    { q: "Where can I watch IMAX movies in Sri Lanka?", a: `Cinemas listing an IMAX screen include ${names}. Open a theatre to see its movies and showtimes.` },
    { q: "Which movies are showing in IMAX?", a: movies.length ? `Right now, ${joinList(movies.map((m) => m.title))}.` : "No IMAX showtimes are published at the moment." },
    { q: "How do I book IMAX tickets?", a: "Pick an IMAX movie, choose an IMAX showtime and book on the cinema's own site. IMAX seats and prices are set by the cinema." },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="IMAX cinema in Sri Lanka">Find an IMAX movie theater near you, see which movies are playing in IMAX, and jump to the cinema to book tickets.</PageIntro>
      <h2 className="mb-3 text-xl font-extrabold">IMAX theatres</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {theatres.map((x) => <TheatreCard key={x.id} theatre={x} chain={getCinema(x.cinemaId)?.name} />)}
      </div>
      {movies.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">Movies in IMAX</h2>
          <div className="mb-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((m) => <PosterCard key={m.id} movie={m} formats={["IMAX"]} />)}
          </div>
        </>
      )}
      <div className="max-w-3xl"><FaqList faq={faq} /></div>
      <p className="mt-6 text-sm text-muted">Looking for something else? See <Link href="/theatres" className="text-link underline underline-offset-2">all cinemas</Link>.</p>
    </div>
  );
}
