"use client";
import { Heart } from "lucide-react";
import { useFavorites, type SavedKind } from "./FavoritesProvider";

interface Props {
  id: string;
  name: string;
  kind?: SavedKind;
  /** Show the words "Save"/"Saved" next to the heart. */
  label?: boolean;
  /** Dark round button for sitting on top of artwork. */
  overlay?: boolean;
  className?: string;
}

export default function HeartButton({ id, name, kind = "theatre", label = false, overlay = false, className = "" }: Props) {
  const { has, toggle } = useFavorites();
  const saved = has(kind, id);
  const noun = kind === "movie" ? "movie" : "theatre";
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label ? undefined : saved ? `Remove ${name} from saved ${noun}s` : `Save ${name}`}
      title={saved ? "Saved" : `Save ${noun}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(kind, id);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold hover:text-accent ${overlay ? "size-9 bg-black/70 ring-1 ring-white/25" : "min-h-11 min-w-11"} ${saved ? "text-accent" : overlay ? "text-white" : "text-ink/80"} ${className}`}
    >
      <Heart className={`${overlay ? "size-5" : "size-6"} ${saved ? "fill-current" : ""}`} aria-hidden />
      {label && (
        <span>
          {saved ? "Saved" : `Save ${noun}`}
          <span className="sr-only"> {name}</span>
        </span>
      )}
    </button>
  );
}
