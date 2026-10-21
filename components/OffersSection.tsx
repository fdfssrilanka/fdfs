import { getCinema } from "@/lib/data";
import type { Offer } from "@/lib/types";
import Carousel from "./Carousel";
import OfferCard from "./OfferCard";

/** Special offers as a scrolling row of cards (arrow on the right when there are more than fit). */
export default function OffersSection({ offers, title = "Special offers", limit = 8, bare = true, className = "" }: { offers: Offer[]; title?: string; limit?: number; bare?: boolean; className?: string }) {
  if (!offers.length) return null;
  const row = (
    <Carousel title={title} href="/offers" linkLabel="See all offers" slideClass="basis-[90%] sm:basis-[62%] lg:basis-[44%]" arrowTop="top-[38%]" bare={bare}>
      {offers.slice(0, limit).map((o) => (
        <OfferCard key={o.id} offer={o} cinemaName={getCinema(o.cinemaId)?.name} />
      ))}
    </Carousel>
  );
  return className ? <div className={className}>{row}</div> : row;
}
