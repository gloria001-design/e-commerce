import type { NextConfig } from "next";

const BACKEND = process.env.BACKEND_URL ?? "https://e-commerce-backend-0l5v.onrender.com";

const nextConfig: NextConfig = {
  // Only used when NEXT_PUBLIC_USE_PROXY=true (see .env.example). Harmless otherwise.
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${BACKEND}/api/v1/:path*` }];
  },
};

export default nextConfig;
