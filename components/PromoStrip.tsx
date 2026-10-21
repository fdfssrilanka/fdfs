"use client";
import Link from "next/link";
import { CalendarClock, ChevronLeft, ChevronRight, CirclePlay, ScanLine, Ticket } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = { ticket: Ticket, imax: ScanLine, soon: CalendarClock, trailer: CirclePlay };
export interface Promo {
  icon: keyof typeof ICONS;
  lead: string;
  text: string;
  href: string;
}

export default function PromoStrip({ promos }: { promos: Promo[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = promos.length;

  useEffect(() => {
    if (paused || n < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(id);
  }, [paused, n]);

  if (!n) return null;
  const p = promos[i];
  const Icon = ICONS[p.icon];
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const arrow = "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-soft text-soft hover:border-accent hover:text-accent sm:size-10";

  return (
    <section aria-roledescription="carousel" aria-label="Highlights" className="border-b border-line bg-bg" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-4 sm:gap-8">
        <button aria-label="Previous highlight" onClick={() => go(-1)} className={arrow}><ChevronLeft className="size-5" /></button>
        <div className="flex w-full min-w-0 max-w-[34rem] flex-col items-center">
          <Link href={p.href} className="flex min-h-12 items-center justify-center gap-3 sm:gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-utility text-white sm:size-12"><Icon className="size-5 sm:size-6" aria-hidden /></span>
            <span className="min-w-0 text-center leading-snug">
              <span className="block text-sm font-extrabold text-link sm:text-base">{p.lead}</span>
              <span className="block text-sm text-ink sm:text-base">{p.text}</span>
            </span>
          </Link>
          <div className="mt-1 flex">
            {promos.map((x, k) => (
              <button key={x.href + k} aria-label={`Show highlight ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} className="flex size-6 items-center justify-center">
                <span className={`size-2 rounded-full ${k === i ? "bg-soft" : "bg-muted/60"}`} />
              </button>
            ))}
          </div>
        </div>
        <button aria-label="Next highlight" onClick={() => go(1)} className={arrow}><ChevronRight className="size-5" /></button>
      </div>
    </section>
  );
}
