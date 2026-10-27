# Data sources

Collected 2026-10-20 to 2026-10-21 (re-run `npm run update-data` to refresh) by `npm run update-data`, plus manual research the same day. All scraping sends a `fdfs.lk-bot` user agent, waits 1 s between requests, and only touches paths allowed by each site's `robots.txt`.

## Scope Cinemas — https://www.scopecinemas.com
- **robots.txt:** allows `/`; disallows `/auth-*`, `/authenticate`, `/qr`, `/ticket`. We read none of those.
- **Theatres** (`/cinemas/<slug>`): Colombo City Centre, Havelock City Mall, Colpetty (Liberty), Kiribathgoda. Address, phone, screens and feature text taken from each page.
- **Movies** (`/movies/now-showing`, `/movies/coming-soon`, `/movies/<slug>`): title, synopsis, director, cast, release date, trailer (YouTube), poster, banner (`…-1500-x-425.jpg`, used as backdrop).
- **Showtimes** (`/movies/<slug>/showtimes`): the page ships every session for all published dates (9 dates on collection day, 517 sessions) inside its server-rendered data (`sessionList`). Fields used: date, time, experience (format), cinema code, movie.
- **Booking URL pattern:** `https://www.scopecinemas.com/movies/<slug>/showtimes` (movie-level; no per-showtime deep link found).
- **Genres and runtime** come from the session data's `movie_data`.

## EAP Films & Theatres (Savoy) — https://eapmovies.com
- **robots.txt:** only content-signal comments, no Disallow rules.
- **Theatres:** `/component/eapmovies/?controller=theaters&view=theaterlist&Itemid=112` (name, city, address, phone). Theatres marked "Temporarily Closed" (Tower Moratuwa, Queens 3D Galle) are excluded.
- **Movies and showtimes:** the booking page's own read-only JSONP calls (`index.php?option=com_eapmovies&controller=buyticket&task=…`): `getMovieList` (every movie with date range, poster, runtime, synopsis, trailer) and `getMovieAllShowTimeList` (theatres and times for a movie and date). One request per movie per date, 1 s apart.
- **Booking URL:** `https://eapmovies.com/component/eapmovies/?controller=buyticket&task=book&cid=<movie id>` (movie-level). A movie with no showtimes in range falls back to a booking link only.
- **Format:** EAP gives none per showtime; it is "3D" when the title says 3D, otherwise "2D".

