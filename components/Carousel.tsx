"use client";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useState } from "react";

interface Props {
  title: string;
  href?: string;
  linkLabel?: string;
  id?: string;
  slideClass: string;
  arrowTop?: string;
  /** Defer rendering until near the viewport (rows below the first screen). */
  defer?: boolean;
  /** Drop the page-width container (when already inside one). */
  bare?: boolean;
  children: React.ReactNode;
}

/** Section heading plus a draggable row with arrows on larger screens. */
export default function Carousel({ title, href, linkLabel = "See all", id, slideClass, arrowTop = "top-[30%]", defer = false, bare = false, children }: Props) {
  const [ref, api] = useEmblaCarousel({ dragFree: true, align: "start", containScroll: "trimSnaps" });
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(true);

  const update = useCallback(() => {
    if (!api) return;
    setPrev(api.canScrollPrev());
    setNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    update();
    api.on("select", update).on("reInit", update).on("scroll", update);
  }, [api, update]);

  const slides = Children.toArray(children);
  if (!slides.length) return null;

  const arrow = "absolute hidden size-11 items-center justify-center rounded-full border border-soft bg-bg/80 text-soft shadow-lg hover:border-accent hover:text-accent disabled:opacity-0 md:flex";
  return (
    <section id={id} className={`${bare ? "" : "mx-auto w-full max-w-7xl px-4 py-6"} ${defer ? "cv-auto" : ""}`}>
      <h2 className="text-base font-extrabold uppercase tracking-wide sm:text-lg">{title}</h2>
      {href && (
        <Link href={href} className="mb-3 mt-0.5 inline-block text-xs font-bold uppercase tracking-wide text-link hover:underline">
          {linkLabel}
        </Link>
      )}
      <div className={`relative ${href ? "" : "mt-3"}`}>
        <div ref={ref} className="overflow-hidden">
          <div className="-ml-3 flex">
            {slides.map((s, i) => (
              <div key={i} className={`min-w-0 shrink-0 pl-3 ${slideClass}`}>
                {s}
              </div>
            ))}
          </div>
        </div>
        <button aria-label="Previous" onClick={() => api?.scrollPrev()} disabled={!prev} className={`${arrow} -left-5 ${arrowTop}`}><ChevronLeft /></button>
        <button aria-label="Next" onClick={() => api?.scrollNext()} disabled={!next} className={`${arrow} -right-5 ${arrowTop}`}><ChevronRight /></button>
      </div>
    </section>
  );
}
