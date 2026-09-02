'use client';

import { STUDIO } from '@/content/studio';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';

/**
 * Studio (§8) — one screen, no scroll, 90 words maximum.
 *
 * The figures line is set in body weight, sentence case, with no oversized
 * numerals and no accent colour. The restraint is what makes it credible.
 * There is deliberately no city count: several entries on the list are regions
 * rather than cities, and a number invites the one question you don't want a
 * visitor asking. The list itself lives in Craft and does the work better.
 */
export function StudioView() {
  const { s, t } = useLocale();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* One image. Not a team grid, not a world map. */}
      <div className="absolute inset-x-0 top-0 w-full" style={{ height: '24vh' }}>
        {/*
          * focus 15, not the 50 default: Gracinha and Miguel stand about a
          * quarter of the way down a portrait source, so a centred crop of a
          * 24vh band cuts both their heads off and a top-anchored one fills
          * the band with the ceiling. 15 puts their faces in the band.
          */}
        <MediaFrame media={STUDIO.image} mode="band" focus={15} priority className="h-full w-full" />
      </div>

      {/*
        * 24%, not 27%: the figures line has to clear the bar at 45% with the
        * longer of the two languages set in it. Portuguese is the binding
        * constraint here, as it usually is.
        */}
      <div className="absolute inset-x-0 px-14" style={{ top: '24%' }}>
        <p className="max-w-[900px] text-body text-ink">{s(STUDIO.body)}</p>
        <p className="mt-6 text-body text-ink-muted">{s(STUDIO.figures)}</p>
      </div>

      {/*
       * Publication marks only, no captions. A mark reads in a second; forty
       * bulleted awards read as insecurity. The notes stay in content/studio.ts
       * for the studio's own reference and are intentionally not rendered.
       */}
      <div className="absolute inset-x-0 px-14" style={{ top: '58%' }}>
        <p className="mb-7 text-caption uppercase tracking-[0.2em] text-ink-faint">{t('awards')}</p>
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          {STUDIO.awards.map((award) => (
            <span key={award.id} className="text-section text-ink-muted">
              {award.mark}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
