// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:8000/admin/:path*', // Proxy to FastAPI backend
      },
    ];
  },
};

module.exports = nextConfig;
