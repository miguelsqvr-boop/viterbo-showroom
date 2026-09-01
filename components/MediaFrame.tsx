'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
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
  priority = false,
  active = true,
  className = '',
  style,
}: {
  media: Media;
  mode: MediaMode;
  priority?: boolean;
  /** Videos play only when they are the active item; everything else is a poster. */
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { s } = useLocale();
  const poster = mediaPoster(media);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
            className={`${fit} object-center`}
          />
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={poster.src}
            className={`absolute inset-0 h-full w-full ${fit} object-center transition-opacity duration-500`}
            style={{ opacity: active ? 1 : 0 }}
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
          className={`${fit} object-center`}
        />
      )}
    </div>
  );
}
