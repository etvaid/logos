/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8003';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/astro-api/:path*',
        destination: process.env.ASTRO_API_URL || 'http://localhost:8787/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
