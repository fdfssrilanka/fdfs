"use client";
import { dateParts } from "@/lib/format";

export default function DateStrip({ dates, selected, onSelect, today }: { dates: string[]; selected: string; onSelect: (d: string) => void; today: string | null }) {
  return (
    <div className="sticky top-14 z-30 -mx-4 border-b border-line bg-bg/95 px-4 backdrop-blur md:top-[4.5rem]">
      <div role="tablist" aria-label="Choose date" className="no-scrollbar flex gap-2 overflow-x-auto py-3">
        {dates.map((d, idx) => {
          const p = dateParts(d);
          const active = d === selected;
          return (
            <div key={d} className="flex shrink-0 gap-2">
            <button
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(d)}
              className={`flex min-h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border text-xs font-semibold ${active ? "border-link2 bg-link2 text-white" : "border-line bg-surface text-ink hover:border-link2"}`}
            >
              <span className="uppercase">{d === today ? "Today" : p.day}</span>
              <span className="text-xl font-black leading-tight">{p.num}</span>
              <span className={active ? "" : "text-muted"}>{p.month}</span>
            </button>
            {d === today && idx < dates.length - 1 && <span aria-hidden className="w-px self-stretch bg-line" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
