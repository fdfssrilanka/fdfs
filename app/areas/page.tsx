import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { getAreas, getCities } from "@/lib/data";
import { regionOf } from "@/lib/geo";
import { getNearTowns } from "@/lib/nearby";

export const metadata: Metadata = {
  title: "Film Halls by Town in Sri Lanka – Find the Nearest Cinema | fdfs.lk",
  description: "Film halls and cinemas in Sri Lanka listed by town, from Kiribathgoda and Dehiwala to Chilaw and Point Pedro, with addresses, phone numbers and showtimes.",
  alternates: { canonical: "/areas" },
};

export default function AreasPage() {
  const areas = getAreas();
  const byRegion = getCities().map((c) => ({ ...c, areas: areas.filter((a) => regionOf(a.theatres[0].city) === c.name) })).filter((c) => c.areas.length);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="Film halls by town">
        {`Film halls and cinemas in ${areas.length} towns and suburbs across Sri Lanka. Choose a town for its cinemas, addresses, phone numbers and showtimes, or open a district to see every cinema in it.`}
      </PageIntro>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {byRegion.map((c) => (
          <section key={c.slug}>
            <h2 className="mb-2 text-lg font-extrabold"><Link href={`/cities/${c.slug}`} className="hover:text-accent">{c.name}</Link></h2>
            <ul>
              {c.areas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="inline-flex min-h-9 items-center text-sm text-link hover:underline">
                    Film halls in {a.name} <span className="ml-2 text-muted">({a.theatres.length})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="mb-2 text-lg font-extrabold">Nearest film halls to towns without a cinema</h2>
        <p className="text-sm leading-loose">
          {getNearTowns().map((n, i) => (
            <span key={n.slug}>{i > 0 && " · "}<Link href={`/areas/${n.slug}`} className="text-link underline underline-offset-2">Film halls near {n.name}</Link></span>
          ))}
        </p>
      </section>
    </div>
  );
}
