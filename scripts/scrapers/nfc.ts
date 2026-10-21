import { get, slugify } from "../lib/http";
import type { Cinema, Theatre } from "../../lib/types";

const URL_ = "https://nfc.gov.lk/cinemas/";

/** The National Film Corporation's directory of cinema halls: a name, district, town, formats and phone per screen. No showtimes. */
export const cinema: Cinema = { id: "nfc", name: "Independent cinemas", website: URL_, bookingSite: URL_ };

interface Hall { name: string; district: string; location: string; formats: string[]; category: string; contact: string }

/** Halls already listed from a cinema's own site: NFC group -> existing theatre id. Matched by district + town + name. */
const KNOWN: [RegExp, RegExp, RegExp, string[]][] = [
  [/colombo/i, /^colombo$/i, /colombo city center/i, ["scope-ccc"]],
  [/colombo/i, /colombo 06/i, /havelock/i, ["scope-hcm"]],
  [/colombo/i, /kollupitiya/i, /liberty/i, ["scope-colpetty"]],
  [/gampaha/i, /kiribathgoda/i, /liberty/i, ["scope-kiribathgoda"]],
  [/colombo/i, /galle fac/i, /^pvr/i, ["pvr-ogf"]],
  [/colombo/i, /maharagama/i, /savoy metro/i, ["eap-savoy-metro-maharagama"]],
  [/gampaha/i, /gampaha/i, /savoy metro/i, ["eap-savoy-metro-gampaha"]],
  [/colombo/i, /rajagiriya/i, /savoy premier/i, ["eap-savoy-premier-rajagiriya"]],
  [/colombo/i, /wellawatta/i, /savoy premier/i, ["eap-savoy-premiere-roxy-cinema"]],
  [/colombo/i, /wellawatta/i, /savoy 3d/i, ["eap-savoy-3d-dolby-atmos"]],
  [/galle/i, /ambalangoda/i, /regal/i, ["eap-regal"]],
  [/colombo/i, /dematagoda/i, /samantha/i, ["eap-samantha-2d"]],
  [/kurunegala/i, /kurunegala/i, /cinexpo/i, ["eap-sinexpo-3d"]],
  [/ratnapura/i, /ratnapura/i, /jothi/i, ["eap-jothi"]],
  [/anuradhapura/i, /anuradhapura/i, /wilmax/i, ["eap-willmax"]],
  [/gampaha/i, /ja-?ela/i, /cinemax/i, ["eap-cinemax-3d"]],
  [/colombo/i, /dehiwala/i, /concord/i, ["eap-concord"]],
  [/jaffna/i, /jaffna/i, /^rajah/i, ["str-rajah-1", "str-rajah-2"]],
  [/vavuniya/i, /vavuniya/i, /vasanthi/i, ["str-vasanthy"]],
  [/batticaloa/i, /batticaloa/i, /shanthi/i, ["str-shanthi"]],
  [/batticaloa/i, /batticaloa/i, /suganthi/i, ["str-suganthi"]],
  [/trincomalee/i, /trincomalee/i, /sarasvathi/i, ["str-saraswathi"]],
  [/batticaloa/i, /batticaloa/i, /vijaya/i, ["vijaya-batticaloa"]],
  [/kandy/i, /^kandy$/i, /k\.c\.c/i, ["kcc-multiplex"]],
  [/kandy/i, /^kandy$/i, /jp cineplex/i, ["jp-kandy"]],
  [/jaffna/i, /^jaffna$/i, /^regal/i, ["ceylon-majestic-jaffna"]],
  [/jaffna/i, /^jaffna$/i, /^chella/i, ["chelva-jaffna"]],
  [/gampaha/i, /negombo/i, /aqua lite/i, ["lite-aqua-negombo"]],
];

const phone = (c: string) => {
  const n = c.split(/\s+/)[0]?.replace(/\D/g, "");
  return n ? `+94${n.replace(/^0/, "")}` : "";
};

