'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PANEL } from '@/config/panel';

/**
 * Idle → attract loop (§15: "After 90s idle, returns to attract loop with all
 * state cleared").
 *
 * "All state cleared" is taken literally: the router goes home, every scroll
 * container is reset, and the locale returns to the default so the next
 * visitor does not inherit the last one's language.
 */

type IdleContextValue = {
  attracting: boolean;
  /** Any touch anywhere resets the countdown. */
  poke: () => void;
  /** Leave the attract loop. The touch that does this is consumed. */
  wake: () => void;
  /** Force the attract loop, e.g. from the diagnostics overlay. */
  sleep: () => void;
};

const IdleContext = createContext<IdleContextValue | null>(null);

export function IdleProvider({
  children,
  onReset,
}: {
  children: React.ReactNode;
  onReset?: () => void;
}) {
  const [attracting, setAttracting] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const sleep = useCallback(() => {
    clear();
    setAttracting(true);
    if (pathnameRef.current !== '/') router.push('/');
    document
      .querySelectorAll<HTMLElement>('[data-scroll-reset]')
      .forEach((el) => el.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
    onReset?.();
  }, [clear, onReset, router]);

  const arm = useCallback(() => {
    clear();
    timer.current = setTimeout(sleep, PANEL.idleTimeoutMs);
  }, [clear, sleep]);

  const poke = useCallback(() => {
    if (!attracting) arm();
  }, [arm, attracting]);

  const wake = useCallback(() => {
    setAttracting(false);
    arm();
  }, [arm]);

  useEffect(() => {
    if (attracting) {
      clear();
      return;
    }
    arm();
    return clear;
  }, [attracting, arm, clear]);

  // Any interaction anywhere restarts the countdown. Capture phase so a
  // handler that stops propagation cannot strand the screen on an inner page.
  useEffect(() => {
    const events: Array<keyof DocumentEventMap> = ['pointerdown', 'touchstart', 'wheel', 'keydown'];
    const handler = () => poke();
    events.forEach((event) => document.addEventListener(event, handler, { capture: true, passive: true }));
    return () =>
      events.forEach((event) => document.removeEventListener(event, handler, { capture: true }));
  }, [poke]);

  const value = useMemo(() => ({ attracting, poke, wake, sleep }), [attracting, poke, sleep, wake]);
  return <IdleContext.Provider value={value}>{children}</IdleContext.Provider>;
}

export function useIdle(): IdleContextValue {
  const ctx = useContext(IdleContext);
  if (!ctx) throw new Error('useIdle must be used inside IdleProvider');
  return ctx;
}
