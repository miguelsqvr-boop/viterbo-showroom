import type { ReactNode } from 'react';
import { PRIME } from '@/config/layout';

/**
 * Every primary control renders inside this (§3).
 *
 * The band is 28%–55% from the top of the panel — the overlap between
 * comfortable gaze (125–177cm) and comfortable reach (100–165cm) on a
 * 181cm totem. This is the upper half of the screen, which feels wrong to
 * anyone who has built for phones, and is correct here.
 */
export function PrimeBand({
  children,
  className = '',
  align = 'center',
}: {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}) {
  const justify =
    align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center';
  return (
    <div
      data-prime-band
      className={`pointer-events-none absolute inset-x-0 z-20 flex flex-col ${justify} ${className}`}
      style={{ top: `${PRIME.top}%`, bottom: `${100 - PRIME.bottom}%` }}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}
