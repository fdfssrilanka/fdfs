import type { Cinema, Theatre } from "../../lib/types";

export const cinema: Cinema = {
  id: "pvr",
  name: "PVR Cinemas",
  website: "https://www.pvrcinemas.lk/",
  bookingSite: "https://www.pvrcinemas.lk/",
};

/** Theatre only: pvrcinemas.lk renders showtimes client-side, so there is no scraper for its sessions yet. */
export const theatres: Theatre[] = [
  {
    id: "pvr-ogf", cinemaId: "pvr", slug: "pvr-cinemas-one-galle-face", name: "PVR Cinemas - One Galle Face", city: "Colombo",
    address: "Level 06, 1A Centre Road, Colombo 00200", mapsUrl: "https://www.google.com/maps/search/?api=1&query=PVR+Cinemas+One+Galle+Face+Colombo",
    formats: ["2D", "3D", "IMAX", "Dolby Atmos"], experiences: ["IMAX", "Dolby Atmos", "3D", "Luxe"], phone: "",
  },
];
