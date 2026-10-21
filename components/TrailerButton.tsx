"use client";
import { Play } from "lucide-react";
import { useState } from "react";
import { t } from "@/lib/i18n";
import { youtubeId } from "@/lib/format";
import TrailerModal from "./TrailerModal";

export default function TrailerButton({ url, title, className = "" }: { url: string; title: string; className?: string }) {
  const [open, setOpen] = useState(false);
  if (!youtubeId(url)) return null;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-4 text-sm sm:px-6 font-bold text-ink hover:border-accent hover:text-accent ${className}`}
      >
        <Play className="size-4 fill-current" aria-hidden /> {t("hero.watchTrailer")}
      </button>
      {open && <TrailerModal url={url} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}
