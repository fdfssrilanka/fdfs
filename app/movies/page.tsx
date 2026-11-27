import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import PosterGrid from "@/components/PosterGrid";
import Link from "next/link";
import { getGenrePages, getNowShowing } from "@/lib/data";

export const metadata: Metadata = {
  title: "Movies Today in Sri Lanka – Now Showing Movie Times & Tickets | fdfs.lk",
  description: "Now showing movies in Sri Lanka today: movie times at every cinema, in Tamil, Sinhala, English and Hindi. Pick a movie for theatres, showtimes and online ticket booking.",
  alternates: { canonical: "/movies" },
};

export default function MoviesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="Now showing movies in Sri Lanka">Every movie playing today in Sri Lankan cinemas, with movie showtimes by theatre. Choose a movie to see which cinemas are showing it and book tickets online.</PageIntro>
      <PosterGrid movies={getNowShowing()} />
      <p className="mt-10 text-sm leading-loose">
        Browse by genre:{" "}
        {getGenrePages().map((g, i) => (
          <span key={g.slug}>{i > 0 && " · "}<Link href={`/genres/${g.slug}`} className="text-link underline underline-offset-2">{g.name} movies</Link></span>
        ))}
      </p>
    </div>
  );
}
