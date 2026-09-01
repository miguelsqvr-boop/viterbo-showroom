import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // The kiosk must never sit on a stale worker after a deploy.
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // §13 — exactly the three widths the brief budgets for. Nothing else is
    // ever generated, so a thumbnail can never be served a 2160px file.
    deviceSizes: [1080, 1620, 2160],
    imageSizes: [256, 540],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // This screen must never appear in search results.
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
