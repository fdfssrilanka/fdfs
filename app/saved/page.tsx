import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import SavedMovies from "@/components/SavedMovies";
import SavedTheatres from "@/components/SavedTheatres";
import { getCinema, getMovies, getTheatres } from "@/lib/data";

export const metadata: Metadata = {
  title: "Saved Movies & Theatres | fdfs.lk",
  description: "Your saved movies and cinemas on fdfs.lk.",
  robots: { index: false },
};

export default function SavedPage() {
  const chains = Object.fromEntries(getTheatres().map((x) => [x.cinemaId, getCinema(x.cinemaId)?.name ?? ""]));
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <PageIntro h1="Saved">Tap the heart on any movie or theatre to keep it here. Saved items stay in this browser only.</PageIntro>
      <section>
        <h2 className="mb-3 text-xl font-extrabold">Movies</h2>
        <SavedMovies movies={getMovies()} />
      </section>
      <section>
        <h2 className="mb-3 text-xl font-extrabold">Theatres</h2>
        <SavedTheatres theatres={getTheatres()} chains={chains} />
      </section>
    </div>
  );
}
