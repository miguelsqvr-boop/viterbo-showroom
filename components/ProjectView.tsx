'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
 * How tall the opening screenful is.
 *
 * Short of the panel for the same reason every frame in the stack is: what
 * shows below the fold has to be the beginning of the next photograph. At 100
 * the hero filled the screen and the project looked like one picture and a
 * caption — the studio said so, and it was right. 88 leaves a hand's width of
 * the first gallery frame showing at the bottom.
 */
const HERO_HEIGHT = 88;

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
   * The cue belongs to the opening screenful and to nothing else. Left in the
   * DOM it scrolls up with the hero and comes to rest behind the navigation
   * bar — "Scroll" sitting under "Projects", which the suite reports as type
   * under chrome and which is exactly what it looks like. So it is unmounted
   * the moment the visitor does the thing it asks for.
   */
  const scroller = useRef<HTMLDivElement | null>(null);
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const onScroll = () => setAtTop(element.scrollTop < 24);
    element.addEventListener('scroll', onScroll, { passive: true });
    return () => element.removeEventListener('scroll', onScroll);
  }, []);
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
        ref={scroller}
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
        {/*
         * Not the full panel: HERO_HEIGHT leaves the top of the first gallery
         * frame showing under it.
         *
         * The studio said it was not obvious you can scroll here, and it was
         * right. Every other screenful in the project already ends short so the
         * next photograph peeks — that peek is the only thing on a kiosk with
         * no scrollbar that says the project continues — but the hero was
         * exactly one panel tall and had nothing behind it. A visitor who did
         * not flick saw one photograph and a line of text and left.
         */}
        <section
          className="snap-start-page relative w-full"
          style={{ height: panelVh(HERO_HEIGHT) }}
        >
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
              style={{ top: panelVh(TOP), height: panelVh(30) }}
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
          {/*
           * Panel units, not a percentage of this section. The section is
           * HERO_HEIGHT tall rather than the whole panel, so a plain "55%" is
           * 55% of 88 — it slid the place name up under the back control at
           * 44%, which is exactly the collision the suite exists to catch.
           */}
          <div
            className="absolute inset-x-0 px-14"
            style={{ top: panelVh(heroIsPortrait ? 26 : 55) }}
          >
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

          {/*
           * And the cue in words, because the peek alone is quiet on a
           * photograph that happens to be pale at its bottom edge. It moves —
           * motion is what reads as "this continues" from three metres — and
           * it is on the hero only: once a visitor has scrolled once, the
           * stack teaches itself.
           *
           * Non-interactive on purpose. It sits at 78%, below the reach
           * envelope, and anything tappable there would fail the suite rather
           * than bend it.
           */}
          {atTop ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 flex items-center gap-5 px-14"
              style={{ top: panelVh(78) }}
            >
              <svg
                className="scroll-nudge"
                width="52"
                height="30"
                viewBox="0 0 52 30"
                fill="none"
                stroke={heroIsPortrait ? 'var(--color-on-media)' : 'var(--color-ink-muted)'}
                strokeWidth="2"
              >
                <path d="M2 2 L26 26 L50 2" />
              </svg>
              <span
                className={`scroll-nudge text-caption uppercase tracking-[0.2em] ${
                  heroIsPortrait ? 'text-on-media' : 'text-ink-muted'
                }`}
              >
                {t('scrollHint')}
              </span>
            </div>
          ) : null}
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
              <MediaFrame media={frame} mode="band" eager active className="h-full w-full" />
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
            <svg
              width="30"
              height="18"
              viewBox="0 0 30 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
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
  const natural = (PHYSICAL.cssWidth / (poster.width / poster.height) / PHYSICAL.cssHeight) * 100;
  return Math.min(natural, FRAME_MAX);
}
