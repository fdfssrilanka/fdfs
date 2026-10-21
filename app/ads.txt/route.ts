// AdSense requires this file at /ads.txt. Built from the publisher ID, so there is nothing to keep in sync by hand.
export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const body = client ? `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n` : "# Set NEXT_PUBLIC_ADSENSE_CLIENT to publish ads.txt\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
