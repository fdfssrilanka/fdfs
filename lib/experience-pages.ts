export interface ExperiencePage {
  slug: string;
  experience: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  showtimeFormat?: string;
}

export const EXPERIENCE_PAGES = [
  {
    slug: "dolby-atmos",
    experience: "Dolby Atmos",
    title: "Dolby Atmos Cinemas in Sri Lanka – Movies & Showtimes | fdfs.lk",
    description: "Find Sri Lankan cinemas listing Dolby Atmos, check movies with Dolby Atmos showtimes, and book on the cinema's own website.",
    h1: "Dolby Atmos cinemas in Sri Lanka",
    intro: "Find cinemas that list Dolby Atmos and check published showtimes in this format. fdfs.lk links to each cinema's own booking page for current availability and ticket prices.",
    showtimeFormat: "Dolby Atmos",
  },
  {
    slug: "3d-cinemas",
    experience: "3D",
    title: "3D Cinemas in Sri Lanka – 3D Movies & Showtimes | fdfs.lk",
    description: "Find cinemas showing 3D movies in Sri Lanka. Compare published 3D showtimes by cinema and book directly with the cinema.",
    h1: "3D cinemas and movies in Sri Lanka",
    intro: "Browse Sri Lankan cinemas listing 3D and see movies with published 3D showtimes. Choose a cinema or movie to check current times and follow its booking link.",
    showtimeFormat: "3D",
  },
  {
    slug: "gold-class",
    experience: "Gold Class",
    title: "Gold Class Cinema in Sri Lanka – Movies & Showtimes | fdfs.lk",
    description: "Find Gold Class cinema listings and published Gold Class movie showtimes in Sri Lanka, with links to book on the cinema's website.",
    h1: "Gold Class cinema in Sri Lanka",
    intro: "See which Sri Lankan cinema lists Gold Class, then check published movie sessions and the cinema's own booking page for seats, prices and availability.",
    showtimeFormat: "Gold Class",
  },
  {
    slug: "directors-lounge",
    experience: "Director's Lounge",
    title: "Director's Lounge Cinema in Sri Lanka – Showtimes | fdfs.lk",
    description: "Find the cinema listing Director's Lounge in Sri Lanka, browse its current movies, and follow the cinema's official booking link.",
    h1: "Director's Lounge cinema in Sri Lanka",
    intro: "Find the Sri Lankan cinema that lists Director's Lounge and browse its currently published movies. Check the cinema's own booking site for session details, seats and prices.",
  },
  {
    slug: "balcony-seating",
    experience: "Balcony Seating",
    title: "Cinema Balcony Seating in Sri Lanka – Kiribathgoda | fdfs.lk",
    description: "Find the Sri Lankan cinema listing balcony seating, see its current movies and showtimes, and check the cinema's own booking page.",
    h1: "Cinema balcony seating in Sri Lanka",
    intro: "Find the cinema listing balcony seating and browse its currently published movies. Follow the venue page to check showtimes and booking details with the cinema.",
  },
] as const satisfies readonly ExperiencePage[];

export function getExperiencePage(slug: string): ExperiencePage | undefined {
  return EXPERIENCE_PAGES.find((page) => page.slug === slug);
}
