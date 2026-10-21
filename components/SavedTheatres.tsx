"use client";
import Link from "next/link";
import type { Theatre } from "@/lib/types";
import { useFavorites } from "./FavoritesProvider";
import TheatreCard from "./TheatreCard";

export default function SavedTheatres({ theatres, chains }: { theatres: Theatre[]; chains: Record<string, string> }) {
  const { ids } = useFavorites();
  const saved = ids("theatre").map((id) => theatres.find((t) => t.id === id)).filter((t): t is Theatre => Boolean(t));
  if (!saved.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-6 text-center">
        <p className="text-sm text-muted">No saved theatres yet.</p>
        <Link href="/theatres" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-bold text-accent-ink">Browse theatres</Link>
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((t) => (
        <TheatreCard key={t.id} theatre={t} chain={chains[t.cinemaId]} />
      ))}
    </div>
  );
}
