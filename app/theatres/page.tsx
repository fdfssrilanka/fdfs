import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import TheatreCard from "@/components/TheatreCard";
import { getCinema, getCities, getTheatresByCity } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cinema Halls in Sri Lanka – Movie Theatres by City | fdfs.lk",
  description: "Cinema halls and movie theatres in Sri Lanka by city: addresses, IMAX, Gold Class and Dolby Atmos screens, showtimes and links to book tickets.",
  alternates: { canonical: "/theatres" },
};

export default function TheatresPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="Cinema halls and movie theatres in Sri Lanka">Find a city cinema by town, with addresses, premium formats and links to showtimes and online booking.</PageIntro>
      {getCities().map((c) => (
        <section key={c.slug} className="mb-8">
          <h2 className="mb-3 text-xl font-extrabold"><Link href={`/cities/${c.slug}`} className="hover:text-accent">{c.name}</Link></h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {getTheatresByCity(c.name).map((x) => (
              <TheatreCard key={x.id} theatre={x} chain={getCinema(x.cinemaId)?.name} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
