import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Viterbo — Showroom',
  description: 'Viterbo Interior Design, Cascais.',
  // This screen must never appear in search results.
  robots: { index: false, follow: false, nocache: true },
  manifest: '/manifest.webmanifest',
  applicationName: 'Viterbo Showroom',
};

/**
 * §5 — pin the CSS viewport to 1080 so Android's display density stops
 * mattering. Whether the panel reports 1080 @ dpr 2 or 2160 @ dpr 1, the app
 * lays out in the same 1080 space and the browser upsamples to the 2160
 * physical pixels. Every type size in the brief is then correct as written.
 */
export const viewport: Viewport = {
  width: 1080,
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: '#14120F',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full w-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
