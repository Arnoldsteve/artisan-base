import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SECURITY: remotePatterns acts as a firewall for image optimization
    remotePatterns: [
       {
        protocol: "https",
        hostname: "pqdkftosfeulneizqvmi.supabase.co", // Your Primary Storage
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.com", // ✅ ADDED: Fixes the current runtime error
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // Dev Placeholders
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com", // Global Photography CDN (Wildcard support)
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Common placeholder service
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Performance Optimization for high-scale builds
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;