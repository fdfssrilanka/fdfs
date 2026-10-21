"use client";
import Link from "next/link";
import type { Movie } from "@/lib/types";
import { useFavorites } from "./FavoritesProvider";
import PosterCard from "./PosterCard";

export default function SavedMovies({ movies }: { movies: Movie[] }) {
  const { ids } = useFavorites();
  const saved = ids("movie").map((id) => movies.find((m) => m.id === id)).filter((m): m is Movie => Boolean(m));
  if (!saved.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-6 text-center">
        <p className="text-sm text-muted">No saved movies yet.</p>
        <Link href="/movies" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-bold text-accent-ink">Browse movies</Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {saved.map((m) => (
        <PosterCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
