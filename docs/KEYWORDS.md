# Keyword map

Which page targets which search phrases. Titles, H1s, intro copy, FAQs and JSON-LD use these naturally; there is no keyword meta tag (search engines ignore it).

| Keywords | Page | Where used |
|---|---|---|
| now showing movies sri lanka, movie now showing, movies today, today movies, movie today, movie showtimes, movie times | `/movies` | title, H1, intro |
| movie showtimes, new movies in sri lanka, sri lankan movie theaters, cinema colombo sri lanka, cinemas near me, movie theater near me, films showing near me | `/` | title, hidden H1, SEO text, FAQ, "Use my location" |
| tamil movies sri lanka, tamil movies showing colombo | `/language/tamil` | title, H1 |
| sinhala new film | `/language/sinhala` | title, H1 |
| english movies sri lanka | `/language/english` | title, H1 |
| new and upcoming movies, new release movie, films new | `/coming-soon` | title, H1, intro |
| cinema hall, city cinema, cinema city | `/theatres`, `/cities/[slug]` | title, H1, intro |
| book movie tickets (online), movie ticket booking (online), film ticket booking sri lanka | `/book-movie-tickets` | title, H1, steps, FAQ |
| imax cinema, imax movie theater | `/imax` | title, H1, FAQ |
| Dolby Atmos cinema Sri Lanka, Dolby Atmos movie showtimes | `/experiences/dolby-atmos` | title, H1, verified cinema and showtime listings |
| 3D cinemas Sri Lanka, 3D movies and showtimes | `/experiences/3d-cinemas` | title, H1, 3D cinema and session listings |
| Gold Class cinema Sri Lanka, Gold Class movie showtimes | `/experiences/gold-class` | title, H1, verified venue and matching sessions |
| Director's Lounge cinema Sri Lanka | `/experiences/directors-lounge` | title, H1, verified venue and its current movie listings |
| cinema balcony seating Sri Lanka, Kiribathgoda cinema | `/experiences/balcony-seating` | title, H1, verified venue and its current movie listings |
| premium cinema experiences Sri Lanka, cinema formats | `/experiences` | title, H1, links to verified experience pages |
| colombo city centre cinema, ccc movies today, movies at ccc | `/theatres/scope-cinemas-colombo-city-centre` | title ("Scope Cinemas CCC"), H2 "Movies at CCC today", FAQ |
| havelock city mall cinema ticket booking, movies havelock | `/theatres/scope-cinemas-havelock-city-mall` | title, H2, FAQ |
| liberty cinemas, liberty movies | `/theatres/scope-cinemas-colpetty`, `/theatres/liberty-by-scope-cinemas-kiribathgoda` | name, title, H2 |
| pvr colombo, movies pvr | `/theatres/pvr-cinemas-one-galle-face` | title, H2 |
| savoy cinema, movies in savoy | `/theatres/savoy-*` (EAP) | title, H2 |
| kcc multiplex | `/theatres/kcc-multiplex-kandy` | listed, no showtimes |
| aqua lite 3d cinema, lite cinemas | `/theatres/aqua-lite-3d-negombo` | listed, no showtimes |
| [movie] tickets / ticket price / in sri lanka / showtimes / cinema | `/movies/[slug]` | title, description, FAQ, hidden H2 |

## Scope Cinemas competitor crawl (2026-10-26)
Reviewed the public `scopecinemas.com` robots file, sitemap and crawlable page content. The sitemap covers the homepage; about, advertising, careers, contact and policy pages; movie listings (now showing, coming soon, Scope exclusives and individual films); four cinema pages; seven experience pages; offers; food and beverage; gift cards; and Scope Privilege.

Keyword themes observed on those public pages:
- **Movies and bookings:** movies now showing, movies coming soon, exclusive movies, movie showtimes, movie tickets, cinema booking.
- **Locations:** Scope Cinemas, Colombo City Centre cinema, Havelock City Mall cinema, Liberty Cinema Colpetty, Liberty Cinema Kiribathgoda; movies and ticket booking at each location.
- **Formats and seating:** IMAX with Laser, Dolby Atmos, Director's Lounge, Gold Class, balcony seating, digital 2D and digital 3D.
- **Other cinema products:** cinema food and beverage, snacks, popcorn, e-gift cards, physical gift cards, Scope Privilege, rewards points, discounts, merchant deals, events and movie premieres.
- **Business and support:** advertising at cinemas, cinema careers, contact, about, privacy, terms and disclaimer.

fdfs covers the competitor topics it can substantiate with independent listings: movies and booking links, the four Scope/Liberty venues, IMAX, Dolby Atmos, 3D, Gold Class, Director's Lounge, balcony seating, and cinema offers. The experience landing pages under `/experiences` are built from fdfs theatre/showtime data, not copied Scope content.

Gift cards, Scope Privilege/member rewards, and food menus are not fdfs services and are not represented in its data, so no duplicate product pages were created. The crawl shows the competitor's own content/topics, not its complete ranking-keyword set or search volumes; those require a keyword-platform export or Search Console data.

## Cities
Every district with a cinema has a page, `/cities/<district>`, e.g. Jaffna, Vavuniya, Batticaloa, Trincomalee, Kandy, Galle, Matara, Kurunegala. Their titles use "Cinemas in {city}: movies showing today & showtimes".

## Not covered (no verifiable venue)
`neera film hall`, `sinhabahu film hall`, `mother lanka film hall`, `udeshi city film hall`: searches found films with those names, not cinemas. Send an address or website and they can be added in `scripts/scrapers/other.ts`.

## Notes
- **Ticket price:** cinemas don't publish prices in the data we read, so movie FAQs say prices vary by cinema and format. Nothing is invented.
- **"near me":** handled by location detection (edge IP lookup, or the browser on request) plus the city picker, not by static copy alone.

## Coverage check against an Ubersuggest export (Scope Cinemas' ranking keywords, 402 unique, ~816,000 searches a month)
| Bucket | Keywords | Monthly searches | Status |
|---|---|---|---|
| Generic discovery (movies today, now showing, near me, book tickets, IMAX, coming soon, languages) | 73 | ~106,000 | Pages exist |
| Named theatre we have a page for (Scope, Liberty, Savoy, PVR, Ram, KCC, Regal, Ritz...) | 151 | ~570,000 | Pages exist; spelling variants added as "Also searched as" |
| Town or area ("film hall Kiribathgoda", "Dehiwala film hall"...) | 62 | ~66,000 | **New:** `/areas/<town>` pages for every town with a listed theatre |
| Town or venue not in our data (Nugegoda, Kottawa, Dankotuwa, Neera, Imperial...) | 46 | ~30,000 | Not buildable: no verified cinema to list |
| Movie titles we don't list (Zootopia 2, Avatar 3, Michael, Jana Nayagan...) | 38 | ~10,000 | Pages appear when a cinema lists the movie |
| Not ours (competitor brands such as BookMyShow, lyrics, piracy) | 32 | ~34,000 | Skipped on purpose |

Modifiers no page serves yet: ticket price (~3,800 searches; cinemas don't publish prices in the data we read), photos (~870), contact (~550, phone numbers are shown), reviews (~180).
