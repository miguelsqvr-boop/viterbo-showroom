'use client';

import { RecognitionSections } from './Recognition';

/**
 * Recognition (§8) — the studio's awards and press, in full, on their own route.
 *
 * The list itself now lives at the end of Studio, where the studio asked for
 * it: a visitor scrolls past the portrait and the words and reads what each
 * mark was actually for. This route renders the same pages from the same
 * component, so /recognition stays a working deep link — a QR code, a printed
 * card, the browser's own history — without becoming a second copy of the list
 * that drifts out of step with the first.
 */
export function RecognitionView() {
  return (
    <div
      data-scroll-root
      data-scroll-reset
      className="snap-y-page no-scrollbar h-full w-full overflow-y-auto"
    >
      <RecognitionSections />
    </div>
  );
}
