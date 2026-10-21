import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { toWebp } from "./lib/images";

/** One-off: convert images already in /public/images to resized WebP and point the JSON at them. */
const ROOT = process.cwd();
const FILES: [string, string[]][] = [["data/movies.json", ["posterUrl", "backdropUrl"]], ["data/offers.json", ["imageUrl"]]];

async function main() {
  let before = 0, after = 0;
  const { stat } = await import("node:fs/promises");
  for (const [file, keys] of FILES) {
    const rows = JSON.parse(await readFile(path.join(ROOT, file), "utf8"));
    for (const row of rows) {
      for (const key of keys) {
        const url: string = row[key];
        const m = url?.match(/^\/images\/(posters|backdrops|offers)\/(.+)\.(?!webp$)\w+$/);
        if (!m) continue;
        const src = path.join(ROOT, "public", url);
        before += (await stat(src)).size;
        const out = await toWebp(src, m[1] as "posters" | "backdrops" | "offers");
        after += (await stat(out)).size;
        row[key] = `/images/${m[1]}/${m[2]}.webp`;
      }
    }
    await writeFile(path.join(ROOT, file), JSON.stringify(rows, null, 2) + "\n");
  }
  console.log(`images: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
}
main().catch((e) => (console.error(e), process.exit(1)));
