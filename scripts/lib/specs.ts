import type { Theatre } from "../../lib/types";

/** Spec chips for theatres without hand-listed specs, read from the "3 screens · A/C · 2K digital" details line. */
export function deriveSpecs(theatres: Theatre[]): Theatre[] {
  for (const th of theatres) {
    if (th.specs?.length || !th.details) continue;
    const parts = th.details.split("·").map((p) => p.trim());
    const specs: string[] = [];
    for (const p of parts) {
      const n = p.match(/^(\d+) screens?$/i);
      if (n) specs.push(`${n[1]} ${Number(n[1]) === 1 ? "Screen" : "Screens"}`);
      else if (/^A\/C$/i.test(p)) specs.push("AC");
      else if (/^(2K|4K) digital$/i.test(p)) specs.push(`${p.slice(0, 2)} Digital`);
      else if (/^IMAX$/i.test(p)) specs.push("IMAX");
      else if (/35mm/i.test(p)) specs.push("35mm Film");
      else if (/E-Cinema/i.test(p)) specs.push("E-Cinema");
    }
    if (specs.length) th.specs = specs;
  }
  return theatres;
}
