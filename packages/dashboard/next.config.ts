import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pqdkftosfeulneizqvmi.supabase.co', // Your specific Supabase project hostname
        port: '',
        pathname: '/storage/v1/object/public/**', // Allow any image from public storage
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;