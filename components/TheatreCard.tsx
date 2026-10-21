import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Theatre } from "@/lib/types";
import { BadgeRow } from "./ExperienceBadge";
import { getOffersForCinemas, hasShowtimes } from "@/lib/data";
import HeartButton from "./HeartButton";
import OfferTag from "./OfferTag";

export default function TheatreCard({ theatre, chain, className = "", distanceKm }: { theatre: Theatre; chain?: string; className?: string; distanceKm?: number | null }) {
  return (
    <div className={`relative h-full ${className}`}>
      <Link href={`/theatres/${theatre.slug}`} className="flex h-full flex-col rounded-2xl border border-line bg-surface p-4 pr-14 hover:border-accent">
        <div className="flex items-center justify-between gap-2">
          {chain && <span className="text-xs font-bold uppercase tracking-wider text-accent">{chain}</span>}
          {distanceKm != null && <span className="text-xs text-muted">{distanceKm < 2 ? "Nearby" : `~${distanceKm} km`}</span>}
        </div>
        <h3 className="mt-1 text-base font-extrabold leading-snug">{theatre.name}</h3>
        {getOffersForCinemas([theatre.cinemaId]).length > 0 && <span className="mt-2 inline-flex"><OfferTag plain /></span>}
        {hasShowtimes(theatre.id) && (
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-green"><span className="size-2 rounded-full bg-green" aria-hidden /> Showtimes online</p>
        )}
        <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" /> <span>{theatre.address || theatre.city}</span>
        </p>
        {theatre.specs && theatre.specs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">{theatre.specs.map((s) => <span key={s} className="rounded border border-line px-2 py-0.5 text-xs font-bold text-ink/85">{s}</span>)}</div>
        )}
        {theatre.experiences.length > 0 && (
          <div className="mt-3">
            <BadgeRow names={theatre.experiences} size="sm" />
          </div>
        )}
      </Link>
      <HeartButton id={theatre.id} name={theatre.name} className="absolute right-1 top-1" />
    </div>
  );
}
