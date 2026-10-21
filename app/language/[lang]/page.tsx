import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import PosterGrid from "@/components/PosterGrid";
import { LANGUAGES, getMoviesByLanguage } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => LANGUAGES.map((l) => ({ lang: l.toLowerCase() }));

const name = (slug: string) => LANGUAGES.find((l) => l.toLowerCase() === slug);

const COPY: Record<string, { title: string; h1: string; intro: string }> = {
  Tamil: { title: "Tamil Movies in Sri Lanka – Now Showing in Colombo & Showtimes", h1: "Tamil movies in Sri Lanka", intro: "Tamil movies showing in Colombo and across Sri Lanka, with showtimes, cinemas and ticket booking links, plus upcoming Tamil releases." },
  Sinhala: { title: "New Sinhala Films – Sinhala Movies Now Showing in Sri Lanka", h1: "New Sinhala films", intro: "Sinhala movies now showing in Sri Lankan cinemas, new Sinhala film releases and what's coming soon, with showtimes and booking links." },
  English: { title: "English Movies in Sri Lanka – Now Showing & Showtimes", h1: "English movies in Sri Lanka", intro: "English-language and Hollywood movies showing in Sri Lanka, in 2D, 3D and IMAX where available, with showtimes at every cinema." },
  Hindi: { title: "Hindi Movies in Sri Lanka – Now Showing & Coming Soon", h1: "Hindi movies in Sri Lanka", intro: "Hindi and Bollywood movies coming to Sri Lankan cinemas, with release dates and showtimes once they go on sale." },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = name((await params).lang);
  if (!lang) return {};
  return {
    title: `${COPY[lang].title} | fdfs.lk`,
    description: COPY[lang].intro,
    alternates: { canonical: `/language/${lang.toLowerCase()}` },
  };
}

export default async function LanguagePage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = name((await params).lang);
  if (!lang) notFound();
  const movies = getMoviesByLanguage(lang);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1={COPY[lang].h1}>{COPY[lang].intro}</PageIntro>
      <PosterGrid movies={movies} showLanguage={false} />
    </div>
  );
}
