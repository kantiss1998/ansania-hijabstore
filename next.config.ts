import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.placeholder.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Next.js 16 — use cache directive
  experimental: {
    // reactCompiler: true, // aktifkan setelah stable
  },
};

export default nextConfig;
