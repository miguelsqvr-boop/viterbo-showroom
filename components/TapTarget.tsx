'use client';

import type { ReactNode } from 'react';
import { PANEL } from '@/config/panel';
import { useTap } from '@/lib/tap';

/**
 * The only tappable primitive in the app.
 *
 * It enforces the touch-target floor (§15), applies the IR debounce (§6), and
 * gives sub-frame press feedback — the panel's touch latency is unpublished
 * and assumed to be 60–120ms, so the press state must land before anything
 * else does (§1).
 */
export function TapTarget({
  children,
  onTap,
  className = '',
  label,
  minSize = PANEL.minTouchTarget,
  full = false,
  enabled = true,
}: {
  children: ReactNode;
  onTap: () => void;
  className?: string;
  label: string;
  minSize?: number;
  full?: boolean;
  /**
   * A target that has scrolled out of the reach envelope is not a target.
   * Rendering it as a plain box — no handler, no `data-tap-target` — is what
   * keeps "below 70% is display-only, never a button" true at every scroll
   * position rather than only at the snapped one.
   */
  enabled?: boolean;
}) {
  const handle = useTap(() => onTap());

  if (!enabled) {
    return (
      <div
        aria-hidden
        className={`relative flex items-center ${full ? 'w-full' : ''} ${className}`}
        style={{ minHeight: minSize, minWidth: full ? undefined : minSize }}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      data-tap-target
      onPointerUp={handle}
      className={`press relative flex items-center ${full ? 'w-full' : ''} ${className}`}
      style={{ minHeight: minSize, minWidth: full ? undefined : minSize }}
    >
      {children}
    </button>
  );
}
