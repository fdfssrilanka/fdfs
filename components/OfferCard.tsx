"use client";
import Image from "next/image";
import { Gift } from "lucide-react";
import type { Offer } from "@/lib/types";
import TrackedLink from "./TrackedLink";

/** Special offer card: artwork at the left, a blue "Special Offer" tag at the top right. */
export default function OfferCard({ offer, cinemaName }: { offer: Offer; cinemaName?: string }) {
  return (
    <TrackedLink
      href={offer.url}
      track={{ kind: "offer", cinemaId: offer.cinemaId }}
      className="group relative flex h-full min-h-[8.5rem] overflow-hidden rounded-xl bg-surface-2 hover:brightness-110"
    >
      <span className="relative block w-28 shrink-0 bg-black sm:w-32">
        {offer.imageUrl ? (
          <Image src={offer.imageUrl} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-utility"><Gift className="size-10" aria-hidden /></span>
        )}
      </span>
      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-utility px-2 py-1 text-xs font-bold text-white">
        <Gift className="size-3.5" aria-hidden /> Special Offer
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 pb-4 pt-10">
        <span className="font-bold leading-snug text-white">{offer.title}</span>
        <span className="line-clamp-3 text-sm leading-snug text-warm">{offer.description}</span>
        {cinemaName && <span className="mt-1 text-xs text-muted">{cinemaName}{offer.validTo ? ` · until ${offer.validTo}` : ""}</span>}
      </span>
    </TrackedLink>
  );
}
