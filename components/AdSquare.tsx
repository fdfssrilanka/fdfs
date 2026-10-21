"use client";
import { Megaphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SQUARE;

/** Medium rectangle (300×250) for the empty right-hand column on wide screens. Height is fixed so the ad can't shift the page. */
export default function AdSquare() {
  const pathname = usePathname();
  const live = Boolean(CLIENT && SLOT);

  useEffect(() => {
    if (!live) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [live, pathname]);

  return (
    <aside aria-label="Advertisement" className="hidden lg:block">
      <div className="sticky top-24">
        <span className="mb-1 block text-center text-[10px] uppercase tracking-widest text-muted">Advertisement</span>
        {live ? (
          <ins key={pathname} className="adsbygoogle" style={{ display: "inline-block", width: "300px", height: "250px" }} data-ad-client={CLIENT} data-ad-slot={SLOT} />
        ) : (
          <div className="relative flex h-[250px] w-[300px] flex-col items-center justify-center gap-3 overflow-hidden rounded-sm border border-line bg-gradient-to-b from-[#3a1a00] to-[#121212] p-5 text-center">
            <span className="absolute right-1 top-1 rounded bg-black/60 px-1 text-[9px] font-bold uppercase tracking-wider text-muted">Sample ad</span>
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-ink"><Megaphone className="size-7" aria-hidden /></span>
            <span className="font-display text-3xl uppercase leading-none text-accent">Your brand on the big screen</span>
            <span className="text-sm text-ink/80">Reach moviegoers across Sri Lanka</span>
            <Link href="/about" className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-ink">Advertise</Link>
          </div>
        )}
      </div>
    </aside>
  );
}
