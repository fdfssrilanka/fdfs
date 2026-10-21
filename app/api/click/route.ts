import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

const KINDS = new Set(["showtime", "book_button", "other_cinema", "theatre_site", "booking_guide", "offer"]);

interface Dataset {
  writeDataPoint(point: { indexes?: string[]; blobs?: string[]; doubles?: number[] }): void;
}

/**
 * Records an outbound click. Stored in a Workers Analytics Engine dataset (binding CLICKS).
 * No cookies, IPs or user ids are kept, only what was clicked and the visitor's country.
 */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(req.url).host) return new Response(null, { status: 403 });

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const s = (k: string, max = 100) => (typeof b[k] === "string" ? (b[k] as string).slice(0, max) : "");

  const kind = s("kind", 20);
  let host = "";
  try {
    const u = new URL(s("url", 400));
    if (u.protocol !== "https:") throw new Error();
    host = u.hostname;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!KINDS.has(kind)) return new Response(null, { status: 400 });

  const blobs = [kind, s("movieId"), s("theatreId"), s("cinemaId"), host, s("format", 30), s("date", 10), s("time", 5), s("page", 120)];
  try {
    const { env, cf } = await getCloudflareContext({ async: true });
    const ds = (env as unknown as { CLICKS?: Dataset }).CLICKS;
    blobs.push(String(cf?.country ?? ""));
    if (ds) ds.writeDataPoint({ indexes: [s("movieId") || kind], blobs, doubles: [1] });
    else console.log("[click]", JSON.stringify(blobs));
  } catch {
    console.log("[click]", JSON.stringify(blobs));
  }
  return new Response(null, { status: 204 });
}
