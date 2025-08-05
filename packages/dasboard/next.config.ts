import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'pqdkftosfeulneizqvmi.supabase.co', // Your specific Supabase project hostname
        port: '',
        pathname: '/storage/v1/object/public/**', // Allow any image from public storage
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/dashboard/:path*',
        destination: '/api/dashboard/:path*', // Keep dashboard routes local
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*', // Rewrite other API routes
      },
    ];
  },
};

export default nextConfig;