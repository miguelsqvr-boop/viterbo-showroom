'use client';

/**
 * Only one <video> element may be playing at any time (§13a).
 *
 * Video decode runs on the SoC's dedicated hardware decoder, so it does not
 * compete with the image budget in §13 — but a second concurrent stream on a
 * signage-grade chip does. Everything else shows its poster frame.
 */
const registry = new Set<HTMLVideoElement>();
let active: HTMLVideoElement | null = null;

export function claimPlayback(element: HTMLVideoElement) {
  registry.add(element);
  if (active && active !== element) release(active);
  active = element;
  const played = element.play();
  if (played) played.catch(() => { /* Autoplay can be refused before first touch; the poster stands in. */ });
}

export function release(element: HTMLVideoElement) {
  element.pause();
  // Drop the decoded buffer rather than leaving it resident.
  try {
    element.removeAttribute('src');
    element.load();
  } catch {
    /* Some WebViews throw on load() after removeAttribute; pausing is enough. */
  }
  registry.delete(element);
  if (active === element) active = null;
}
