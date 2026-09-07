'use client';

import { useRouter } from 'next/navigation';
import { STUDIO } from '@/content/studio';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';
import { TapTarget } from './TapTarget';

/**
 * Studio (§8) — one screen, no scroll, 90 words maximum.
 *
 * The figures line is set in body weight, sentence case, with no oversized
 * numerals and no accent colour. The restraint is what makes it credible.
 * There is deliberately no city count: several entries on the list are regions
 * rather than cities, and a number invites the one question you don't want a
 * visitor asking. The list itself lives in Craft and does the work better.
 */
const MARKS_ON_STUDIO = 8;

export function StudioView() {
  const { s, t } = useLocale();
  const router = useRouter();

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
        {/*
         * The way into the full list, now that Recognition is not in the bar.
         * The heading is the target and the marks below it are not: the marks
         * run to 73% of the panel and anything below 72% is display-only, so a
         * block-sized target here would break the reach rule rather than bend
         * it. The heading sits at 58%, well inside.
         */}
        <TapTarget
          label={t('awards')}
          onTap={() => router.push('/recognition')}
          className="mb-1 -ml-4 px-4"
        >
          <span className="text-caption uppercase tracking-[0.2em] text-ink-faint underline decoration-hairline underline-offset-[10px]">
            {t('awards')}
          </span>
        </TapTarget>
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          {/*
           * Eight, not all twenty-two. The full list has its own screen now,
           * so this one is back to doing what it did best: a handful of marks
           * a visitor recognises without reading, at the display size they
           * were meant to be set in. Taken from the head of the awards array,
           * which is ordered strongest-first, so adding a recognition later
           * does not quietly change what the Studio screen leads with.
           *
           * Deduped because CNN and Conde Nast each appear twice in the data.
           */}
          {Array.from(new Set(STUDIO.awards.map((award) => award.mark)))
            .slice(0, MARKS_ON_STUDIO)
            .map((mark) => (
              <span key={mark} className="text-section text-ink-muted">
                {mark}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
