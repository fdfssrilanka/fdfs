"use client";
import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import TrailerModal from "./TrailerModal";

export default function TrailerCard({ title, subtitle, image, url }: { title: string; subtitle: string; image: string; url: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="group block w-full text-left">
        <span className="relative block aspect-video overflow-hidden rounded-lg border border-line bg-surface-2">
          {image && <Image src={image} alt="" fill sizes="(min-width:1024px) 400px, 80vw" className="object-cover transition duration-200 group-hover:scale-105" />}
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex size-14 items-center justify-center rounded-full border-2 border-white bg-black/50 transition group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
              <Play className="size-6 fill-current" aria-hidden />
            </span>
          </span>
        </span>
        <span className="mt-2 block truncate text-sm font-bold">{title}</span>
        <span className="block truncate text-xs text-muted">{subtitle}</span>
      </button>
      {open && <TrailerModal url={url} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}
