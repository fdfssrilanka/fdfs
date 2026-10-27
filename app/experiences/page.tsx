import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { getTheatres } from "@/lib/data";
import { EXPERIENCE_PAGES } from "@/lib/experience-pages";

export const metadata: Metadata = {
  title: "Cinema Experiences in Sri Lanka – IMAX, 3D & More | fdfs.lk",
  description: "Explore Sri Lankan cinemas by format and experience, including IMAX, 3D, Dolby Atmos, Gold Class, Director's Lounge and balcony seating.",
  alternates: { canonical: "/experiences" },
  openGraph: {
    title: "Cinema Experiences in Sri Lanka – IMAX, 3D & More | fdfs.lk",
    description: "Explore Sri Lankan cinemas by format and experience, including IMAX, 3D, Dolby Atmos, Gold Class, Director's Lounge and balcony seating.",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "fdfs.lk cinema experiences in Sri Lanka" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinema Experiences in Sri Lanka – IMAX, 3D & More | fdfs.lk",
    description: "Explore Sri Lankan cinemas by format and experience, including IMAX, 3D, Dolby Atmos, Gold Class, Director's Lounge and balcony seating.",
    images: ["/opengraph-image.png"],
  },
};

export default function ExperiencesPage() {
  const pages = EXPERIENCE_PAGES.map((page) => ({
    ...page,
    count: getTheatres().filter((theatre) => theatre.experiences.includes(page.experience) || theatre.formats.includes(page.experience)).length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="Cinema experiences in Sri Lanka">
        Compare Sri Lankan cinemas by the formats and seating experiences they list. Open a format to see participating cinemas and published movie showtimes.
      </PageIntro>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/imax" className="rounded-2xl border border-line bg-surface p-5 hover:border-accent">
          <h2 className="text-lg font-extrabold">IMAX cinemas</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Find IMAX theatres, movies and showtimes in Sri Lanka.</p>
        </Link>
        {pages.map((page) => (
          <Link key={page.slug} href={`/experiences/${page.slug}`} className="rounded-2xl border border-line bg-surface p-5 hover:border-accent">
            <h2 className="text-lg font-extrabold">{page.experience}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{page.count} cinema{page.count === 1 ? "" : "s"} listed. Browse venues and published showtimes.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
