'use client';

/**
 * Service worker plumbing (§2).
 *
 * The app is online and updates on deploy — that is the point. But a showroom
 * screen showing an offline dinosaur is worse than no screen, so everything is
 * served cache-first and the panel survives a Wi-Fi outage indefinitely.
 */

export async function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    // A kiosk reloads rarely. Check for a new deploy on a slow heartbeat.
    setInterval(() => void registration.update(), 15 * 60 * 1000);
    window.addEventListener('online', () => void registration.update());
  } catch {
    /* No worker means a live-network-only screen, not a broken one. */
  }
}

/** The five-tap gesture: take the newest deploy right now. */
export async function forceServiceWorkerRefresh() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    window.location.reload();
    return;
  }
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    }
  } catch {
    /* Fall through to the reload — it is the part that matters. */
  }
  window.location.reload();
}
