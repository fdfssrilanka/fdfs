import type { Theatre } from "../../lib/types";

/** Screen count and AC chips for non-Lite theatres, read from the "3 screens · A/C · 2K digital" details line. Resolution and format already show as badges. */
export function deriveSpecs(theatres: Theatre[]): Theatre[] {
  for (const th of theatres) {
    if (th.cinemaId === "lite") continue;
    delete th.specs;
    if (!th.details) continue;
    const parts = th.details.split("·").map((p) => p.trim());
    const specs: string[] = [];
    for (const p of parts) {
      const n = p.match(/^(\d+) screens?$/i);
      if (n) specs.push(`${n[1]} ${Number(n[1]) === 1 ? "Screen" : "Screens"}`);
      else if (/^A\/C$/i.test(p)) specs.push("AC");
    }
    if (specs.length) th.specs = specs;
  }
  return theatres;
}
