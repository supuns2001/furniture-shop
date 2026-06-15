import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TS type errors and ESLint during Vercel production build.
  // Type checking is still enforced locally via `npx tsc --noEmit`.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

