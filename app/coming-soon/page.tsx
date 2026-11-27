import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import PosterGrid from "@/components/PosterGrid";
import { getComingSoon } from "@/lib/data";

export const metadata: Metadata = {
  title: "Upcoming Movies in Sri Lanka – Coming Soon to Cinemas | fdfs.lk",
  description: "Upcoming movies coming soon to Sri Lankan cinemas, with release dates and trailers, in Tamil, Sinhala, English and Hindi.",
  alternates: { canonical: "/coming-soon" },
};

export default function ComingSoonPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="Upcoming movies">Movies coming soon to Sri Lankan cinemas, with release dates and trailers. Showtimes appear once cinemas publish them. For every release by month, see <Link href="/new-releases" className="text-link underline underline-offset-2">new movie releases</Link>.</PageIntro>
      <PosterGrid movies={getComingSoon()} />
    </div>
  );
}
