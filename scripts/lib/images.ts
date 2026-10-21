import { rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** Max width and WebP quality per kind of artwork: posters show at ~190px, banners at most ~1280px. */
export const SIZES = { posters: { width: 320, quality: 70 }, backdrops: { width: 1100, quality: 65 }, offers: { width: 320, quality: 76 } } as const;

/** Convert a downloaded image to a resized WebP next to it and delete the original. Returns the new file path. */
export async function toWebp(file: string, kind: keyof typeof SIZES): Promise<string> {
  const out = file.replace(/\.[a-z0-9]+$/i, ".webp");
  const { width, quality } = SIZES[kind];
  await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(`${out}.tmp`);
  const { rename } = await import("node:fs/promises");
  await rename(`${out}.tmp`, out);
  if (path.resolve(out) !== path.resolve(file)) await rm(file, { force: true });
  return out;
}
