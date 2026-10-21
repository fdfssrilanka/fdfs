import type { Cinema, Theatre } from "../../lib/types";

/**
 * Venues we list but do not scrape: KCC's robots.txt disallows all bots and movieworks.lk blocks automated requests.
 * Each links to the cinema's own booking site instead of showing times.
 */
export const cinemas: Cinema[] = [
  { id: "kcc", name: "KCC Multiplex", website: "https://kccmultiplex.lk", bookingSite: "https://kccmultiplex.lk/buy-tickets/" },
  { id: "ceylon", name: "Ceylon Theatres (Majestic Cineplex)", website: "https://ceylontheatres.com", bookingSite: "https://www.facebook.com/MCJaffna/" },
  { id: "chelva", name: "Chelva Cinema", website: "https://www.facebook.com/p/Jaffna-CHELVA-Cinema-100070118809248/", bookingSite: "https://www.facebook.com/p/Jaffna-CHELVA-Cinema-100070118809248/" },
  { id: "vijaya", name: "Vijaya Cinema", website: "https://www.facebook.com/vijjayacinema/", bookingSite: "https://www.facebook.com/vijjayacinema/" },
  { id: "lite", name: "Lite Cinemas (Movie Works)", website: "https://movieworks.lk", bookingSite: "https://movieworks.lk" },
];

export const theatres: Theatre[] = [
  {
    id: "kcc-multiplex", cinemaId: "kcc", slug: "kcc-multiplex-kandy", name: "KCC Multiplex", city: "Kandy",
    address: "Kandy City Centre, Sri Wickrama Rajasinghe Mawatha, Kandy",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=KCC+Multiplex+Kandy+City+Centre",
    formats: ["2D", "Dolby Atmos"], experiences: ["Dolby Atmos", "4K", "Laser", "Multiplex"], phone: "",
  },
  {
    id: "ceylon-majestic-jaffna", cinemaId: "ceylon", slug: "majestic-cineplex-jaffna", name: "Majestic Cineplex Jaffna", city: "Jaffna",
    address: "Cargills Square, Hospital Road, Jaffna", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Majestic+Cineplex+Cargills+Square+Jaffna",
    formats: ["2D"], experiences: ["Platinum", "Multiplex"], phone: "+94212227712",
  },
  {
    id: "chelva-jaffna", cinemaId: "chelva", slug: "chelva-cinema-jaffna", name: "Chelva Cinema", city: "Jaffna",
    address: "Hospital Road, Jaffna", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Chelva+Cinema+Hospital+Road+Jaffna",
    formats: ["2D"], experiences: [], phone: "+94212227973",
  },
  {
    id: "vijaya-batticaloa", cinemaId: "vijaya", slug: "vijaya-cinema-batticaloa", name: "Vijaya Cinema", city: "Batticaloa",
    address: "60 Loyds Avenue, Batticaloa", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vijaya+Cinema+Loyds+Avenue+Batticaloa",
    formats: ["2D"], experiences: [], phone: "+94701503677",
  },
  {
    id: "lite-aqua-negombo", cinemaId: "lite", slug: "aqua-lite-3d-negombo", name: "Aqua Lite 3D Cinema", city: "Negombo",
    address: "",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aqua+Lite+Cinema+Negombo",
    formats: ["2D", "3D"], experiences: ["3D"], phone: "",
  },
];
