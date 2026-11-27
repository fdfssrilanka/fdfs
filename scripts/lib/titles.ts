/** Tidy a movie title as cinemas publish it: decode HTML entities and drop a stray trailing dash ("Ramayana - (Hindi)" → "Ramayana"). */
export const cleanTitle = (t: string) =>
  t.replace(/&amp;/g, "&").replace(/&#x27;|&apos;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+-\s*(\(\s*\))?\s*$/, "").replace(/\s+/g, " ").trim();
