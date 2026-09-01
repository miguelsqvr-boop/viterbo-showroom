'use client';

import { useCallback, useRef } from 'react';
import { PANEL } from '@/config/panel';

/**
 * IR panels register a touch a few millimetres before contact and produce
 * spurious double-fires (§6). Every tap in the app goes through this.
 *
 * The debounce is trailing-edge-free on purpose: the first fire wins and is
 * immediate, so press feedback is never delayed by the guard.
 */
export function useTap<E extends { preventDefault?: () => void }>(
  handler: (event: E) => void,
  debounceMs: number = PANEL.tapDebounceMs,
) {
  const last = useRef(0);
  return useCallback(
    (event: E) => {
      const now = performance.now();
      if (now - last.current < debounceMs) return;
      last.current = now;
      handler(event);
    },
    [handler, debounceMs],
  );
}

/**
 * Double-tap detection, used instead of pinch on IR panels. Single-point and
 * deterministic — it always works, which pinch on IR does not.
 */
export function useDoubleTap(onDoubleTap: () => void, onSingleTap?: () => void, windowMs = 320) {
  const last = useRef(0);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(() => {
    const now = performance.now();
    if (now - last.current < windowMs) {
      if (pending.current) clearTimeout(pending.current);
      pending.current = null;
      last.current = 0;
      onDoubleTap();
      return;
    }
    last.current = now;
    if (onSingleTap) {
      pending.current = setTimeout(() => {
        pending.current = null;
        onSingleTap();
      }, windowMs);
    }
  }, [onDoubleTap, onSingleTap, windowMs]);
}
