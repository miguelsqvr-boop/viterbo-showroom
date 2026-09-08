'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useLoadingActions } from '@/lib/loading';
import type { Media } from '@/content/types';
import { mediaPoster } from '@/content/types';
import { useLocale } from '@/lib/locale';
import { claimPlayback, release } from '@/lib/video';

/**
 * The one place an image or a clip is put on screen.
 *
 * `sizes` is not decoration — it is what stops a 2160px file being served to a
 * collection thumbnail (§13). next/image is configured to emit exactly the
 * three widths the brief budgets for, so the browser picks from 1080 / 1620 /
 * 2160 and nothing else exists to pick wrongly.
 */
export type MediaMode = 'band' | 'bleed' | 'contain';

const SIZES: Record<MediaMode, string> = {
  // A collection band is full width in the pinned 1080 space.
  band: '1080px',
  bleed: '2160px',
  contain: '1620px',
};

export function MediaFrame({
  media,
  mode,
  focus = 50,
  priority = false,
  eager = false,
  active = true,
  className = '',
  style,
}: {
  media: Media;
  mode: MediaMode;
  /**
   * Vertical focal point of the crop, as a percentage down the source.
   *
   * A band is far wider than a portrait source, so `cover` throws most of the
   * height away. Centred (the 50% default) that cuts the heads off a
   * photograph of people, and `top` overshoots into the ceiling — the subject
   * is usually neither, so this takes a number rather than three keywords.
   */
  focus?: number;
  priority?: boolean;
  /**
   * Load as soon as the element exists, rather than waiting for the browser's
   * own lazy-loading margin.
   *
   * For anything wrapped in `Mounted`, laziness is not only redundant but
   * harmful: `Mounted` has already decided the frame is within a screen of the
   * viewport, and the browser then waits again before fetching. On the project
   * stack that showed up as a photograph you had scrolled to still being blank
   * — caught by the blank-slide check, which is exactly what it is for.
   */
  eager?: boolean;
  /** Videos play only when they are the active item; everything else is a poster. */
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { s } = useLocale();
  const poster = mediaPoster(media);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /*
   * What feeds the loading bar.
   *
   * Registering happens in a layout effect rather than during render: a frame
   * counting itself while it renders would set state on the provider from
   * inside another component's render pass, which React refuses outright. The
   * effect runs before paint and the browser has only just been handed the
   * <img>, so nothing is missed by waiting for it.
   *
   * The `complete` check is the case that would otherwise hang the bar for
   * ever: a cached photograph fires its load event before this effect runs, so
   * it would be counted as outstanding with nothing left to settle it.
   */
  const loading = useLoadingActions();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const settle = () => loading?.settle(poster.src);
  useEffect(() => {
    if (!loading) return;
    loading.register(poster.src);
    if (imageRef.current?.complete) loading.settle(poster.src);
    // Only the src matters: the provider keys everything by it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poster.src]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || media.kind !== 'video') return;
    if (active) {
      if (!element.getAttribute('src')) element.setAttribute('src', media.src.mp4);
      claimPlayback(element);
    } else {
      release(element);
    }
    return () => {
      if (element) release(element);
    };
  }, [active, media]);

  const fit = mode === 'contain' ? 'object-contain' : 'object-cover';
  const objectPosition = `50% ${focus}%`;

  /*
   * The frame is ALWAYS `relative` — `fill` images need a positioned ancestor,
   * and Tailwind emits `.relative` after `.absolute`, so a caller passing
   * "absolute inset-0" here would lose the argument and collapse the box to
   * zero height. Callers that need it positioned wrap it instead.
   */
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {media.kind === 'video' ? (
        <>
          {/* The poster is a still of frame one, so entering playback is invisible. */}
          <Image
            src={poster.src}
            alt={s(poster.alt)}
            fill
            sizes={SIZES[mode]}
            placeholder="blur"
            blurDataURL={poster.blurDataURL}
            priority={priority}
            loading={priority ? undefined : eager ? 'eager' : undefined}
            onLoad={settle}
            onError={settle}
            className={fit}
            style={{ objectPosition }}
          />
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={poster.src}
            className={`absolute inset-0 h-full w-full ${fit} transition-opacity duration-500`}
            style={{ opacity: active ? 1 : 0, objectPosition }}
          >
            {active ? <source src={media.src.webm} type="video/webm" /> : null}
          </video>
        </>
      ) : (
        <Image
          src={media.src}
          alt={s(media.alt)}
          fill
          sizes={SIZES[mode]}
          placeholder="blur"
          blurDataURL={media.blurDataURL}
          priority={priority}
          loading={priority ? undefined : eager ? 'eager' : undefined}
          onLoad={settle}
          onError={settle}
          className={fit}
          style={{ objectPosition }}
        />
      )}
    </div>
  );
}
