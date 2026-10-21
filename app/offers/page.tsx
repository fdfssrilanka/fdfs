import type { Metadata } from "next";
import OfferCard from "@/components/OfferCard";
import PageIntro from "@/components/PageIntro";
import { getCinema, getOffers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cinema Offers & Discounts in Sri Lanka – Movie Ticket Deals | fdfs.lk",
  description: "Current movie ticket offers and discounts from Sri Lankan cinemas: student days, ladies' nights, card offers and food and beverage deals.",
  alternates: { canonical: "/offers" },
};

export default function OffersPage() {
  const offers = getOffers();
  const cinemaIds = [...new Set(offers.map((o) => o.cinemaId))];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="Special offers">Current promotions published by the cinemas. Terms, dates and how to redeem are on each cinema&apos;s own offer page.</PageIntro>
      {offers.length === 0 && <p className="text-muted">No offers are published right now.</p>}
      {cinemaIds.map((id) => (
        <section key={id} className="mb-10">
          <h2 className="mb-3 text-xl font-extrabold">{getCinema(id)?.name}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {offers.filter((o) => o.cinemaId === id).map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
