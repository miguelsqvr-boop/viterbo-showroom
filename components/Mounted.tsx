'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

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
 *
 * Keeping a box is not the same as keeping a *height*, and the difference cost
 * a bug: the collection gave the height to the image inside rather than to the
 * wrapper, so an unmounted card was 26vh shorter than a mounted one. On a cold
 * load — which is every load, after the attract loop resets to the top — the
 * cards below the fold were short, every snap position was 499px out, and the
 * card resting in the prime band was nobody. That is "View project does
 * nothing" as a visitor experiences it. Whatever a caller wraps, the wrapper
 * must be the same size mounted or not: pass the height here, not to the child.
 */
export function Mounted({
  children,
  placeholder,
  className = 'relative h-full w-full',
  rootMargin = '100% 0px',
  style,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
  rootMargin?: string;
  /** Reserve the child's box here, so unmounting never changes the layout. */
  style?: CSSProperties;
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
    <div ref={ref} className={className} style={style} data-mounted={near ? 'yes' : 'no'}>
      {near ? children : placeholder ?? null}
    </div>
  );
}
