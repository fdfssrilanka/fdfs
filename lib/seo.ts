import type { Theatre } from "./types";

/** Short names people search for, per theatre. Used in titles, headings and FAQ copy. */
const SHORT: Record<string, { short: string; title: string }> = {
  "scope-ccc": { short: "CCC", title: "Scope Cinemas CCC (Colombo City Centre)" },
  "scope-hcm": { short: "Havelock City Mall", title: "Scope Cinemas Havelock City Mall" },
  "scope-colpetty": { short: "Liberty Colpetty", title: "Liberty Cinema Colpetty (Scope Cinemas)" },
  "scope-kiribathgoda": { short: "Liberty Kiribathgoda", title: "Liberty Cinema Kiribathgoda (Scope Cinemas)" },
  "pvr-ogf": { short: "PVR Colombo", title: "PVR Cinemas Colombo (One Galle Face)" },
  "eap-savoy-3d-dolby-atmos": { short: "Savoy 3D", title: "Savoy Cinema Wellawatte (Savoy 3D Dolby Atmos)" },
  "eap-savoy-premier-rajagiriya": { short: "Savoy Premier Rajagiriya", title: "Savoy Premier Cinema Rajagiriya" },
  "kcc-multiplex": { short: "KCC Multiplex", title: "KCC Multiplex Kandy" },
  "lite-aqua-negombo": { short: "Aqua Lite", title: "Aqua Lite 3D Cinema Negombo (Lite Cinemas)" },
};

export function theatreNames(th: Theatre) {
  const s = SHORT[th.id];
  return { short: s?.short ?? th.name, title: s?.title ?? `${th.name}, ${th.city}` };
}

export const joinList = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export interface Faq {
  q: string;
  a: string;
}

export const faqJsonLd = (faq: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/** Other ways people search for a theatre (spelling variants and former or local names), shown on its page. */
export const ALSO_KNOWN_AS: Record<string, string[]> = {
  "scope-ccc": ["CCC cinema", "CCC movies", "Colombo City Centre cinema"],
  "scope-hcm": ["Havelock cinema", "Havelock City Mall cinema", "Scope Havelock"],
  "scope-colpetty": ["Liberty Cinema Kollupitiya", "Kollupitiya film hall", "Scope Cinemas Kollupitiya"],
  "scope-kiribathgoda": ["Scope cinema Kiribathgoda", "Kiribathgoda film hall"],
  "pvr-ogf": ["PVR OGF", "PVR cinema One Galle Face"],
  "nfc-roo-katunayake": ["Ruoo Cinema Katunayake"],
  "nfc-vox-lite": ["Voxx Lite Cinema Avissawella"],
  "nfc-sky-lite": ["Skylight Matara", "Sky Lite Cinema Matara"],
  "nfc-sky-lights": ["Skylight Cinema Malabe"],
  "nfc-himali-kiribathgoda": ["Himalee Cinema Kiribathgoda"],
  "nfc-max-lite": ["Maxx Lite Cinema Moratuwa"],
  "nfc-majestic-city": ["Majestic City cinema Colombo", "Majestic Cineplex Colombo"],
  "nfc-cinecity-maradana": ["Cine City Maradana"],
  "nfc-tarzan-kegalle": ["New Tarzan Cinema Kegalle"],
  "eap-willmax": ["Wilmax Anuradhapura"],
  "eap-sinexpo-3d": ["Cinexpo Kurunegala"],
  "eap-cinemax-3d": ["Ja-Ela Cinemax", "Reality Plaza cinema Ja-ela"],
  "eap-savoy-3d-dolby-atmos": ["Savoy cinema Wellawatte"],
  "eap-savoy-premier-rajagiriya": ["Savoy cinema Rajagiriya"],
  "eap-savoy-metro-maharagama": ["Savoy cinema Maharagama"],
  "eap-savoy-metro-gampaha": ["Savoy cinema Gampaha"],
  "lite-aqua-negombo": ["Aqualite Cinema Negombo", "Andrew cinema Negombo"],
};
