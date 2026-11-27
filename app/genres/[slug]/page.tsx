import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import PosterCard from "@/components/PosterCard";
import { getGenre, getGenrePages, getPremiumFormats, getTag } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => getGenrePages().map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGenre((await params).slug);
  if (!g) return {};
  return {
    title: `${g.name} Movies in Sri Lanka – Now Showing & Coming Soon | fdfs.lk`,
    description: `${g.name} movies in Sri Lankan cinemas: ${g.movies.slice(0, 4).map((m) => m.title).join(", ")}. Showtimes, cinemas and ticket booking links.`,
    alternates: { canonical: `/genres/${g.slug}` },
  };
}

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGenre((await params).slug);
  if (!g) notFound();
  const now = g.movies.filter((m) => m.status === "now_showing");
  const soon = g.movies.filter((m) => m.status === "coming_soon");
  const grid = "mb-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1={`${g.name} movies in Sri Lanka`}>
        {`${g.movies.length} ${g.name.toLowerCase()} movies in Sri Lankan cinemas: ${now.length} now showing and ${soon.length} coming soon. Pick one for showtimes at every cinema and a link to book.`}
      </PageIntro>
      {now.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">{g.name} movies now showing</h2>
          <div className={grid}>{now.map((m) => <PosterCard key={m.id} movie={m} tag={getTag(m)} formats={getPremiumFormats(m.id)} />)}</div>
        </>
      )}
      {soon.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">Upcoming {g.name.toLowerCase()} movies</h2>
          <div className={grid}>{soon.map((m) => <PosterCard key={m.id} movie={m} tag={getTag(m)} />)}</div>
        </>
      )}
      <h2 className="mb-3 text-base font-extrabold uppercase tracking-wide">More genres</h2>
      <p className="text-sm leading-loose">
        {getGenrePages().filter((x) => x.slug !== g.slug).map((x, i) => (
          <span key={x.slug}>{i > 0 && " · "}<Link href={`/genres/${x.slug}`} className="text-link underline underline-offset-2">{x.name} movies</Link></span>
        ))}
      </p>
    </div>
  );
}
