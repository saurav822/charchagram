import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['blog-meme.blr1.digitaloceanspaces.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: async () => {
    return `charchamanch-${Date.now()}`;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://charchagrambackend.onrender.com/api/:path*'
      }
    ];
  }
};

export default nextConfig;
