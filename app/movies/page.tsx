import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import PosterGrid from "@/components/PosterGrid";
import { getNowShowing } from "@/lib/data";

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
    </div>
  );
}
