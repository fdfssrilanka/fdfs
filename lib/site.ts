export const SITE_URL = "https://fdfs.lk";
export const SITE_NAME = "fdfs.lk";
export const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** Public contact address shown on the legal pages. Set NEXT_PUBLIC_CONTACT_EMAIL; nothing is shown while it is empty. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
export const LEGAL_UPDATED = "21 October 2026";
