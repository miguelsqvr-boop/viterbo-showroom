'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ATTRACT } from '@/content/attract';
import { PANEL } from '@/config/panel';
import { PRIME } from '@/config/layout';
import { useIdle } from '@/lib/idle';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';

/**
 * The attract loop (§8).
 *
 * Full-bleed, no chrome, crossfading every 7s over 1.2s with a barely
 * perceptible scale drift so the screen reads as alive rather than animated.
 * Each frame carries its place name and nothing else — someone who stands
 * here for forty seconds and never touches the screen still learns the most
 * important thing about the studio.
 */
export function AttractLoop() {
  const { attracting, wake } = useIdle();
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  /*
   * The touch that wakes the screen is consumed (§8) — and consuming the
   * pointerdown is not enough on its own. Dismissing the loop on the press
   * leaves the matching pointerup to land on whatever is now underneath the
   * finger, which on this layout is the navigation bar: one tap on the
   * attract loop and a visitor is looking at the Studio screen without
   * having chosen it. So an invisible blocker stays in place until the
   * gesture that woke the screen has finished.
   */
  const [swallowing, setSwallowing] = useState(false);

  useEffect(() => {
    if (!swallowing) return;
    const done = () => setSwallowing(false);
    window.addEventListener('pointerup', done, { capture: true, once: true });
    window.addEventListener('pointercancel', done, { capture: true, once: true });
    // A touch that never reports its release must not strand the screen.
    const failsafe = setTimeout(done, 900);
    return () => {
      window.removeEventListener('pointerup', done, { capture: true });
      window.removeEventListener('pointercancel', done, { capture: true });
      clearTimeout(failsafe);
    };
  }, [swallowing]);

  useEffect(() => {
    if (!attracting) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % ATTRACT.length), PANEL.attract.holdMs);
    return () => clearInterval(timer);
  }, [attracting]);

  // Preload one ahead, never the whole loop (§13).
  useEffect(() => {
    if (!attracting) return;
    const next = ATTRACT[(index + 1) % ATTRACT.length];
    const poster = next.media.kind === 'video' ? next.media.poster : next.media;
    const img = new window.Image();
    img.src = poster.src;
  }, [attracting, index]);

  if (!attracting) {
    return swallowing ? (
      <div
        className="fixed inset-0 z-[55]"
        onPointerUpCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setSwallowing(false);
        }}
        onClickCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      />
    ) : null;
  }

  const frame = ATTRACT[index];

  return (
    <div
      className="fixed inset-0 z-50 bg-ground"
      /*
       * The touch that wakes the screen is consumed here and must not reach
       * whatever is underneath (§8). Capturing on pointerdown rather than
       * click also hides the panel's touch latency: the loop is gone before
       * a click event would have been synthesised.
       */
      onPointerDownCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSwallowing(true);
        wake();
      }}
    >
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: PANEL.attract.crossfadeMs / 1000, ease: 'linear' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: PANEL.attract.scaleFrom }}
            animate={{ scale: PANEL.attract.scaleTo }}
            transition={{
              duration: (PANEL.attract.holdMs + PANEL.attract.crossfadeMs) / 1000,
              ease: 'linear',
            }}
          >
            <MediaFrame media={frame.media} mode="bleed" priority className="h-full w-full" />
          </motion.div>
          <div className="media-scrim absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      {/* Touch to explore sits inside the prime band — it doubles as a target hint. */}
      <div
        className="absolute inset-x-0 z-10 flex items-center justify-center"
        style={{ top: `${PRIME.top}%`, height: `${PRIME.bottom - PRIME.top}%` }}
      >
        <motion.span
          className="text-body tracking-[0.24em] text-on-media"
          animate={{ opacity: [0.45, 0.95, 0.45] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t('touchToExplore')}
        </motion.span>
      </div>

      {/* The place name, low in the frame. Nothing else. */}
      <div className="absolute inset-x-0" style={{ top: '78%' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={frame.place}
            className="px-14 text-section text-on-media"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: PANEL.attract.crossfadeMs / 1000 }}
          >
            {frame.place}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
