'use client';

import { CHROME } from '@/config/layout';
import { panelVh } from '@/lib/panel';
import { STUDIO } from '@/content/studio';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';
import { RecognitionSections, recognitionPageCount } from './Recognition';

/**
 * Studio (§8) — the portrait and ninety words, then the recognitions in full.
 *
 * It was one screen with no scroll, and the awards lived on their own route one
 * tap away. The studio asked for them at the end of Studio, so the screen now
 * snap-scrolls: the portrait and the words, then the twenty-four recognitions
 * with what each one was actually for. Same mechanism as Craft and the
 * collection, so it behaves the way the rest of the panel already taught.
 *
 * The Recognition link is gone from the first page, and with it the constraint
 * that held the portrait to a third of the screen: nothing on this page is
 * tappable now, so nothing has to stay above the 72% reach line, and the
 * photograph can be half the panel instead.
 */
export function StudioView() {
  const { s, t } = useLocale();
  const pages = 1 + recognitionPageCount();

  return (
    <div
      data-scroll-root
      data-scroll-reset
      className="snap-y-page no-scrollbar h-full w-full overflow-y-auto"
    >
      <section className="snap-start-page relative h-full w-full overflow-hidden">
        {/*
         * One image, whole.
         *
         * It starts where the navigation bar ends rather than at the top of the
         * panel. Running it up behind the frosted bar is right for a full-bleed
         * hero, where the photograph is the screen; here it is a plate with a
         * hard bottom edge, and putting a third of that plate behind chrome
         * just makes it look badly cropped.
         *
         * `contain`, not a cover crop. The source is 1080×1350 — a 4:5 portrait
         * — and the screen it sits on is 9:16, so no honest crop shows all of
         * it: at full width the whole frame is 70vh tall and the words have
         * nowhere to go. Fitted at 50vh it is 768px wide with ground either
         * side, nothing is cut off, and the words still finish clear of the
         * full-screen control at 92%.
         */}
        <div
          className="absolute inset-x-0 w-full"
          style={{ top: `${CHROME.barTop + CHROME.barHeight}%`, height: panelVh(50) }}
        >
          <MediaFrame media={STUDIO.image} mode="contain" priority className="h-full w-full" />
        </div>

        {/*
         * Directly under the picture, which ends at 59%. The anchor has moved
         * with it each time the picture changed: 24% when the bar still sat in
         * the middle of the screen, 35% when it went to the top, 44% when the
         * portrait was first shown whole, and 62% now that it is shown whole at
         * full size.
         */}
        <div className="absolute inset-x-0 px-14" style={{ top: '62%' }}>
          <p className="max-w-[900px] text-body text-ink">{s(STUDIO.body)}</p>
          <p className="mt-6 text-body text-ink-muted">{s(STUDIO.figures)}</p>
        </div>

        {/*
         * There is more below, and nothing peeks to say so.
         *
         * A project screen never needs this — its frames stop short of the
         * panel so the next one always shows — but a snapped page is a clean
         * edge with nothing behind it. The collection solves it with a moving
         * arrow, and this is the same cue in the same words, sitting in the
         * ground below the figures line and above the full-screen control.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 flex items-center gap-5 px-14"
          style={{ top: '85%' }}
        >
          <svg
            className="scroll-nudge"
            width="52"
            height="30"
            viewBox="0 0 52 30"
            fill="none"
            stroke="var(--color-ink-muted)"
            strokeWidth="2"
          >
            <path d="M2 2 L26 26 L50 2" />
          </svg>
          <span className="scroll-nudge text-caption uppercase tracking-[0.2em] text-ink-muted">
            {t('awards')}
          </span>
        </div>
      </section>

      <RecognitionSections pageOffset={1} pageTotal={pages} />
    </div>
  );
}
