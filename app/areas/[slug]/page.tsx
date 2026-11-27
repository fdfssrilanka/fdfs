import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqList from "@/components/Faq";
import PageIntro from "@/components/PageIntro";
import PosterCard from "@/components/PosterCard";
import TheatreCard from "@/components/TheatreCard";
import { getAreas, getArea, getCinema, getMoviesAtTheatre, getPremiumFormats, getTag, slugify } from "@/lib/data";
import { regionOf } from "@/lib/geo";
import { joinList } from "@/lib/seo";
import { getNearTown, getNearTowns, hallsNear } from "@/lib/nearby";

export const dynamicParams = false;
export const generateStaticParams = () => [...getAreas(), ...getNearTowns()].map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const near = getNearTown(slug);
  if (near) {
    const halls = hallsNear(near.at, 3);
    return {
      title: `Film Halls Near ${near.name} – Nearest Cinemas & Showtimes | fdfs.lk`,
      description: `Nearest film halls to ${near.name}: ${joinList(halls.map((h) => `${h.theatre.name} (about ${h.km} km)`))}. Movies showing, showtimes and how to book.`,
      alternates: { canonical: `/areas/${near.slug}` },
    };
  }
  const a = getArea(slug);
  if (!a) return {};
  const n = a.theatres.length;
  return {
    title: `Film Halls & Cinemas in ${a.name} – Showtimes & Tickets | fdfs.lk`,
    description: `${n} cinema${n === 1 ? "" : "s"} in ${a.name}: ${joinList(a.theatres.slice(0, 3).map((t) => t.name))}. Movies showing, showtimes, addresses and ticket booking links.`,
    alternates: { canonical: `/areas/${a.slug}` },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const near = getNearTown(slug);
  if (near) return <NearPage name={near.name} at={near.at} />;
  const a = getArea(slug);
  if (!a) notFound();
  const region = regionOf(a.theatres[0].city);
  const movies = [...new Map(a.theatres.flatMap((t) => getMoviesAtTheatre(t.id)).map((m) => [m.id, m])).values()];
  const names = joinList(a.theatres.map((t) => t.name));
  const faq = [
    { q: `Which cinemas are in ${a.name}?`, a: `${a.name} has ${a.theatres.length === 1 ? "one cinema" : `${a.theatres.length} cinemas`} listed on fdfs.lk: ${names}.` },
    ...(movies.length ? [{ q: `What movies are showing in ${a.name}?`, a: `Movies with showtimes in ${a.name} include ${joinList(movies.slice(0, 6).map((m) => m.title))}.` }] : []),
    { q: `How do I book tickets for a film hall in ${a.name}?`, a: "Open a cinema to see its showtimes and booking link, or call the cinema if it doesn't publish showtimes online. fdfs.lk doesn't sell tickets." },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1={`Film halls and cinemas in ${a.name}`}>
        {`${a.theatres.length} cinema${a.theatres.length === 1 ? "" : "s"} in ${a.name}`}{movies.length ? ", with movies showing today and showtimes" : ""}. Find the nearest film hall, its address and how to book.{" "}
        <Link href={`/cities/${slugify(region)}`} className="text-link underline underline-offset-2">More cinemas in {region}</Link>.
      </PageIntro>
      <h2 className="mb-3 text-xl font-extrabold">Cinemas in {a.name}</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {a.theatres.map((t) => <TheatreCard key={t.id} theatre={t} chain={getCinema(t.cinemaId)?.name} />)}
      </div>
      {movies.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">Movies showing in {a.name}</h2>
          <div className="mb-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((m) => <PosterCard key={m.id} movie={m} tag={getTag(m)} formats={getPremiumFormats(m.id)} />)}
          </div>
        </>
      )}
      <div className="max-w-3xl"><FaqList faq={faq} /></div>
    </div>
  );
}

/** A town people search for ("nugegoda film hall") that has no cinema of its own: the closest listed halls instead. */
function NearPage({ name, at }: { name: string; at: { lat: number; lng: number } }) {
  const halls = hallsNear(at);
  const nearest = halls[0];
  const movies = [...new Map(halls.flatMap((h) => getMoviesAtTheatre(h.theatre.id)).map((m) => [m.id, m])).values()];
  const withTimes = halls.filter((h) => getMoviesAtTheatre(h.theatre.id).length);
  const faq = [
    { q: `Is there a film hall in ${name}?`, a: `fdfs.lk has no cinema listed in ${name} itself. The nearest${nearest ? ` is ${nearest.theatre.name}, about ${nearest.km} km away` : " halls are listed above"}.` },
    { q: `What is the nearest cinema to ${name}?`, a: `By straight-line distance: ${joinList(halls.slice(0, 4).map((h) => `${h.theatre.name} (about ${h.km} km)`))}. Road distance is longer.` },
    ...(withTimes.length ? [{ q: `Which cinemas near ${name} have showtimes online?`, a: `${joinList(withTimes.map((h) => h.theatre.name))}. Open one to see what's on and book on the cinema's own site.` }] : []),
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1={`Film halls near ${name}`}>
        {`There's no cinema listed in ${name} itself, so these are the ${halls.length} nearest film halls, closest first`}{movies.length ? ", with the movies they're showing" : ""}. Distances are approximate and in a straight line.{" "}
        <Link href="/areas" className="text-link underline underline-offset-2">All film halls by town</Link>.
      </PageIntro>
      <h2 className="mb-3 text-xl font-extrabold">Nearest cinemas to {name}</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {halls.map((h) => <TheatreCard key={h.theatre.id} theatre={h.theatre} chain={getCinema(h.theatre.cinemaId)?.name} distanceKm={h.km} />)}
      </div>
      {movies.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">Movies showing near {name}</h2>
          <div className="mb-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((m) => <PosterCard key={m.id} movie={m} tag={getTag(m)} formats={getPremiumFormats(m.id)} />)}
          </div>
        </>
      )}
      <div className="max-w-3xl"><FaqList faq={faq} /></div>
    </div>
  );
}
