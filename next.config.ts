import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Posters are already downloaded at the sizes we use; skip the image optimizer so it runs on Cloudflare Workers.
  images: { unoptimized: true },
  // Lets a phone on the same Wi-Fi load the dev server (dev only).
  allowedDevOrigins: ["192.168.4.36", "*.local"],
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
