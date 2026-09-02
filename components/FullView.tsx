'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import type { Media } from '@/content/types';
import { PANEL } from '@/config/panel';
import { PRIME } from '@/config/layout';
import { useDoubleTap } from '@/lib/tap';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';
import { TapTarget } from './TapTarget';

/**
 * Full view (§8) — full bleed on black, swipe left/right, tap to close.
 *
 * Zoom follows §6. On IR, pinch is dropped entirely: it registers a touch
 * before contact and is jittery on multi-touch, so double-tap to 2× and
 * double-tap to reset is used instead. Deterministic, single-point, always
 * works. Set PANEL.touchType to 'pcap' after diagnostics to get pinch back.
 */
export function FullView({
  items,
  startIndex,
  onClose,
}: {
  items: Media[];
  startIndex: number;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const [emblaRef, embla] = useEmblaCarousel({ startIndex, align: 'center', loop: false });
  const [selected, setSelected] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);

  const onSelect = useCallback(() => {
    if (embla) {
      setSelected(embla.selectedScrollSnap());
      setZoomed(false);
    }
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla, onSelect]);

  // While zoomed the rail must not steal the drag.
  useEffect(() => {
    embla?.reInit({ watchDrag: !zoomed, startIndex: embla.selectedScrollSnap(), align: 'center' });
  }, [embla, zoomed]);

  const handleTap = useDoubleTap(
    () => setZoomed((z) => !z),
    () => onClose(),
  );

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black"
      /* The harness skips the gallery rail while this is up — it is opaque. */
      data-overlay="full-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {items.map((media, index) => (
            <div
              key={index}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
              onPointerUp={handleTap}
            >
              {Math.abs(index - selected) <= 1 ? (
                <motion.div
                  className="h-full w-full"
                  animate={{ scale: index === selected && zoomed ? 2 : 1 }}
                  transition={{ type: 'tween', duration: 0.24, ease: 'easeOut' }}
                >
                  <MediaFrame
                    media={media}
                    mode="contain"
                    active={index === selected}
                    className="h-full w-full"
                  />
                </motion.div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/*
       * Counter, hint and a real close button, all inside the reach envelope.
       * Tapping the image closes too, but a gesture nobody is told about is
       * not an affordance — and the label it replaced was 16px and invisible.
       */}
      <div className="absolute inset-x-0" style={{ top: `${PRIME.bottom + 3}%` }}>
        <div
          className="control-scrim pointer-events-none absolute inset-x-0 -top-20 -bottom-20"
          aria-hidden
        />
        <div className="relative flex items-center justify-between px-14">
        <span className="text-caption text-white/75">
          {selected + 1} / {items.length}
        </span>
        <div className="flex items-center gap-10">
          <AnimatePresence>
            {!PANEL.enablePinchZoom && !zoomed ? (
              <motion.span
                className="text-caption text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {t('zoomHint')}
              </motion.span>
            ) : null}
          </AnimatePresence>
          <TapTarget
            label={t('close')}
            onTap={onClose}
            className="justify-center rounded-[6px] border border-white/45 px-10"
          >
            <span className="text-caption text-white/95">{t('close')}</span>
          </TapTarget>
        </div>
        </div>
      </div>
    </motion.div>
  );
}
