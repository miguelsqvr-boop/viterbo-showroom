'use client';

import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/content/types';
import { mediaPoster } from '@/content/types';
import { useLocale } from '@/lib/locale';
import { FullView } from './FullView';
import { Gallery } from './Gallery';
import { MediaFrame } from './MediaFrame';
import { Mounted } from './Mounted';

/** Height of the swipe rail, in vh. It ends where the nav bar begins. */
const RAIL_VH = 15;

/**
 * A project (§8).
 *
 * Vertical scroll, but the first screenful is complete on its own: hero, name,
 * location and typology, and the narrative. Everything after it is a separate
 * snapped screenful so that whatever a flick lands on is composed rather than
 * halfway between two things.
 */
export function ProjectView({ project }: { project: Project }) {
  const router = useRouter();
  const { s, t } = useLocale();
  const [openAt, setOpenAt] = useState<number | null>(null);
  const heroPoster = mediaPoster(project.hero);
  const heroIsPortrait = heroPoster.aspect === 'portrait';
  const scrollerRef = useRef<HTMLDivElement | null>(null);

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

  const facts: Array<[string, string]> = [
    [t('locationLabel'), s(project.location)],
    ...(project.year ? [[t('year'), String(project.year)] as [string, string]] : []),
    ...(project.area ? [[t('area'), project.area] as [string, string]] : []),
    ...(project.scope ? [[t('scopeLabel'), s(project.scope)] as [string, string]] : []),
    ...(project.architect ? [[t('architect'), project.architect] as [string, string]] : []),
  ];

  return (
    <>
      <div
        ref={scrollerRef}
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
            <div className="absolute inset-x-0 top-0 w-full" style={{ height: '30vh' }}>
              <MediaFrame media={project.hero} mode="band" priority className="h-full w-full" />
            </div>
          )}

          {/*
           * A full-bleed hero carries its own scrim, so its type is light —
           * a light-ground app still sets light type on a photograph, because
           * it is the only thing that reads over an image whose tone nobody
           * controls. A banded hero sits on the ground and takes ink.
           */}
          <div className="absolute inset-x-0 px-14" style={{ top: heroIsPortrait ? '29%' : '32%' }}>
            <h1 className={`text-hero ${heroIsPortrait ? 'text-on-media' : 'text-ink'}`}>
              {s(project.name)}
            </h1>
            <p className={`mt-4 text-meta ${heroIsPortrait ? 'text-on-media/80' : 'text-ink-muted'}`}>
              {s(project.location)} · {s(project.typology)}
              {project.year ? ` · ${project.year}` : ''}
            </p>
          </div>
        </section>

        {/*
         * ---- Screenful two: the narrative -----------------------------
         *
         * The narrative gets its own beat rather than being stacked under the
         * hero. At 32px on a 34–40 character measure, sixty words is ten lines
         * — which, added to a hero band and a title, runs straight through the
         * navigation bar at 45%. Giving it the screen costs one flick and
         * makes it a page in a book instead of a caption.
         */}
        <section className="snap-start-page relative h-full w-full">
          <p
            className="absolute inset-x-0 px-14 text-body text-ink"
            style={{ top: '20%', maxWidth: 700 }}
          >
            {s(project.narrative)}
          </p>
        </section>

        {/* ---- Screenful three: the swipe rail --------------------------- */}
        <section className="snap-start-page relative h-full w-full">
          {/*
           * The rail lands at 28.5%–43.5%: inside the reach envelope, and
           * clear of the navigation bar at 45%. Slides are small for a 43"
           * panel and that is the honest cost of a bar in the middle of the
           * screen — inspecting an image is one tap into the full view.
           */}
          <div className="absolute inset-x-0" style={{ top: '24%' }}>
            <Mounted className="w-full" rootMargin="50% 0px">
              <Gallery
                items={project.gallery}
                heightVh={RAIL_VH}
                label={t('gallery')}
                onOpen={setOpenAt}
              />
            </Mounted>
          </div>
        </section>

        {/* ---- Screenful four: the facts strip ---------------------------- */}
        <section className="snap-start-page relative h-full w-full">
          <div className="absolute inset-x-0 px-14" style={{ top: '18%' }}>
            <p className="mb-8 text-caption uppercase tracking-[0.2em] text-ink-faint">
              {t('facts')}
            </p>
            <dl>
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between border-b border-hairline py-5"
                >
                  <dt className="text-caption text-ink-faint">{label}</dt>
                  <dd className="text-meta text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {openAt !== null ? (
          <FullView items={project.gallery} startIndex={openAt} onClose={() => setOpenAt(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
