import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' https://ssl.gstatic.com https://accounts.google.com 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://images-na.ssl-images-amazon.com https://m.media-amazon.com;
              connect-src 'self';
              font-src 'self';
            `.replace(/\n/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
