'use client';

import { useRef, useState } from 'react';
import { BRAND } from '@/config/brand';
import { PANEL } from '@/config/panel';
import { forceServiceWorkerRefresh } from '@/lib/sw';

/**
 * The Viterbo mark, and the hidden maintenance gesture behind it (§2).
 *
 * Five taps inside three seconds force the service worker to update and the
 * page to reload, so someone standing in the showroom can pull a fresh deploy
 * without touching Android settings. It is deliberately invisible: no ripple,
 * no counter, nothing a visitor could stumble into and be confused by.
 */
export function Wordmark({ className = '' }: { className?: string }) {
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
      className={`select-none ${className}`}
      style={{ opacity: state === 'working' ? 0.35 : undefined }}
    >
      {BRAND.wordmark}
    </span>
  );
}
