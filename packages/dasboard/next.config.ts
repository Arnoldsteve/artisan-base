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