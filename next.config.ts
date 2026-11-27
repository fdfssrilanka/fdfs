import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Posters are already downloaded at the sizes we use; skip the image optimizer so it runs on Cloudflare Workers.
  images: { unoptimized: true },
  // Cinemas that were once listed twice under two spellings: the old address goes to the page that stayed.
  redirects: async () =>
    [
      ["ruoo-cinema-katunayake", "roo-katunayake"],
      ["ck-cinema-kirindiwela", "c-k-kirindiwela"],
      ["sk-cinema-matara", "s-k-matara"],
      ["tarzen-cinema-kegalle", "tarzan-kegalle"],
      // Second screen of the Savoy building; eapmovies.com now lists the building as one hall.
      ["savoy-2-wellawatte", "savoy-3d-dolby-atmos-wellawatte"],
    ]
      .map(([from, to]) => ({ source: `/theatres/${from}`, destination: `/theatres/${to}`, permanent: true }))
      // Halls EAP stopped listing when its site relaunched (November 2026); they remain as directory entries.
      .concat([
        { source: "/theatres/savoy-premiere-roxy-cinema-wellawatte", destination: "/theatres/savoy-premier", permanent: true },
        { source: "/theatres/samantha-2d-dematagoda", destination: "/theatres/samantha-dematagoda", permanent: true },
        // Movies whose cinema changed the page name for the same film.
        { source: "/movies/the-hunger-games-sunrise-on-the-reaping", destination: "/movies/the-hunger-games-sunrise-on-the-reaping-1", permanent: false },
        { source: "/movies/jailer-2-tamil", destination: "/movies/jailer-2", permanent: false },
        { source: "/movies/agnijaya-sinhala", destination: "/movies/agini-jaya-2d-sinhala-eap", permanent: false },
      ]),
  // Lets a phone on the same Wi-Fi load the dev server (dev only).
  allowedDevOrigins: ["192.168.4.36", "*.local"],
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
