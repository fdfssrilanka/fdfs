import type { Metadata } from "next";
import Link from "next/link";
import FaqList from "@/components/Faq";
import PageIntro from "@/components/PageIntro";
import PosterCard from "@/components/PosterCard";
import { getMovies, getPremiumFormats, getTag } from "@/lib/data";
import { formatReleaseDate } from "@/lib/format";
import { joinList } from "@/lib/seo";
import type { Movie } from "@/lib/types";

export const metadata: Metadata = {
  title: "New Movie Releases in Sri Lanka – Release Dates by Month | fdfs.lk",
  description: "New movies releasing in Sri Lankan cinemas, by month: Sinhala, Tamil, English and Hindi films with release dates, showtimes and links to book.",
  alternates: { canonical: "/new-releases" },
};

const monthOf = (d: string) => new Date(`${d.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

function byMonth(list: Movie[]) {
  const groups = new Map<string, Movie[]>();
  for (const m of list) groups.set(m.releaseDate.slice(0, 7), [...(groups.get(m.releaseDate.slice(0, 7)) ?? []), m]);
  return [...groups.entries()];
}

export default function NewReleasesPage() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" });
  const dated = getMovies().filter((m) => m.releaseDate && m.posterUrl);
  const upcoming = dated.filter((m) => m.releaseDate > today).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  const recent = dated.filter((m) => m.releaseDate <= today && m.status === "now_showing").sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  const grid = "mb-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
  const next = upcoming[0];
  const faq = [
    ...(next ? [{ q: "What new movies are coming to Sri Lankan cinemas?", a: `Next up: ${joinList(upcoming.slice(0, 5).map((m) => `${m.title} (${formatReleaseDate(m.releaseDate)})`))}.` }] : []),
    ...(recent.length ? [{ q: "What are the latest movies released in Sri Lanka?", a: `Recently released and still showing: ${joinList(recent.slice(0, 6).map((m) => m.title))}.` }] : []),
    { q: "Where do these release dates come from?", a: "From the cinemas' own websites. A date can move, so check the movie's page for showtimes once tickets go on sale." },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="New movie releases in Sri Lanka">
        New movies coming to Sri Lankan cinemas and the latest releases still showing, by month, in Sinhala, Tamil, English and Hindi. Pick a film for its showtimes at every cinema. See also{" "}
        <Link href="/coming-soon" className="text-link underline underline-offset-2">all upcoming movies</Link> and{" "}
        <Link href="/movies" className="text-link underline underline-offset-2">everything showing today</Link>.
      </PageIntro>
      {upcoming.length > 0 && <h2 className="mb-4 mt-2 font-display text-3xl uppercase">Coming soon</h2>}
      {byMonth(upcoming).map(([month, list]) => (
        <section key={`u${month}`}>
          <h3 className="mb-3 text-xl font-extrabold">{monthOf(month)} releases</h3>
          <div className={grid}>{list.map((m) => <PosterCard key={m.id} movie={m} tag={getTag(m)} />)}</div>
        </section>
      ))}
      {recent.length > 0 && <h2 className="mb-4 mt-6 font-display text-3xl uppercase">Recently released</h2>}
      {byMonth(recent).map(([month, list]) => (
        <section key={`r${month}`}>
          <h3 className="mb-3 text-xl font-extrabold">Released in {monthOf(month)}</h3>
          <div className={grid}>{list.map((m) => <PosterCard key={m.id} movie={m} tag={getTag(m)} formats={getPremiumFormats(m.id)} />)}</div>
        </section>
      ))}
      <div className="mt-4 max-w-3xl"><FaqList faq={faq} /></div>
    </div>
  );
}
