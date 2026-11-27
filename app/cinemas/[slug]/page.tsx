import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqList from "@/components/Faq";
import OffersSection from "@/components/OffersSection";
import PageIntro from "@/components/PageIntro";
import PosterCard from "@/components/PosterCard";
import TheatreCard from "@/components/TheatreCard";
import { getChain, getChainMovies, getChains, getChainTheatres } from "@/lib/chains";
import { getOffersForCinemas, getPremiumFormats, getTag, hasShowtimes, slugify } from "@/lib/data";
import { regionOf } from "@/lib/geo";
import { joinList } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getChains().map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getChain((await params).slug);
  if (!c) return {};
  return { title: `${c.title} | fdfs.lk`, description: c.intro, alternates: { canonical: `/cinemas/${c.slug}` } };
}

export default async function ChainPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getChain((await params).slug);
  if (!c) notFound();
  const theatres = getChainTheatres(c);
  const movies = getChainMovies(c);
  const regions = [...new Set(theatres.map((t) => regionOf(t.city)))].sort();
  const withTimes = theatres.filter((t) => hasShowtimes(t.id));
  const formats = [...new Set(theatres.flatMap((t) => t.experiences))];
  const faq = [
    { q: `How many ${c.name} locations are there in Sri Lanka?`, a: `fdfs.lk lists ${theatres.length} ${c.name} locations, in ${joinList(regions)}.` },
    ...(movies.length ? [{ q: `What movies are showing at ${c.name} today?`, a: `Movies with showtimes at ${c.name} include ${joinList(movies.slice(0, 8).map((m) => m.title))}${movies.length > 8 ? " and more" : ""}.` }] : []),
    { q: `How do I book tickets at ${c.name}?`, a: withTimes.length ? `Open a location below, choose a movie and a showtime, and you'll go to the cinema's own booking page to pick seats and pay. fdfs.lk doesn't sell tickets.` : `Open a location below for its address, phone number and booking link where it has one. fdfs.lk doesn't sell tickets.` },
    ...(formats.length ? [{ q: `Which formats do ${c.name} offer?`, a: `Across its locations: ${joinList(formats)}. Each cinema's page lists what that hall has.` }] : []),
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1={c.h1}>{c.intro}</PageIntro>
      <p className="-mt-3 mb-6 text-sm text-muted">Also searched as: {c.aka.join(" · ")}</p>
      <h2 className="mb-3 text-xl font-extrabold">{theatres.length} locations</h2>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {theatres.map((t) => <TheatreCard key={t.id} theatre={t} />)}
      </div>
      <p className="mb-10 text-sm">
        By city:{" "}
        {regions.map((r, i) => (
          <span key={r}>{i > 0 && " · "}<Link href={`/cities/${slugify(r)}`} className="text-link underline underline-offset-2">Cinemas in {r}</Link></span>
        ))}
      </p>
      {movies.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">Movies showing at {c.name}</h2>
          <div className="mb-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((m) => <PosterCard key={m.id} movie={m} tag={getTag(m)} formats={getPremiumFormats(m.id)} />)}
          </div>
        </>
      )}
      <OffersSection offers={getOffersForCinemas([...new Set(theatres.map((t) => t.cinemaId))])} className="mb-10" />
      <div className="max-w-3xl"><FaqList faq={faq} /></div>
    </div>
  );
}
