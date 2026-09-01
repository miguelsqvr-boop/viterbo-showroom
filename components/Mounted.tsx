'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Unmounts its children when they are more than one screen outside the
 * viewport (§13).
 *
 * CSS `visibility` is not enough — a hidden image stays decoded, and a decoded
 * 2160×3840 bitmap is ~33MB whatever the file weighs. On a 2GB signage box a
 * dozen of those is what a stuttering kiosk actually is.
 *
 * The wrapper keeps its own box (never `display: contents`) so the observer has
 * something to measure and so the scroll height does not collapse as cards
 * unmount underneath the finger.
 */
export function Mounted({
  children,
  placeholder,
  className = 'relative h-full w-full',
  rootMargin = '100% 0px',
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const root = element.closest('[data-scroll-root]');
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      root: root instanceof HTMLElement ? root : null,
      rootMargin,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} data-mounted={near ? 'yes' : 'no'}>
      {near ? children : placeholder ?? null}
    </div>
  );
}
