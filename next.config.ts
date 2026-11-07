import type { NextConfig } from "next";

const BACKEND = process.env.BACKEND_URL ?? "https://e-commerce-backend-0l5v.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Browser requests /api/v1/* on localhost:3000 -> Next server forwards to the backend.
      // Server-to-server requests are not subject to CORS.
      { source: "/api/v1/:path*", destination: `${BACKEND}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
