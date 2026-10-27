import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqList from "@/components/Faq";
import PageIntro from "@/components/PageIntro";
import PosterCard from "@/components/PosterCard";
import TheatreCard from "@/components/TheatreCard";
import { getCinema, getMovieById, getMoviesAtTheatre, getShowtimes, getTheatres } from "@/lib/data";
import { getExperiencePage, EXPERIENCE_PAGES } from "@/lib/experience-pages";
import { joinList, theatreNames } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => EXPERIENCE_PAGES.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getExperiencePage((await params).slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/experiences/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "fdfs.lk cinema showtimes in Sri Lanka" }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/opengraph-image.png"],
    },
  };
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const page = getExperiencePage((await params).slug);
  if (!page) notFound();

  const theatres = getTheatres().filter(
    (theatre) => theatre.experiences.includes(page.experience) || theatre.formats.includes(page.experience),
  );
  const theatreIds = new Set(theatres.map((theatre) => theatre.id));
  const showtimes = getShowtimes().filter(
    (showtime) => theatreIds.has(showtime.theatreId) && (!page.showtimeFormat || showtime.format === page.showtimeFormat),
  );
  const movieIds = new Set(
    page.showtimeFormat
      ? showtimes.map((showtime) => showtime.movieId)
      : theatres.flatMap((theatre) => getMoviesAtTheatre(theatre.id).map((movie) => movie.id)),
  );
  const movies = [...movieIds].flatMap((id) => {
    const movie = getMovieById(id);
    return movie ? [movie] : [];
  });
  const names = joinList(theatres.map((theatre) => theatreNames(theatre).short));
  const faq = [
    {
      q: `Which cinemas in Sri Lanka list ${page.experience}?`,
      a: theatres.length
        ? `${page.experience} is listed at ${names}. Open a cinema page to see its address and current booking information.`
        : `There are no cinemas currently listed with ${page.experience}.`,
    },
    {
      q: page.showtimeFormat
        ? `Which movies have ${page.experience} showtimes?`
        : `Which movies are currently listed at cinemas with ${page.experience}?`,
      a: page.showtimeFormat
        ? movies.length
          ? `Published ${page.experience} showtimes are available for ${joinList(movies.map((movie) => movie.title))}. Check the cinema's booking page for current availability.`
          : `No ${page.experience} showtimes are currently published in our listings. Check the cinema's booking page for the latest schedule.`
        : movies.length
          ? `Current movie listings at these cinemas include ${joinList(movies.map((movie) => movie.title))}. Check the cinema's booking page for session and seating details.`
          : `No movie showtimes are currently published for these cinemas. Check the venue's booking page for the latest schedule.`,
    },
    {
      q: "Where do I check ticket prices and availability?",
      a: "Ticket prices, seats and availability are set by each cinema. Follow a showtime or open a cinema page to continue to its own booking site.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1={page.h1}>{page.intro}</PageIntro>
      <h2 className="mb-3 text-xl font-extrabold">Cinemas listing {page.experience}</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {theatres.map((theatre) => (
          <TheatreCard key={theatre.id} theatre={theatre} chain={getCinema(theatre.cinemaId)?.name} />
        ))}
      </div>
      {movies.length > 0 && (
        <>
          <h2 className="mb-3 text-xl font-extrabold">
            {page.showtimeFormat ? `${page.experience} movies with published showtimes` : `Current movies at cinemas listing ${page.experience}`}
          </h2>
          <div className="mb-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie) => <PosterCard key={movie.id} movie={movie} formats={page.showtimeFormat ? [page.showtimeFormat] : undefined} />)}
          </div>
        </>
      )}
      <div className="max-w-3xl"><FaqList faq={faq} /></div>
    </div>
  );
}
