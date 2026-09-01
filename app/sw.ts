/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, ExpirationPlugin, NetworkOnly, Serwist } from 'serwist';

/**
 * Service worker (§2).
 *
 * This is not offline-first architecture; it is an online app that does not
 * embarrass you. The screen is hosted and picks up a deploy on the next
 * revalidation — but a showroom panel showing a Chrome offline dinosaur is
 * worse than no screen, so everything is served from cache first and the
 * network is only ever an update mechanism.
 */

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    /*
     * §13a — never precache video. Range requests are what make a <video>
     * seekable, and a handful of clips would blow the cache quota that the
     * stills depend on. Poster frames are precached instead, so a cold start
     * with no network shows stills rather than black rectangles.
     */
    {
      matcher: ({ request }) => request.destination === 'video',
      handler: new NetworkOnly(),
    },
    {
      // Optimised images are immutable per URL, so cache-first is safe and the
      // panel never re-fetches a hero it has already seen.
      matcher: ({ url }) => url.pathname.startsWith('/_next/image'),
      handler: new CacheFirst({
        cacheName: 'viterbo-images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 400,
            maxAgeSeconds: 60 * 60 * 24 * 365,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

// The five-tap gesture on the Viterbo mark asks the waiting worker to take over.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') void self.skipWaiting();
});

serwist.addEventListeners();
