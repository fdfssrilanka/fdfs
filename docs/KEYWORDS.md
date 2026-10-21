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
| colombo city centre cinema, ccc movies today, movies at ccc | `/theatres/scope-cinemas-colombo-city-centre` | title ("Scope Cinemas CCC"), H2 "Movies at CCC today", FAQ |
| havelock city mall cinema ticket booking, movies havelock | `/theatres/scope-cinemas-havelock-city-mall` | title, H2, FAQ |
| liberty cinemas, liberty movies | `/theatres/scope-cinemas-colpetty`, `/theatres/liberty-by-scope-cinemas-kiribathgoda` | name, title, H2 |
| pvr colombo, movies pvr | `/theatres/pvr-cinemas-one-galle-face` | title, H2 |
| savoy cinema, movies in savoy | `/theatres/savoy-*` (EAP) | title, H2 |
| kcc multiplex | `/theatres/kcc-multiplex-kandy` | listed, no showtimes |
| aqua lite 3d cinema, lite cinemas | `/theatres/aqua-lite-3d-negombo` | listed, no showtimes |
| [movie] tickets / ticket price / in sri lanka / showtimes / cinema | `/movies/[slug]` | title, description, FAQ, hidden H2 |

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
