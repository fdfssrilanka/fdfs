"use client";
import { Megaphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Stand-in creative (728×90) shown until AdSense is configured, so the slot and its size are visible. */
function DummyAd() {
  return (
    <div className="relative flex h-[3.1rem] w-full max-w-[728px] items-center gap-3 overflow-hidden rounded-sm border border-line bg-gradient-to-r from-[#2a1200] via-[#3a1a00] to-[#121212] px-3 md:h-[5.25rem] md:px-6">
      <span className="absolute right-1 top-1 rounded bg-black/60 px-1 text-[9px] font-bold uppercase tracking-wider text-muted">Sample ad</span>
      <span className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink md:flex">
        <Megaphone className="size-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate font-display text-xl uppercase text-accent md:text-3xl">Your brand on the big screen</span>
        <span className="block truncate text-[11px] text-ink/80 md:text-sm">Reach moviegoers across Sri Lanka with fdfs.lk</span>
      </span>
      <Link href="/about" className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-accent-ink md:px-5 md:py-2.5 md:text-sm">Advertise</Link>
    </div>
  );
}

/**
 * Leaderboard banner at the top of every page (Google AdSense, responsive horizontal unit).
 * The height is reserved up front so the ad loading never shifts the page.
 */
export default function AdBanner() {
  const pathname = usePathname();
  const live = Boolean(CLIENT && SLOT);

  useEffect(() => {
    if (!live) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [live, pathname]);

  return (
    <aside aria-label="Advertisement" className="mb-4 md:mb-5">
      <div className="mx-auto flex h-[4.5rem] max-w-[970px] flex-col items-center justify-center overflow-hidden px-4 md:h-[6.5rem]">
        <span className="mb-0.5 text-[10px] uppercase tracking-widest text-muted">Advertisement</span>
        {live ? (
          <ins
            key={pathname}
            className="adsbygoogle block w-full"
            style={{ display: "block", height: "90px", maxHeight: "90px" }}
            data-ad-client={CLIENT}
            data-ad-slot={SLOT}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        ) : (
          <DummyAd />
        )}
      </div>
    </aside>
  );
}
