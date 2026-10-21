import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Posters are already downloaded at the sizes we use; skip the image optimizer so it runs on Cloudflare Workers.
  images: { unoptimized: true },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
