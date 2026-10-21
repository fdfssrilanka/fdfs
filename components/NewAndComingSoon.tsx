import Link from "next/link";
import { getNewAndComingSoon, getTag } from "@/lib/data";
import Poster from "./Poster";

export default function NewAndComingSoon({ excludeId }: { excludeId?: string }) {
  const movies = getNewAndComingSoon(excludeId);
  if (!movies.length) return null;
  return (
    <section className="cv-auto mx-auto w-full max-w-7xl px-4 py-8">
      <h2 className="mb-3 text-base font-extrabold uppercase tracking-wide sm:text-lg">New &amp; Coming Soon</h2>
      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {movies.map((m) => {
          const tag = getTag(m);
          return (
            <Link key={m.id} href={`/movies/${m.slug}`} className="group relative block overflow-hidden rounded-lg border border-line hover:border-accent">
              <Poster src={m.posterUrl} title={m.title} sizes="120px" />
              {tag && <span className="absolute left-0 top-0 rounded-br bg-accent px-2 py-0.5 text-[10px] font-black uppercase text-accent-ink">{tag}</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
