/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8003/api/:path*',
      },
      {
        source: '/astro-api/:path*',
        destination: process.env.ASTRO_API_URL || 'http://localhost:8787/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
