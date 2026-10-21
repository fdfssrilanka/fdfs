import type { Metadata, Viewport } from "next";
import { Figtree, League_Gothic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AdBanner from "@/components/AdBanner";
import CityProvider from "@/components/CityProvider";
import FavoritesProvider from "@/components/FavoritesProvider";
import Footer from "@/components/Footer";
import Header, { type SearchItem } from "@/components/Header";
import { getCities, getMovies, getTheatres } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// Free stand-ins for the Proxima Nova body face and Alternate Gothic condensed headlines.
const sans = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-figtree", display: "swap" });
const display = League_Gothic({ subsets: ["latin"], variable: "--font-league", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "fdfs.lk – Movie Showtimes in Sri Lanka | Book Cinema Tickets",
  description: "Find every cinema showing your movie in Sri Lanka. Compare showtimes for Tamil, Sinhala, English and Hindi films and jump straight to the cinema's own booking page.",
  openGraph: { siteName: "fdfs.lk", type: "website", locale: "en_LK" },
  twitter: { card: "summary_large_image" },
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
