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
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const backendUrl = apiUrl.replace('/api/v1', '');
    return [
      {
        source: '/public/uploads/:path*',
        destination: `${backendUrl}/public/uploads/:path*`,
      },
    ];
  },
  // Next.js 16 — use cache directive
  experimental: {
    // reactCompiler: true, // aktifkan setelah stable
  },
};

export default nextConfig;
