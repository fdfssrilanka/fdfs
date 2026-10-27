import type { Metadata, Viewport } from "next";
import { Figtree, League_Gothic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AdBanner from "@/components/AdBanner";
import CityProvider from "@/components/CityProvider";
import FavoritesProvider from "@/components/FavoritesProvider";
import Footer from "@/components/Footer";
import Header, { type SearchItem } from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { getCities, getMovies, getTheatres } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// Free stand-ins for the Proxima Nova body face and Alternate Gothic condensed headlines.
const sans = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-figtree", display: "swap" });
const display = League_Gothic({ subsets: ["latin"], variable: "--font-league", display: "swap" });
const siteDescription = "Find movie showtimes across Sri Lanka, compare cinemas and languages, and book directly on each cinema's own website.";
const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "fdfs.lk",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "fdfs.lk",
      url: SITE_URL,
      description: siteDescription,
      inLanguage: "en-LK",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "fdfs.lk – Movie Showtimes in Sri Lanka | Book Cinema Tickets",
  description: siteDescription,
  openGraph: {
    siteName: "fdfs.lk",
    title: "fdfs.lk – Movie Showtimes in Sri Lanka",
    description: siteDescription,
    url: SITE_URL,
    type: "website",
    locale: "en_LK",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "fdfs.lk movie showtimes in Sri Lanka" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "fdfs.lk – Movie Showtimes in Sri Lanka",
    description: siteDescription,
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = { themeColor: "#0b0b10" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const items: SearchItem[] = [
    ...getMovies().map((m) => ({ type: "Movie" as const, title: m.title, sub: m.language, href: `/movies/${m.slug}` })),
    ...getTheatres().map((x) => ({ type: "Theatre" as const, title: x.name, sub: x.city, href: `/theatres/${x.slug}` })),
  ];
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh antialiased">
        <JsonLd data={siteStructuredData} />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <Script async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`} />
        )}
        <CityProvider>
          <FavoritesProvider>
          <AdBanner />
          {/* Boxed layout: lighter page background at the sides, darker content column in the middle. */}
          <div className="mx-auto min-h-dvh w-full max-w-[1320px] bg-bg shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            <Header items={items} cities={getCities().map((c) => c.name)} />
            <main>{children}</main>
            <Footer />
          </div>
          </FavoritesProvider>
        </CityProvider>
      </body>
    </html>
  );
}
