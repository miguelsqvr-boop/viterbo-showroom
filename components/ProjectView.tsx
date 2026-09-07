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
/** The band a gallery frame is centred in, leaving the counter its line. */
const FRAME_TOP = TOP + 5;
const FRAME_BOTTOM = 98;

/**
 * A project (§8).
 *
 * One thing to a screenful, scrolled vertically, and that thing is a
 * photograph. Miguel's brief arrived in two parts: "seamless, big images each
 * to scroll, very minimal text, easy to go back", and then "no text in the
 * projects, just the location". So a project is its hero carrying one line —
 * the place — and after that nothing but frames, each at the largest size the
 * file honestly supports.
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
           * The place, and nothing else. Set at the section size rather than
           * the hero size: it is a caption on a photograph, not a title, and
           * the project's name is on the card the visitor just tapped.
           *
           * A banded hero's line sits at 52%, below the back control at 44%; a
           * full-bleed one at 29%, above it. Either way the type and the one
           * persistent control on the screen do not fight for the same pixels
           * — `npm run verify` measures the two against each other.
           */}
          <div className="absolute inset-x-0 px-14" style={{ top: heroIsPortrait ? '29%' : '52%' }}>
            <h1 className={`text-section ${heroIsPortrait ? 'text-on-media' : 'text-ink'}`}>
              {s(project.location)}
            </h1>
          </div>
        </section>

        {/* ---- One screenful per frame ---------------------------------- */}
        {project.gallery.map((frame, i) => (
          <section
            key={mediaPoster(frame).src}
            data-slide={String(i + 1)}
            className="snap-start-page relative h-full w-full"
          >
            {canFullBleed(frame) ? (
              <Mounted className="absolute inset-0" rootMargin="100% 0px">
                <MediaFrame media={frame} mode="bleed" active className="h-full w-full" />
              </Mounted>
            ) : (
              /*
               * As wide as the panel and as tall as the file allows, centred in
               * the space under the bar. No crop: an interior photographed in
               * landscape is a room, and cropping it to a portrait frame throws
               * away the half of the room the photographer chose to include.
               * "Big" here means the largest the source supports without being
               * upscaled, which on this panel is genuinely big — a 4:3 frame is
               * 1080 × 810, a portrait one 1080 × 1440.
               */
              <Mounted
                className="absolute inset-x-0 w-full"
                rootMargin="100% 0px"
                style={{ top: `${frameTop(frame)}%`, height: panelVh(frameHeight(frame)) }}
              >
                <MediaFrame media={frame} mode="band" active className="h-full w-full" />
              </Mounted>
            )}

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
  return Math.min(natural, FRAME_BOTTOM - FRAME_TOP);
}

/**
 * Where a frame sits, in percent from the top.
 *
 * Centred on 47% rather than on the middle of the available band. The panel is
 * 95cm of glass standing 82cm off the floor, so its middle is not where a
 * standing visitor is looking: 47% is around 132cm, which is inside the
 * comfortable gaze zone (§3). A frame hung there reads as hung rather than as
 * floating, and the space it leaves is at the bottom, which is the part of a
 * totem nobody looks at anyway. Clamped so it never rides up under the bar or
 * off the end of the panel.
 */
const FRAME_CENTRE = 47;

function frameTop(frame: Media): number {
  const height = frameHeight(frame);
  const centred = FRAME_CENTRE - height / 2;
  return Math.min(Math.max(centred, FRAME_TOP), FRAME_BOTTOM - height);
}
