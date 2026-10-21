import Link from "next/link";
import { getTheatresWithExperience } from "@/lib/data";
import ExperienceBadge from "./ExperienceBadge";

const CARDS = [
  { name: "IMAX", title: "IMAX with Laser", text: "The biggest screen, laser projection and powerful sound for the biggest releases." },
  { name: "Gold Class", title: "Gold Class", text: "Reclining seats, swing trays and food served at your seat in a private screen." },
  { name: "Director's Lounge", title: "Director's Lounge", text: "A VIP section with premium seating and personalised service." },
  { name: "Dolby Atmos", title: "Dolby Atmos", text: "Sound that moves around and above you for a fully immersive film." },
];

export default function ExperienceCards() {
  return (
    <section id="experiences" className="mx-auto w-full max-w-7xl px-4 py-6">
      <h2 className="text-base font-extrabold uppercase tracking-wide sm:text-lg">Premium Experiences</h2>
      <p className="mb-3 mt-0.5 text-xs font-bold uppercase tracking-wide text-muted">Where to find them</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => {
          const where = getTheatresWithExperience(c.name);
          return (
            <article key={c.name} className="flex overflow-hidden rounded-xl border border-line bg-surface sm:flex-col">
              <div className="flex w-28 shrink-0 items-center justify-center bg-surface-2 p-2 sm:h-28 sm:w-auto sm:p-0">
                <ExperienceBadge name={c.name} size="sm" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                <h3 className="font-bold leading-snug">{c.title}</h3>
                <p className="mt-1 text-sm leading-snug text-muted sm:flex-1">{c.text}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {where.map((x) => (
                    <li key={x.id}>
                      <Link href={`/theatres/${x.slug}`} className="inline-flex min-h-8 items-center rounded-full border border-line px-3 text-[11px] font-bold uppercase tracking-wide text-link hover:border-link">
                        {x.name.replace(/^Scope Cinemas (Multiplex - )?/, "Scope ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
