import Link from "next/link";
import { getTheatresWithExperience } from "@/lib/data";
import ExperienceBadge from "./ExperienceBadge";

const CARDS = [
  { name: "IMAX", title: "IMAX with Laser", text: "Find IMAX cinemas and published IMAX movie showtimes.", href: "/imax" },
  { name: "Gold Class", title: "Gold Class", text: "See which cinema lists Gold Class and check its published sessions.", href: "/experiences/gold-class" },
  { name: "Director's Lounge", title: "Director's Lounge", text: "Find the cinema listing Director's Lounge and browse its movies.", href: "/experiences/directors-lounge" },
  { name: "Dolby Atmos", title: "Dolby Atmos", text: "Find cinemas listing Dolby Atmos and movies with published sessions.", href: "/experiences/dolby-atmos" },
  { name: "3D", title: "3D cinemas", text: "Browse cinemas listing 3D and movies with published 3D sessions.", href: "/experiences/3d-cinemas" },
];

export default function ExperienceCards() {
  return (
    <section id="experiences" className="mx-auto w-full max-w-7xl px-4 py-6">
      <h2 className="text-base font-extrabold uppercase tracking-wide sm:text-lg">Premium Experiences</h2>
      <p className="mb-3 mt-0.5 text-xs font-bold uppercase tracking-wide text-muted">Where to find them</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CARDS.map((c) => {
          const where = getTheatresWithExperience(c.name);
          return (
            <article key={c.name} className="flex overflow-hidden rounded-xl border border-line bg-surface sm:flex-col">
              <div className="flex w-28 shrink-0 items-center justify-center bg-surface-2 p-2 sm:h-28 sm:w-auto sm:p-0">
                <ExperienceBadge name={c.name} size="sm" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                <h3 className="font-bold leading-snug"><Link href={c.href} className="hover:text-link">{c.title}</Link></h3>
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
                <Link href={c.href} className="mt-3 text-xs font-bold text-link underline underline-offset-2">See cinemas and showtimes</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
