"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
import { youtubeId } from "@/lib/format";

export default function TrailerModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const id = youtubeId(url);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!id) return null;
  return (
    <div role="dialog" aria-modal aria-label={`${title} trailer`} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button aria-label="Close trailer" className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-surface text-ink" onClick={onClose}>
        <X />
      </button>
      <div className="aspect-video w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <iframe
          className="size-full rounded-lg"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={`${title} trailer`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
