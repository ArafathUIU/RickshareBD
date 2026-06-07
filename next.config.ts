import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https://*.tile.openstreetmap.org https://*.tile.openstreetmap.de https://*.tile.openstreetmap.fr https://*.tile.opentopomap.org https://*.tile.thunderforest.com https://*.tile.openstreetmap.org; connect-src 'self' https://router.project-osrm.org https://nominatim.openstreetmap.org; font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
  // Allow static optimization for API routes if needed
  output: "standalone",
};

export default nextConfig;
