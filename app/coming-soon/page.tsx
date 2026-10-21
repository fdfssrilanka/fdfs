import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import PosterGrid from "@/components/PosterGrid";
import { getComingSoon } from "@/lib/data";

export const metadata: Metadata = {
  title: "New & Upcoming Movies in Sri Lanka – New Release Movies | fdfs.lk",
  description: "New and upcoming movies in Sri Lanka: new release films with release dates and trailers, in Tamil, Sinhala, English and Hindi.",
  alternates: { canonical: "/coming-soon" },
};

export default function ComingSoonPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="New and upcoming movies">New release movies and new films heading to Sri Lankan cinemas, with release dates and trailers. Showtimes appear once cinemas publish them.</PageIntro>
      <PosterGrid movies={getComingSoon()} />
    </div>
  );
}
