'use client';

import { useEffect, useState } from 'react';
import { useLoadingProgress } from '@/lib/loading';

/**
 * A hairline of progress along the very top of the panel while photographs
 * are still arriving.
 *
 * Four pixels, accent gold, above everything including the navigation bar. It
 * is not chrome in the sense the reach rules mean: nothing can be tapped, it
 * occludes nothing — the bar sits in the first 4px of a 3840px screen — and it
 * is out of the way the moment the screen is ready.
 *
 * It waits 180ms before showing. A warm cache settles a screenful in well
 * under that, and a bar that flashes on every navigation reads as a fault
 * rather than as reassurance.
 */
const SHOW_AFTER_MS = 180;

export function LoadingBar() {
  const { progress, pending } = useLoadingProgress();
  const busy = pending > 0;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!busy) {
      /* Let the bar finish its run to 100% before it goes. */
      const done = window.setTimeout(() => setVisible(false), 260);
      return () => window.clearTimeout(done);
    }
    const start = window.setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(start);
  }, [busy]);

  /*
   * Never below a tenth: at the instant the first frame registers the fraction
   * is zero, and a bar of zero width is indistinguishable from a broken one.
   */
  const width = busy ? Math.max(0.1, progress) : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[4px]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 220ms ease' }}
    >
      <div
        className="h-full bg-accent"
        style={{ width: `${width * 100}%`, transition: 'width 320ms ease-out' }}
      />
    </div>
  );
}