## PVR Cinemas — https://www.pvrcinemas.lk/
- Theatre details from a third-party listing (https://ten.lk/listings/pvr-cinemas-sri-lanka-premium-multiplex-experience-at-one-galle-face-colombo). The PVR site renders showtimes client-side; **no showtimes collected**.

## Cinema offers
- **Scope:** `https://www.scopecinemas.com/offers` and each `/offers/<slug>` (title, terms, art, last valid day from `to_date`).
- **JP Cineplex:** `https://www.jpcineplex.com/deals` and each `/deals/<slug>` (og:title, og:description, og:image, `valid_to`).
- Expired offers are dropped. Offers are cinema-wide, so they show on every movie and theatre page of that cinema. EAP's offers page was not found.

## Cross-check of directory-only cinemas
- Dialus.lk (`https://dialus.lk/all/list/<District>/theaters`, no robots restrictions) lists far fewer cinemas than the NFC directory (37 entries read). A directory-only cinema is marked `confirmed` when Dialus has the same phone number, or the same town and a shared name word. 11 of 94 matched. The rest are single-source; **none of these sources says whether a cinema is still operating**.

## KCC Multiplex — https://kccmultiplex.lk
- **robots.txt disallows all bots**, so nothing is scraped. Listed as a venue: three screens, Dolby Atmos in screen 1 (from its home page and https://www.ft.lk/lifestyle/KCC-Multiplex-opens-its-door-to-the-public/8-727409), located in Kandy City Centre. Booking: `https://kccmultiplex.lk/buy-tickets/`. No showtimes.

## Lite Cinemas (Movie Works) — https://movieworks.lk
- The site blocks automated requests (HTTP 406), so nothing is scraped. **Aqua Lite 3D (Negombo)** is listed from https://www.sundaytimes.lk/240331/magazine/new-cinema-in-negombo-553341.html (opened 2024, 221 seats). Street address and current operating status **unverified**; no showtimes.

## JP Cineplex (Kandy) — https://www.jpcineplex.com
- **robots.txt:** allows everything except `/admin/`. Next.js site.
- **Movies and showtimes:** home page lists the movie slugs; each `/movies/<slug>` page embeds the movie (synopsis, cast, director, trailer, poster, runtime) and every session (epoch ms start time, screen: Platinum/Gold/Luxe/Silver).
- **Booking URL:** a direct per-showtime link, `https://jpcineplex.com/orders/tickets/<session id>` (the best case: per-showtime).
- **Screens and facilities:** https://www.jpcineplex.com/screens and `/experiences` (Platinum, Gold, Luxe recliners, food served to your seat, couple seats, laser projection, Atmos, 3D). Address No. 377, Peradeniya Road, Kandy; hotline 0710 186 186.

## STR Films theatres via Ticketmaster.lk — https://strfilms.site, https://ticketmaster.lk
- STR Films' site lists 7 theatres: Rajah 1 and 2 (Jaffna), Amutha and Vasanthy (Vavuniya), Shanthi and Suganthi (Batticaloa), Saraswathi (Trincomalee), and sends bookings to Ticketmaster.lk. Neither site has a robots.txt restriction (ticketmaster.lk's returns 404).
- **Showtimes:** each `https://ticketmaster.lk/show/<movie>` page lists dates, theatres and times (`<time datetime>`), server-rendered. Booking URL: that show page (movie-level). Only the movies currently listed there are covered (one title on collection day: Jailer 2, at Rajah 1, Suganthi and Amutha).
- **Addresses and phones** for these seven come from the dialus.lk directory (Rajah: Kasturiyar Road, Jaffna; Vasanthi: 40 Kandy Road, Vavuniya; Shanthi: Kallady) and are **unverified**; blanks are unknown.

## National Film Corporation cinema directory — https://nfc.gov.lk/cinemas/
- Government directory of cinema halls (170 screens in 24 districts) embedded in the page as a data array: name, district, town, projection (2K/4K/IMAX/35mm/E-Cinema), A/C, category (Multiplex), phone. robots.txt allows the page.
- Screens are grouped into venues and matched against theatres we already list from their own sites (no duplicates). The rest are added as **directory-only** theatres with no showtimes: the page says to call. City is the district; the town is in the address.
- The directory is not dated: some halls may have closed. Each such theatre page says "Confirm opening before you go".

## TakTikBook — https://www.taktikbook.lk
- Online ticketing portal for regional cinemas. Its theatre pages (`/theater/<slug>`, robots: none) give address, phone and an online-booking flag, used to fill in Regent (Rambukkana), Milano and Tarzan (Kegalle). Booking link: the theatre's TakTikBook page.
- Its now-showing list matched ours (including a new Sinhala film, "Dinga", not yet in our data).
- **Showtimes not used:** they come from `/api/v1/ajax/get-show-times`, which returned HTTP 500 without a browser session. Not worked around.

## Checked and not used
- **BookMyShow Sri Lanka** (lk.bookmyshow.com): blocks scripted requests (Cloudflare 403). Not scraped.
- **lankainformation.lk** now-showing listing: allows crawling but is stale (shows late-2024 films such as Wicked and Gladiator II).
- **litecinemas.lk** (Lite Cinemas, 13 sites): a single-page app whose data comes from a private backend with an embedded key. Not called. Lite venues appear only as directory entries.
- **mytickets.lk** (ticket marketplace) and **pvrcinemas.lk**: render listings client-side; no readable showtimes.
- **kccmultiplex.lk:** robots.txt disallows all bots.
- **Ceylon Theatres / Regal / Majestic Cineplex** (https://ceylontheatres.com): site is stale (© 2022, 2019 movies, WordPress 6.1). Current operating status of the Regal theatres (Colombo, Dematagoda, Gampaha, Nuwara Eliya, Jaffna, Katubedda, Bandarawela) is unverified, so they are not listed. EAP's list shows "Majestic – Platinum" in its showtime selector; not confirmed as a current EAP venue.

## Unverified or empty fields
- `certificate`: Scope publishes no ratings (`rating: null`); empty everywhere.
- `language`: Scope labels non-English titles in brackets, e.g. "(SINHALA)". Unlabelled titles are set to English; check Hindi/other titles by hand.
- `mapsUrl`: Google Maps **search** links built from the theatre name and city, not place IDs.
- Theatre `experiences` (the badges): from Scope's cinema pages and its session data (Dolby Atmos, Gold Class, IMAX, 3D screens, Director's Lounge, balcony seats) and from theatre names for EAP/PVR. Colpetty has no premium features listed.
- EAP-only movies have no genres, cast, director, release date or backdrop.
- Neera, Sinhabahu, Mother Lanka and Udeshi City film halls: no cinema with those names was found.
- Jaffna, Galle, Batticaloa, Trincomalee, Negombo: no verified operating cinema with a public booking source was found, so none are listed.

## BookMyShow Sri Lanka (showtimes and prices)

`data/raw/bookmyshow.txt` is a snapshot of lk.bookmyshow.com movie pages (`/buytickets/<movie>-sri-lanka/movie-snlk-<ET id>-MT/<yyyymmdd>`), one page per movie and date. The site blocks scripted requests, so the pages were loaded in a normal browser session and each session's venue, time and ticket-price categories were copied into the snapshot. `scripts/scrapers/bookmyshow.ts` turns it into showtimes (lowest price per session) for theatres that have none from their own site, and creates the seven theatres we were missing. Re-apply with `npx tsx scripts/apply-bms.ts`. Refresh by re-collecting the snapshot; it goes stale after 2026-10-29.

The nine movies only BookMyShow lists (Ayu, Dinga, Drishyam: The Conclusion, Angel And The Badman, Udta Teer, Porattam, Anbil Avan, Ethalaya, Villain) are defined in `EXTRA_MOVIES` in `scripts/scrapers/bookmyshow.ts` from each movie's BookMyShow page (genre, language, release date, cast, director; synopsis written by us). Posters come from the same pages and are saved as WebP in `public/images/posters`. No runtimes or trailers are published there.
