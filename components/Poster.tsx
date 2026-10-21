import Image from "next/image";

/** 2:3 poster with a typographic fallback so missing artwork never collapses the layout. */
export default function Poster({ src, title, sizes = "200px", priority = false, eager = false }: { src: string; title: string; sizes?: string; priority?: boolean; eager?: boolean }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-2">
      {src ? (
        <Image src={src} alt={`${title} poster`} fill sizes={sizes} priority={priority} loading={eager && !priority ? "eager" : undefined} className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center p-3 text-center text-sm font-bold text-muted">{title}</div>
      )}
    </div>
  );
}
