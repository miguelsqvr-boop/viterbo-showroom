'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CHROME } from '@/config/layout';
import { PHYSICAL } from '@/config/panel';
import type { Media, Project } from '@/content/types';
import { canFullBleed, mediaPoster } from '@/content/types';
import { useLocale } from '@/lib/locale';
import { panelVh } from '@/lib/panel';
import { MediaFrame } from './MediaFrame';
import { Mounted } from './Mounted';
import { TapTarget } from './TapTarget';

/** Everything below the navigation bar. */
const TOP = CHROME.barTop + CHROME.barHeight;
/** Where a frame comes to rest when it snaps. */
const FRAME_TOP = TOP + 3;
/**
 * How tall a frame may be. Short of the full panel on purpose: the point of the
 * stack is that the next photograph is already showing at the bottom of the
 * screen, and a frame that fills the panel hides it.
 */
const FRAME_MAX = 74;
/** Ground between one frame and the next. Enough to separate, not to divide. */
const FRAME_GAP = 5;

/**
 * A project (§8).
 *
 * One thing to a screenful, scrolled vertically, and that thing is a
 * photograph. Miguel's brief arrived in three parts: "seamless, big images
 * each to scroll, very minimal text, easy to go back"; then "no text in the
 * projects, just the location"; then "put the short text in the beginning and
 * the images from each project must be very close so the viewer knows he can
 * scroll down for more images".
 *
 * So: the hero carries the place and the short text, once, at the start. After
 * that nothing but frames, each at the largest size the file honestly supports,
 * stacked close enough that the next one is always already showing at the
 * bottom of the screen. That peek is the whole reason a frame stops short of
 * filling the panel — on a kiosk with no scrollbar it is the only thing that
 * says the project continues.
 *
 * What that removed, in order: a 15vh horizontal rail of thumbnails that
 * opened a lightbox (on a 43" panel those slides were postage stamps and the
 * lightbox was a second way to get lost); then the project name, the typology
 * and year line, the narrative and the facts strip. The name and place are on
 * the card the visitor tapped to get here, and the words are still in
 * content/projects.ts if the studio wants them back — nothing was deleted from
 * the content model, only from the screen.
 *
 * The counter went with them. It was five characters of wayfinding, and five
 * characters is text.
 */
