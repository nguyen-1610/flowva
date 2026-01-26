import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Để hiển thị avatar Google login
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Để hiển thị ảnh mock từ components
      },
    ],
  },
};

export default nextConfig;