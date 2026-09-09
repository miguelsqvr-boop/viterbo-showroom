'use client';

import { useRef, useState } from 'react';
import { BRAND } from '@/config/brand';
import { PANEL } from '@/config/panel';
import { forceServiceWorkerRefresh } from '@/lib/sw';

/**
 * The Viterbo mark, and the hidden maintenance gesture behind it (§2).
 *
 * The studio's own artwork now, not the word set in Cormorant. Miguel asked
 * for the logo on 9 September and it was already in the repo, unused, at
 * `public/brand/` — `BRAND.logo` had been pointing at it since the brand file
 * was written.
 *
 * It is the wordmark line of that logo rather than the whole lockup, and that
 * is a size decision, not a preference. The full mark is three stacked lines —
 * GRACINHA VITERBO above, INTERIOR DESIGN | INTERIOR ARCHITECTURE below — and
 * the two small ones are 116px and 80px of a 736px file. In a bar 173px tall
 * the whole lockup fits at about 120px, which renders those lines at ten and
 * seven pixels: under half the 24px this panel sets as its floor for type a
 * visitor is meant to read. `viterbo_wordmark_charcoal.png` is the middle band
 * of the same file, cropped and not redrawn, so the letterforms are theirs.
 *
 * Five taps inside three seconds force the service worker to update and the
 * page to reload, so someone standing in the showroom can pull a fresh deploy
 * without touching Android settings. It is deliberately invisible: no ripple,
 * no counter, nothing a visitor could stumble into and be confused by.
 */
export function Wordmark({ className = '', height = 30 }: { className?: string; height?: number }) {
  const taps = useRef<number[]>([]);
  const [state, setState] = useState<'idle' | 'working'>('idle');

  function onPointerUp() {
    const now = performance.now();
    taps.current = [...taps.current, now].filter((t) => now - t < PANEL.forceRefreshWindowMs);
    if (taps.current.length >= PANEL.forceRefreshTapCount) {
      taps.current = [];
      setState('working');
      void forceServiceWorkerRefresh();
    }
  }

  return (
    <span
      onPointerUp={onPointerUp}
      data-wordmark
      /*
       * shrink-0 is load-bearing. Without it flexbox squeezed the mark to
       * 147px against its own 189 in the Portuguese bar — height held, width
       * did not, so the letterforms came out narrowed. A squashed logo is a
       * worse fault than a small one, and it only showed up in a measurement.
       */
      className={`inline-flex shrink-0 select-none items-center ${className}`}
      style={{ opacity: state === 'working' ? 0.35 : undefined }}
    >
      {/*
       * A plain <img>, not next/image: this is a fixed-size piece of chrome on
       * every screen, so there is nothing for the optimiser to decide and a
       * srcset for a 200px mark is work the panel does not need to do.
       */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND.wordmarkImage}
        alt={BRAND.wordmark}
        height={height}
        width={Math.round(height * BRAND.wordmarkAspect)}
        style={{ height, width: 'auto' }}
      />
    </span>
  );
}
