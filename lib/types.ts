export type Language = "Tamil" | "Sinhala" | "English" | "Hindi" | "Other";
export type Format = "2D" | "3D" | "IMAX" | "Gold Class" | "Dolby Atmos" | "Director's Lounge" | "Balcony";

export interface Movie {
  id: string;
  slug: string;
  title: string;
  language: Language | string;
  genres: string[];
  runtimeMin: number | null;
  certificate: string;
  releaseDate: string;
  status: "now_showing" | "coming_soon";
  featured: boolean;
  synopsis: string;
  cast: string[];
  director: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
}

export interface Cinema {
  id: string;
  name: string;
  website: string;
  bookingSite: string;
}

export interface Theatre {
  id: string;
  cinemaId: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  mapsUrl: string;
  formats: string[];
  experiences: string[];
  phone: string;
  /** Town or suburb the theatre is in, when different from its city/region (used for town pages). */
  town?: string;
  /** e.g. "3 screens · A/C · 2K digital" */
  details?: string;
  /** "nfc": listed in the National Film Corporation directory only; no online showtimes. */
  source?: "nfc";
  /** True when a second independent directory lists the same cinema with a matching phone number or name and town. */
  confirmed?: boolean;
  /** Where tickets for this theatre can be booked online, when it has an online booking page. */
  bookingUrl?: string;
}

export interface Showtime {
  movieId: string;
  theatreId: string;
  date: string;
  time: string;
  format: string;
  bookingUrl: string;
}

/** Movie playing at a chain whose showtimes we cannot read: a link to its own booking page instead. */
export interface Listing {
  movieId: string;
  cinemaId: string;
  bookingUrl: string;
}

/** A promotion a cinema publishes on its own site (cinema-wide unless movieId is set). */
export interface Offer {
  id: string;
  cinemaId: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  /** Last valid day (YYYY-MM-DD), empty if the cinema gives none. */
  validTo: string;
  movieId?: string;
}
