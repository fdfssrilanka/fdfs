import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

/** Coarse, IP-based location from Cloudflare. Nothing is stored; the browser uses it to pick a default city. */
export async function GET() {
  const empty = { country: null, city: null, lat: null, lng: null };
  try {
    const { cf } = await getCloudflareContext({ async: true });
    const lat = Number(cf?.latitude);
    const lng = Number(cf?.longitude);
    return Response.json(
      { country: cf?.country ?? null, city: cf?.city ?? null, lat: Number.isFinite(lat) && cf?.latitude ? lat : null, lng: Number.isFinite(lng) && cf?.longitude ? lng : null },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return Response.json(empty, { headers: { "Cache-Control": "private, no-store" } });
  }
}
