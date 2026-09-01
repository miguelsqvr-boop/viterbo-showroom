'use client';

import { useEffect, useRef, useState } from 'react';
import { PRIME } from '@/config/layout';

/**
 * Which card is currently resting inside the prime band.
 *
 * The collection always has a card peeking below the fold, and its name block
 * lands around 90% of screen height — comfortably inside the zone the brief
 * calls furniture rather than interface. Only the card the reach zone is
 * actually pointing at gets to be tappable.
 */
export function useActiveCard(count: number) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return;
    const root = nodes[0].closest('[data-scroll-root]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = refs.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      {
        root: root instanceof HTMLElement ? root : null,
        // The prime band, expressed as the only slice of the scrollport that counts.
        rootMargin: `-${PRIME.top}% 0px -${100 - PRIME.bottom}% 0px`,
        threshold: 0,
      },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [count]);

  return {
    active,
    register: (index: number) => (element: HTMLElement | null) => {
      refs.current[index] = element;
    },
  };
}
