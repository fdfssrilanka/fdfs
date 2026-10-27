/** Stat tile for a theatre spec: small label over a bold value, e.g. SCREENS / 6 or SOUND / Dolby 7.1. Deliberately unlike the icon ExperienceBadge. */
function tile(spec: string): { label: string; value: string } {
  const screens = spec.match(/^(\d+) screens?$/i);
  if (screens) return { label: Number(screens[1]) === 1 ? "Screen" : "Screens", value: screens[1] };
  if (/^(AC|A\/C)$/i.test(spec)) return { label: "Cooling", value: "AC" };
  if (/^3D$/i.test(spec)) return { label: "Format", value: "3D" };
  if (/^Dolby /i.test(spec)) return { label: "Sound", value: spec };
  const proj = spec.match(/^(\dK) (.+)$/i);
  if (proj) return { label: "Projection", value: /^projection$/i.test(proj[2]) ? proj[1] : spec };
  return { label: "Spec", value: spec };
}

export default function SpecBadge({ spec, size = "md" }: { spec: string; size?: "sm" | "md" }) {
  const { label, value } = tile(spec);
  const sm = size === "sm";
  return (
    <span className={`inline-flex flex-col border-l-2 border-accent bg-surface-2 leading-none ${sm ? "gap-1 px-2.5 py-1.5" : "gap-1.5 px-4 py-2.5"}`} title={spec}>
      <span className={`font-bold uppercase tracking-widest text-muted ${sm ? "text-[9px]" : "text-[10px]"}`}>{label}</span>
      <span className={`font-extrabold text-ink ${sm ? "text-sm" : "text-lg"}`}>{value}</span>
    </span>
  );
}
