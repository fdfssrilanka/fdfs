"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type SavedKind = "theatre" | "movie";
const KEYS: Record<SavedKind, string> = { theatre: "fdfs-saved-theatres", movie: "fdfs-saved-movies" };

interface Ctx {
  ids: (kind: SavedKind) => string[];
  has: (kind: SavedKind, id: string) => boolean;
  toggle: (kind: SavedKind, id: string) => void;
  total: number;
}

const Context = createContext<Ctx>({ ids: () => [], has: () => false, toggle: () => {}, total: 0 });
export const useFavorites = () => useContext(Context);

const read = (key: string): string[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
};

/** Saved theatres and movies live in this browser only (localStorage). */
export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<Record<SavedKind, string[]>>({ theatre: [], movie: [] });

  useEffect(() => {
    setSaved({ theatre: read(KEYS.theatre), movie: read(KEYS.movie) });
    const sync = (e: StorageEvent) => {
      const kind = (Object.keys(KEYS) as SavedKind[]).find((k) => KEYS[k] === e.key);
      if (kind) setSaved((p) => ({ ...p, [kind]: read(KEYS[kind]) }));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggle = useCallback((kind: SavedKind, id: string) => {
    setSaved((prev) => {
      const list = prev[kind];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      try {
        localStorage.setItem(KEYS[kind], JSON.stringify(next));
      } catch {}
      return { ...prev, [kind]: next };
    });
  }, []);

  const ids = useCallback((kind: SavedKind) => saved[kind], [saved]);
  const has = useCallback((kind: SavedKind, id: string) => saved[kind].includes(id), [saved]);
  return <Context.Provider value={{ ids, has, toggle, total: saved.theatre.length + saved.movie.length }}>{children}</Context.Provider>;
}
