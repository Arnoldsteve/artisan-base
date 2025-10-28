import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
       {
        protocol: "https",
        hostname: "pqdkftosfeulneizqvmi.supabase.co", 
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", 
        port: "",
        pathname: "/**",
      },
    ],
  },

  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
