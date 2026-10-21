import Link from "next/link";
import { AudioLines, Glasses, ScanLine } from "lucide-react";
import type { Movie } from "@/lib/types";
import { formatReleaseDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import HeartButton from "./HeartButton";
import Poster from "./Poster";

const CHIP = { IMAX: ScanLine, "3D": Glasses, "Dolby Atmos": AudioLines } as const;

interface Props {
  movie: Movie;
  priority?: boolean;
  /** Load without lazy-loading but skip the preload hint (visible on wide screens, below the first few). */
  eager?: boolean;
  /** Orange corner label such as NEW. */
  tag?: string;
  /** Premium formats playing this movie, shown as small icon chips. */
  formats?: string[];
  /** Title only, for dense home-page rows. */
  compact?: boolean;
}

export default function PosterCard({ movie, priority = false, eager = false, tag, formats = [], compact = false }: Props) {
  const chips = (Object.keys(CHIP) as (keyof typeof CHIP)[]).filter((f) => formats.includes(f)).slice(0, 2);
  const href = `/movies/${movie.slug}`;
  return (
    <div className="group block w-full">
      <div className="relative">
        <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-accent">
          <div className="relative overflow-hidden rounded-lg border border-line transition duration-200 group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-lg group-hover:shadow-black/50">
            <Poster src={movie.posterUrl} title={movie.title} priority={priority} eager={eager} sizes="(min-width:1024px) 190px, 150px" />
            {tag && <span className="absolute left-0 top-0 rounded-br bg-accent px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-accent-ink">{tag}</span>}
            {chips.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex flex-col gap-1">
                {chips.map((f) => {
                  const Icon = CHIP[f];
                  return (
                    <span key={f} title={f} className="flex size-6 items-center justify-center rounded bg-purple text-white">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                  );
                })}
              </span>
            )}
          </div>
        </Link>
        <HeartButton id={movie.id} name={movie.title} kind="movie" overlay className="absolute bottom-1.5 right-1.5" />
      </div>
      <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-accent">
        <h3 className={`mt-2 font-semibold leading-snug ${compact ? "line-clamp-1 text-xs" : "line-clamp-2 text-sm"}`}>{movie.title}</h3>
        {compact ? (
          <p className="truncate text-[11px] text-muted">{movie.language}</p>
        ) : (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            {movie.language && <span className="rounded bg-surface-2 px-1.5 py-0.5 font-medium text-ink">{movie.language}</span>}
            <span>
              {movie.status === "now_showing"
                ? t("card.nowShowing")
                : movie.releaseDate
                  ? t("card.releasing", { date: formatReleaseDate(movie.releaseDate) })
                  : "Coming soon"}
            </span>
          </div>
        )}
      </Link>
    </div>
  );
}