export function ProjectView({ project }: { project: Project }) {
  const router = useRouter();
  const { s, t } = useLocale();
  /*
   * Full bleed is earned by composition AND resolution — see canFullBleed.
   * A vertical frame from an older shoot still gets the band treatment rather
   * than being stretched across 3840 physical pixels.
   */
  const heroIsPortrait = canFullBleed(project.hero);

  // Edge-swipe from the left as a shortcut back — never the only route back.
  useEffect(() => {
    let startX: number | null = null;
    let startY = 0;
    const down = (event: PointerEvent) => {
      startX = event.clientX <= 48 ? event.clientX : null;
      startY = event.clientY;
    };
    const up = (event: PointerEvent) => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      const dy = Math.abs(event.clientY - startY);
      startX = null;
      if (dx > 140 && dy < 120) router.push('/');
    };
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [router]);

  return (
    <>
      <div
        data-scroll-root
        data-scroll-reset
        className="snap-y-page no-scrollbar h-full w-full overflow-y-auto"
        /*
         * Where a frame comes to rest: just under the navigation bar, with the
         * next one already showing below. scrollPaddingTop is what puts it
         * there on every snap after the first.
         */
        style={{ scrollPaddingTop: panelVh(FRAME_TOP) }}
      >
        {/* ---- Screenful one: hero, name, place ------------------------ */}
        <section className="snap-start-page relative h-full w-full">
          {heroIsPortrait ? (
            <>
              {/* A hero with genuine vertical composition earns the full frame. */}
              <div className="absolute inset-0">
                <MediaFrame media={project.hero} mode="bleed" priority className="h-full w-full" />
              </div>
              <div className="media-scrim absolute inset-0" />
            </>
          ) : (
            /*
             * Landscape photography does not fill a portrait frame, and
             * cropping it to fit cuts the room in half. It takes a full-width
             * band instead, and the space above and below is where the
             * typography breathes — which is what a print spread does with
             * the same problem (§4).
             */
            <div
              className="absolute inset-x-0 w-full"
              style={{ top: `${TOP}%`, height: panelVh(30) }}
            >
              <MediaFrame media={project.hero} mode="band" priority className="h-full w-full" />
            </div>
          )}

          {/*
           * A full-bleed hero carries its own scrim, so its type is light —
           * a light-ground app still sets light type on a photograph, because
           * it is the only thing that reads over an image whose tone nobody
           * controls. A banded hero sits on the ground and takes ink.
           */}
          {/*
           * The place and the short text, and this is the only screenful in the
           * project that carries either. The place is set at the section size
           * rather than the hero size: it is a caption on a photograph, and the
           * project's name is on the card the visitor just tapped.
           *
           * A banded hero's block sits at 55%, below the back control; a
           * full-bleed one at 26%, above it. Either way the type and the one
           * persistent control on the screen do not fight for the same pixels —
           * `npm run verify` measures every floating control against the type
           * behind it.
           */}
          <div className="absolute inset-x-0 px-14" style={{ top: heroIsPortrait ? '26%' : '55%' }}>
            <h1 className={`text-section ${heroIsPortrait ? 'text-on-media' : 'text-ink'}`}>
              {s(project.location)}
            </h1>
            <p
              className={`mt-6 text-body ${heroIsPortrait ? 'text-on-media/90' : 'text-ink-muted'}`}
              style={{ maxWidth: 760 }}
            >
              {s(project.narrative)}
            </p>
          </div>
        </section>

        {/* ---- The stack: one frame after another, close ----------------- */}
        {project.gallery.map((frame, i) => (
          <section
            key={mediaPoster(frame).src}
            data-slide={String(i + 1)}
            className="snap-start-page relative w-full"
            style={{ height: panelVh(frameHeight(frame) + FRAME_GAP) }}
          >
            {/*
             * The frame owns the top of its own section and the gap sits under
             * it, so what shows below the fold is always the beginning of the
             * next photograph rather than a band of empty ground.
             *
             * No crop: an interior photographed in landscape is a room, and
             * cropping it to a portrait frame throws away the half of the room
             * the photographer chose to include. "Big" here means the largest
             * the source supports without being upscaled, which on this panel is
             * genuinely big — a 4:3 frame is 1080 x 810.
             */}
            <Mounted
              className="relative w-full"
              rootMargin="100% 0px"
              style={{ height: panelVh(frameHeight(frame)) }}
            >
              <MediaFrame media={frame} mode="band" active className="h-full w-full" />
            </Mounted>
          </section>
        ))}
      </div>

      {/*
       * The way out, on every screenful of the project.
       *
       * "Projects" in the navigation bar has always done this, but the bar is
       * pinned to the top of a 181cm totem — around 175cm, above shoulder
       * height — and after six flicks through photography a visitor should not
       * have to reach for it. This sits at the left edge in the middle of the
       * reach envelope, frosted like the bar so it stays legible over whatever
       * photograph is behind it, and it is the one control that never moves.
       */}
      <div data-occluder className="fixed left-0 z-40" style={{ top: '44%' }}>
        <TapTarget
          label={t('backToProjects')}
          onTap={() => router.push('/')}
          className="justify-center rounded-r-[6px] border border-l-0 border-hairline bg-ground/70 pl-8 pr-9 backdrop-blur-[18px]"
        >
          <span className="flex items-center gap-4 text-meta text-ink-muted">
            <svg width="30" height="18" viewBox="0 0 30 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M29 9 H2 M10 1 L2 9 L10 17" />
            </svg>
            {t('backToProjects')}
          </span>
        </TapTarget>
      </div>
    </>
  );
}

/** How tall a frame may be, in panel heights, without being upscaled or cropped. */
function frameHeight(frame: Media): number {
  const poster = mediaPoster(frame);
  const natural =
    ((PHYSICAL.cssWidth / (poster.width / poster.height)) / PHYSICAL.cssHeight) * 100;
  return Math.min(natural, FRAME_MAX);
}
