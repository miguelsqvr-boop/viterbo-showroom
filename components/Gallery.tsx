'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import type { Media } from '@/content/types';
import { mediaPoster } from '@/content/types';
import { PANEL } from '@/config/panel';
import { MediaFrame } from './MediaFrame';

/**
 * The horizontal swipe rail (§8), positioned inside the reach zone.
 *
 * A fixed number of consecutive slides stay mounted (§13); everything beyond
 * renders as its blur placeholder, so the decoded-bitmap count stays inside
 * the eight-image ceiling however long the gallery is.
 *
 * Six, and the window slides rather than centring on the selection. Slides are
 * sized by height, so the narrowest one — a 2:3 portrait at 15vh on a 1080px
 * panel — is about 213px wide with its padding, and just over five of those
 * fit on screen at once. A window centred on the selection truncates at the
 * ends: at slide 0 a symmetric ±2 mounts three slides while the visitor can
 * see five, and the rest sit there as empty boxes. Clamping a fixed-width
 * window to the ends instead keeps every visible slide mounted wherever the
 * rail is scrolled to. Six plus the hero is seven, inside the ceiling.
 */
const MOUNTED = 6;

export function Gallery({
  items,
  onOpen,
  heightVh,
  label,
}: {
  items: Media[];
  onOpen: (index: number) => void;
  heightVh: number;
  label: string;
}) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    // IR panels are imprecise near contact; a slightly higher threshold stops
    // a stationary tap being read as a flick.
    dragThreshold: PANEL.touchType === 'ir' ? 14 : 8,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on('select', onSelect);
    embla.on('reInit', onSelect);
    return () => {
      embla.off('select', onSelect);
      embla.off('reInit', onSelect);
    };
  }, [embla, onSelect]);

  return (
    <div className="w-full">
      {/*
       * The counter sits in the header, not under the rail. Below the rail it
       * lands within a percent of the navigation bar, and two pieces of quiet
       * type a hair apart read as a mistake.
       */}
      <div className="mb-14 flex items-baseline justify-between px-14">
        <span className="text-caption uppercase tracking-[0.2em] text-ink-faint">{label}</span>
        <span className="text-caption text-ink-faint">
          {selected + 1} / {items.length}
        </span>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y" style={{ height: `${heightVh}vh` }}>
          {items.map((media, index) => {
            const start = Math.min(
              Math.max(0, selected - 1),
              Math.max(0, items.length - MOUNTED),
            );
            const near = index >= start && index < start + MOUNTED;
            const poster = mediaPoster(media);
            /*
             * Slides are sized by height, not by a share of the width. A
             * landscape interior then keeps its own proportion instead of
             * being cropped to fit a portrait-shaped slot (§4), and the rail
             * shows the current image plus a peek of the next.
             */
            const width = `calc(${heightVh}vh * ${(poster.width / poster.height).toFixed(4)})`;
            return (
              <div
                key={`${media.kind}-${index}`}
                style={{ width, minWidth: width }}
                className="relative shrink-0 grow-0 px-3"
                onPointerUp={() => onOpen(index)}
                data-tap-target
                /* The acceptance harness looks inside these for empty slots. */
                data-slide={index + 1}
                aria-label={`${index + 1}`}
              >
                {near ? (
                  <MediaFrame
                    media={media}
                    mode="contain"
                    active={index === selected && media.kind === 'video'}
                    className="h-full w-full bg-ground-raised"
                  />
                ) : (
                  <div className="h-full w-full bg-ground-raised" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
