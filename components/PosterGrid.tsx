"use client";
import { useMemo, useState } from "react";
import type { Movie } from "@/lib/types";
import { t } from "@/lib/i18n";
import PosterCard from "./PosterCard";

export default function PosterGrid({ movies, showLanguage = true }: { movies: Movie[]; showLanguage?: boolean }) {
  const [lang, setLang] = useState("");
  const [genre, setGenre] = useState("");
  const languages = useMemo(() => [...new Set(movies.map((m) => m.language).filter(Boolean))], [movies]);
  const genres = useMemo(() => [...new Set(movies.flatMap((m) => m.genres))].sort(), [movies]);
  const shown = movies.filter((m) => (!lang || m.language === lang) && (!genre || m.genres.includes(genre)));

  const sel = "min-h-11 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink";
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        {showLanguage && languages.length > 1 && (
          <select aria-label={t("filter.language")} value={lang} onChange={(e) => setLang(e.target.value)} className={sel}>
            <option value="">{t("filter.language")}: {t("filter.all")}</option>
            {languages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        )}
        {genres.length > 1 && (
          <select aria-label={t("filter.genre")} value={genre} onChange={(e) => setGenre(e.target.value)} className={sel}>
            <option value="">{t("filter.genre")}: {t("filter.all")}</option>
            {genres.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        )}
      </div>
      {shown.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shown.map((m) => (
            <PosterCard key={m.id} movie={m} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-muted">{t("empty.movies")}</p>
      )}
    </div>
  );
}
