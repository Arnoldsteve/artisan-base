import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/storefront/:path*",
        destination: "/api/storefront/:path*", // Keep storefront routes local
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*", // Rewrite other API routes to backend
      },
    ];
  },
};

export default nextConfig;
