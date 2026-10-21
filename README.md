# fdfs.lk

Sri Lanka movie showtimes. Pick a movie, see every theatre playing it, and jump to the cinema's own booking page.

Next.js (App Router) · TypeScript · Tailwind CSS 4 · Lucide · Embla Carousel · Cloudflare via `@opennextjs/cloudflare`.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static generation of every page
```

## Data

All data is JSON in `data/`, read only through `lib/data.ts`, so a database can replace it later.

| File | Contents |
|---|---|
| `movies.json` | movies (posters/backdrops are downloaded to `public/images`) |
| `cinemas.json` | chains and their booking sites |
| `theatres.json` | theatres, with `experiences` shown as badges |
| `showtimes.json` | per movie, theatre, date, time, format, booking URL |
| `listings.json` | movie-level booking links for chains whose showtimes can't be read |
| `SOURCES.md` | every source, booking URL patterns, unverified fields |

### Refresh

```bash
npm run update-data
```

Runs the scrapers in `scripts/scrapers/` (Scope, JP Cineplex, EAP and Ticketmaster.lk give real showtimes; `offers.ts` collects cinema promotions; `dialus.ts` cross-checks the directory-only cinemas; the NFC directory and TakTikBook add venues and contact details; PVR and a few others are static entries), merges movies that several sites list, downloads new images and rewrites the JSON. Then rebuild and deploy. Scope's pages publish about 9 days ahead, so refresh at least every few days.

To add a cinema, write a scraper in `scripts/scrapers/<chain>.ts` returning `cinema`, `theatres`, `movies` and `showtimes` (or `listings`), and register it in `scripts/update-data.ts`. Read `robots.txt` first, keep the 1 s delay in `scripts/lib/http.ts`.

## Deploy to Cloudflare

```bash
npx wrangler login
npm run preview    # build with OpenNext and run locally in workerd
npm run deploy     # build and deploy the Worker
```

Then add the custom domain `fdfs.lk` under Workers & Pages → fdfs-lk → Settings → Domains. Config lives in `wrangler.jsonc` and `open-next.config.ts`. Images are served unoptimized (`next.config.ts`) because they're already sized.

## Location

On a visitor's first visit, `/api/location` returns Cloudflare's coarse IP location (country, lat/lng); if it is in Sri Lanka the nearest city with cinemas is selected and theatres are sorted by approximate distance. "Use my location" asks the browser for precise GPS. Nothing is stored server-side. City coordinates are approximate town centres in `lib/geo.ts`. In `npm run dev` the lookup reflects your real location.

## Click tracking

Every outbound booking link (showtime pills, "Book tickets", other-cinema and booking-guide links) records a click through `components/TrackedLink.tsx` → `POST /api/click` → Cloudflare Workers Analytics Engine (binding `CLICKS`, dataset `fdfs_clicks`, set in `wrangler.jsonc`). No cookies, IPs or user ids are stored. Locally, clicks are accepted and the dataset write is a no-op.

Blobs, in order: kind, movieId, theatreId, cinemaId, destination host, format, date, time, page, country. Example query (Cloudflare API → Analytics Engine SQL):

```sql
SELECT blob2 AS movie, blob5 AS cinema_site, SUM(_sample_interval) AS clicks
FROM fdfs_clicks
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY movie, cinema_site ORDER BY clicks DESC
```

Enable Analytics Engine for the account in the Cloudflare dashboard before the first deploy.

## Ads

A Google AdSense leaderboard sits above the header on every page (`components/AdBanner.tsx`). Copy `.env.example` to `.env.local` (and set the same two variables in Cloudflare's build settings), filling in your publisher ID (`ca-pub-…`) and the slot IDs of your two ad units (top banner and the 300×250 square). `/ads.txt` is generated from the publisher ID. With the variables empty, a labelled "Sample ad" placeholder (728×90) is shown in its place, in dev and production.

Before launch: if you expect visitors from the EEA, UK or Switzerland, add a Google-certified consent banner (AdSense's Privacy & messaging tool) and update the privacy note on `/about`.

## Notes

- UI strings are in `lib/i18n.ts`, ready for Sinhala/Tamil dictionaries.
- Times are compared in Asia/Colombo; past times grey out in the browser and past dates drop off the date strip.
