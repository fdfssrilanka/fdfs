import { Armchair, AudioLines, Crown, Film, Gem, Glasses, LayoutGrid, Monitor, Projector, Rows3, ScanLine, Snowflake, Sofa, Users, Utensils, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Style {
  icon?: LucideIcon;
  top: string;
  bottom?: string;
  className: string;
}

// Our own treatment of each premium experience: icon and condensed two-line label, all in black and white.
const MONO = "bg-black text-white border-white/40";
const STYLES: Record<string, Style> = {
  "Dolby Atmos": { icon: AudioLines, top: "Dolby", bottom: "Atmos", className: MONO },
  "Director's Lounge": { icon: Armchair, top: "Director's", bottom: "Lounge", className: MONO },
  "Gold Class": { icon: Crown, top: "Gold", bottom: "Class", className: MONO },
  "Balcony Seating": { icon: Rows3, top: "Balcony", bottom: "Seating", className: MONO },
  IMAX: { icon: ScanLine, top: "IMAX", bottom: "Laser", className: MONO },
  "3D": { icon: Glasses, top: "3D", bottom: "Digital", className: MONO },
  "2D": { icon: Projector, top: "2D", bottom: "Digital", className: MONO },
  "Food to Seat": { icon: Utensils, top: "Food", bottom: "To Your Seat", className: MONO },
  "Couple Seats": { icon: Users, top: "Couple", bottom: "Seats", className: MONO },
  "4K": { icon: Monitor, top: "4K", bottom: "Digital", className: MONO },
  Laser: { icon: Zap, top: "Laser", bottom: "Projection", className: MONO },
  Platinum: { icon: Gem, top: "Platinum", bottom: "Screen", className: MONO },
  "Air Conditioned": { icon: Snowflake, top: "A/C", bottom: "Cooled", className: MONO },
  Multiplex: { icon: LayoutGrid, top: "Multiplex", bottom: "Screens", className: MONO },
  "35mm Film": { icon: Film, top: "35mm", bottom: "Film", className: MONO },
  Luxe: { icon: Sofa, top: "Luxe", bottom: "Recliners", className: MONO },
};

export const hasBadge = (name: string) => name in STYLES;

export default function ExperienceBadge({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const s = STYLES[name];
  if (!s) return null;
  const Icon = s.icon;
  const sm = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border font-extrabold uppercase leading-none tracking-wide ${s.className} ${sm ? "px-2 py-1.5 text-[10px]" : "px-3.5 py-2.5 text-xs"}`}
      title={name}
    >
      {Icon && <Icon aria-hidden className={sm ? "size-4" : "size-6"} strokeWidth={1.75} />}
      <span className="flex flex-col gap-0.5">
        <span className={`font-display ${sm ? "text-[15px]" : "text-xl"}`}>{s.top}</span>
        {s.bottom && <span className={`font-semibold tracking-wider ${sm ? "text-[8px]" : "text-[10px]"} opacity-90`}>{s.bottom}</span>}
      </span>
    </span>
  );
}

export function BadgeRow({ names, size = "md", max }: { names: string[]; size?: "sm" | "md"; max?: number }) {
  const shown = names.filter(hasBadge);
  if (!shown.length) return null;
  const visible = max ? shown.slice(0, max) : shown;
  const extra = shown.length - visible.length;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((n) => (
        <ExperienceBadge key={n} name={n} size={size} />
      ))}
      {extra > 0 && <span className="text-xs font-bold text-muted">+{extra} more</span>}
    </div>
  );
}
