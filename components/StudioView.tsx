'use client';

import { useRouter } from 'next/navigation';
import { CHROME } from '@/config/layout';
import { panelVh } from '@/lib/panel';
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
      {/*
       * One image, whole.
       *
       * It starts where the navigation bar ends rather than at the top of the
       * panel. Running it up behind the frosted bar is right for a full-bleed
       * hero, where the photograph is the screen; here it is a plate with a
       * hard bottom edge, and putting a third of that plate behind chrome just
       * makes it look badly cropped.
       *
       * `contain`, not a cover crop. The source is 1080×1350 — a 4:5 portrait
       * — and the screen it sits on is 9:16, so no honest crop shows all of
       * it: at full width the whole frame is 70vh tall and there is no room
       * left for the words or for a Recognition link a visitor can reach.
       * Fitted instead, the photograph is 634px tall and 507 wide with ground
       * either side, and nothing is cut off. That is the studio's own portrait
       * and the studio asked to see all of it.
       *
       * 33vh is the ceiling, not a taste: everything below shifts down with
       * the plate, and the Recognition link has to stay inside the 72% reach
       * line (§15). At 33 it lands near 69; at 37 it is out of reach and the
       * suite fails the screen.
       */}
      <div
        className="absolute inset-x-0 w-full"
        style={{ top: `${CHROME.barTop + CHROME.barHeight}%`, height: panelVh(33) }}
      >
        <MediaFrame media={STUDIO.image} mode="contain" priority className="h-full w-full" />
      </div>

      {/*
       * Directly under the picture, which ends at 42%. The anchor has moved
       * twice: 24% when the bar still sat in the middle of the screen, 35%
       * when it went to the top, and 44% now that the portrait is shown whole
       * rather than cropped to a band.
       */}
      <div className="absolute inset-x-0 px-14" style={{ top: '44%' }}>
        <p className="max-w-[900px] text-body text-ink">{s(STUDIO.body)}</p>
        <p className="mt-6 text-body text-ink-muted">{s(STUDIO.figures)}</p>
      </div>

      {/*
       * Publication marks only, no captions. A mark reads in a second; forty
       * bulleted awards read as insecurity. The notes stay in content/studio.ts
       * for the studio's own reference and are intentionally not rendered.
       */}
      <div className="absolute inset-x-0 px-14" style={{ top: '65%' }}>
        {/*
         * The way into the full list, now that Recognition is not in the bar.
         * The heading is the target and the marks below it are not: the marks
         * run past 72% of the panel and anything below that is display-only, so
         * a block-sized target here would break the reach rule rather than bend
         * it. The heading sits at 65%, and its box ends near 69 — inside, with
         * the margin the picture above it left over.
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