/** Strip screen suffixes ("- 01", " 2", "Gold") so a venue's screens group under one name. */
function groupName(names: string[]): string {
  const clean = names.map((n) => n.replace(/\s*-?\s*0?\d+\s*$/, "").replace(/\s+-\s*$/, "").trim());
  const toks = clean.map((n) => n.split(/\s+/).filter((t) => t !== "-"));
  let common: string[] = [];
  for (let i = 0; i < Math.min(...toks.map((t) => t.length)); i++) {
    if (toks.every((t) => t[i].toLowerCase() === toks[0][i].toLowerCase())) common.push(toks[0][i]);
    else break;
  }
  if (!common.length) common = toks[0];
  return common.join(" ").replace(/\s*-\s*$/, "").replace(/^K\.C\.C\.?$/i, "KCC");
}

function parse(html: string): Hall[] {
  const i = html.indexOf("const cinemaHalls = [");
  if (i < 0) return [];
  const start = i + "const cinemaHalls = ".length;
  let depth = 0, end = start;
  for (; end < html.length; end++) {
    if (html[end] === "[") depth++;
    else if (html[end] === "]" && --depth === 0) break;
  }
  // The array is a JS literal of plain strings; turn it into JSON instead of evaluating it.
  const json = html.slice(start, end + 1).replace(/([{,]\s*)([A-Za-z_]+)\s*:/g, '$1"$2":').replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(json);
}

export async function scrape() {
  const halls = parse(await get(URL_));
  const groups = new Map<string, Hall[]>();
  for (const h of halls) {
    const key = `${h.district}|${h.location}|${h.contact.split(/\s+/)[0] || h.name.split(/\s+/)[0]}`;
    groups.set(key, [...(groups.get(key) ?? []), h]);
  }

  const theatres: Theatre[] = [];
  const enrich: Record<string, { phone: string; details: string }> = {};
  const slugs = new Set<string>();

  for (const g of groups.values()) {
    const { district, location } = g[0];
    const name = groupName(g.map((h) => h.name));
    const fmts = [...new Set(g.flatMap((h) => h.formats))];
    const proj = ["IMAX", "4K", "2K", "35mm", "E-Cinema"].filter((f) => fmts.includes(f)).map((f) => (f === "E-Cinema" ? "digital (E-Cinema)" : f === "35mm" ? "35mm film" : f === "IMAX" ? "IMAX" : `${f} digital`));
    const ac = fmts.includes("A/C") ? "A/C" : fmts.includes("Non A/C") ? "Non A/C" : "";
    const details = [`${g.length} screen${g.length === 1 ? "" : "s"}`, ac, proj[0]].filter(Boolean).join(" · ");
    const perks = [
      fmts.includes("IMAX") && "IMAX",
      fmts.includes("4K") && "4K",
      g.some((h) => /multiplex/i.test(h.category)) && "Multiplex",
      fmts.includes("35mm") && "35mm Film",
      fmts.includes("A/C") && "Air Conditioned",
    ].filter((x): x is string => Boolean(x));
    const known = KNOWN.find(([d, l, n]) => d.test(district) && l.test(location) && n.test(g[0].name));
    if (known) {
      for (const id of known[3]) enrich[id] = { phone: phone(g[0].contact), details };
      continue;
    }
    const display = name.split(/\s+/).length < 2 && !name.toLowerCase().includes(location.toLowerCase()) ? `${name} ${location.replace(/\s*\(.*$/, "")}` : name;
    let slug = slugify(display);
    if (slugs.has(slug)) slug = slugify(`${display} ${district}`);
    slugs.add(slug);
    theatres.push({
      id: `nfc-${slug}`, cinemaId: "nfc", slug, name: display, city: district, town: location.replace(/\s*\(.*$/, ""),
      address: location.replace(/\s*\(.*$/, "") === district ? district : `${location.replace(/\s*\(.*$/, "")}, ${district}`,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${display} cinema ${location} Sri Lanka`)}`,
      formats: fmts, experiences: perks, phone: phone(g[0].contact), details, source: "nfc",
    });
  }
  return { cinema, theatres, enrich, hallCount: halls.length };
}
