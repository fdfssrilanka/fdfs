import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import PosterGrid from "@/components/PosterGrid";
import TheatreCard from "@/components/TheatreCard";
import { getCinema, getCities, getCity, getMoviesInCity, getTheatresByCity } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => getCities().map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const city = getCity((await params).slug);
  if (!city) return {};
  return {
    title: `Cinemas in ${city.name} – Movies Showing Today & Showtimes | fdfs.lk`,
    description: `Cinemas in ${city.name}: movies showing today, showtimes and booking links. Compare every cinema in ${city.name} in one place.`,
    alternates: { canonical: `/cities/${city.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const city = getCity((await params).slug);
  if (!city) notFound();
  const movies = getMoviesInCity(city.name);
  const theatres = getTheatresByCity(city.name);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1={`Cinemas in ${city.name}`}>{`Movies showing today in ${city.name}: ${theatres.length} cinema${theatres.length === 1 ? "" : "s"} with showtimes and links to book tickets online.`}</PageIntro>
      <h2 className="mb-3 text-xl font-extrabold">Theatres</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {theatres.map((x) => (
          <TheatreCard key={x.id} theatre={x} chain={getCinema(x.cinemaId)?.name} />
        ))}
      </div>
      {movies.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">Movies in {city.name}</h2>
          <PosterGrid movies={movies} />
        </>
      )}
    </div>
  );
}
