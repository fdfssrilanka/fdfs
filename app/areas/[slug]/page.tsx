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

export const dynamicParams = false;
export const generateStaticParams = () => getAreas().map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArea((await params).slug);
  if (!a) return {};
  const n = a.theatres.length;
  return {
    title: `Film Halls & Cinemas in ${a.name} – Showtimes & Tickets | fdfs.lk`,
    description: `${n} cinema${n === 1 ? "" : "s"} in ${a.name}: ${joinList(a.theatres.slice(0, 3).map((t) => t.name))}. Movies showing, showtimes, addresses and ticket booking links.`,
    alternates: { canonical: `/areas/${a.slug}` },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArea((await params).slug);
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
