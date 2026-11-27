import { getMoviesAtTheatre, getTheatres } from "./data";
import type { Movie, Theatre } from "./types";

/** Cinema chains people search for by brand name ("savoy cinema", "lite cinemas", "regal cinema"). One page per chain. */
export interface Chain {
  slug: string;
  name: string;
  title: string;
  h1: string;
  intro: string;
  /** Other names people use for the brand, shown on the page. */
  aka: string[];
  match: (t: Theatre) => boolean;
}

export const CHAINS: Chain[] = [
  {
    slug: "scope-cinemas",
    name: "Scope Cinemas",
    title: "Scope Cinemas Sri Lanka – Locations, Movies Today & Showtimes",
    h1: "Scope Cinemas in Sri Lanka",
    intro: "Every Scope Cinemas and Liberty by Scope location, with the movies showing today, showtimes by cinema and links to book on scopecinemas.com.",
    aka: ["Scope Cinema", "Liberty Cinemas", "Liberty by Scope Cinemas", "Scope Cinemas Colombo"],
    match: (t) => t.cinemaId === "scope",
  },
  {
    slug: "savoy-cinemas",
    name: "Savoy and EAP cinemas",
    title: "Savoy Cinemas & EAP Theatres – Locations, Movies Today & Showtimes",
    h1: "Savoy cinemas and EAP theatres",
    intro: "Savoy cinemas and the other EAP Films & Theatres halls across Sri Lanka, with the movies showing today, showtimes and links to book on eapmovies.com.",
    aka: ["Savoy Cinema", "Savoy 3D", "Savoy Premier", "Savoy Metro", "EAP Films & Theatres", "EAP movies"],
    match: (t) => t.cinemaId === "eap",
  },
  {
    slug: "lite-cinemas",
    name: "Lite Cinemas",
    title: "Lite Cinemas Sri Lanka – All Locations, Movies & Showtimes",
    h1: "Lite Cinemas in Sri Lanka",
    intro: "Every Lite Cinemas hall in Sri Lanka by town, with addresses, 3D and sound formats, and showtimes where they are published.",
    aka: ["Lite Cinema", "Movie Works", "Lite 3D cinema"],
    match: (t) => t.cinemaId === "lite" || /\blite\b/i.test(t.name),
  },
  {
    slug: "regal-cinemas",
    name: "Regal cinemas",
    title: "Regal Cinemas Sri Lanka – Locations, Movies & Showtimes",
    h1: "Regal cinemas in Sri Lanka",
    intro: "Cinemas trading under the Regal name in Sri Lanka, by town, with addresses, phone numbers and showtimes where they are published.",
    aka: ["Regal Cinema", "Regal theatre", "Regal film hall"],
    match: (t) => /\bregal\b/i.test(t.name),
  },
  {
    slug: "str-films-theatres",
    name: "STR Films theatres",
    title: "STR Films Theatres – Cinemas in Jaffna, Vavuniya, Batticaloa & Trincomalee",
    h1: "STR Films theatres",
    intro: "The STR Films cinemas in Jaffna, Vavuniya, Batticaloa and Trincomalee, with the movies showing, showtimes and ticket booking on ticketmaster.lk.",
    aka: ["STR Films", "Rajah Cinema", "Ticketmaster.lk cinemas"],
    match: (t) => t.cinemaId === "str",
  },
];

export const getChainTheatres = (c: Chain) => getTheatres().filter(c.match);
/** Chains with at least two listed theatres; a one-hall "chain" is just that hall's own page. */
export const getChains = () => CHAINS.filter((c) => getChainTheatres(c).length >= 2);
export const getChain = (slug: string) => getChains().find((c) => c.slug === slug);
export const getChainForTheatre = (t: Theatre) => getChains().find((c) => c.match(t));
export const getChainMovies = (c: Chain): Movie[] => [...new Map(getChainTheatres(c).flatMap((t) => getMoviesAtTheatre(t.id)).map((m) => [m.id, m])).values()];
