'use client';

import { useEffect, useState } from 'react';
import { CHROME } from '@/config/layout';
import { useLoadingProgress } from '@/lib/loading';
import { useLocale } from '@/lib/locale';

/**
 * What the screen is doing, while it is still doing it.
 *
 * The first version was a 4px hairline along the very top of the panel, and
 * the studio's verdict was that nobody could tell it meant loading. Both
 * halves of that are true and they are different problems. Four CSS pixels is
 * eight device pixels on a 2160-wide screen, read from three metres — nothing.
 * And the top edge of a 181cm totem is above eye level, against the bezel,
 * which is the one strip of the panel a visitor never looks at.
 *
 * So it moved and it grew. It sits directly under the navigation bar, on the
 * edge where the content actually begins, ten pixels deep with a track behind
 * it so it reads as a measure rather than as a stray gold line. The filled
 * part carries a sheen, because a bar stalled at forty per cent on one large
 * frame looks exactly like a bar that has died there unless something moves.
 * And it says the word, in both languages: the studio asked for people to know
 * it is loading, and a label is the only thing that cannot be misread.
 *
 * Everything here is display-only — no tap target, nothing occluded, gone the
 * moment the screen is ready.
 */
const SHOW_AFTER_MS = 180;
/** Long enough for the run to 100% to be seen finishing. */
const HIDE_AFTER_MS = 320;

export function LoadingBar() {
  const { progress, pending } = useLoadingProgress();
  const { t } = useLocale();
  const busy = pending > 0;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!busy) {
      const done = window.setTimeout(() => setVisible(false), HIDE_AFTER_MS);
      return () => window.clearTimeout(done);
    }
    const start = window.setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(start);
  }, [busy]);

  /*
   * Never below a twelfth: at the instant the first frame registers the
   * fraction is zero, and a bar of zero width is indistinguishable from a
   * broken one. It runs to full before it fades, so the last thing a visitor
   * sees is the measure completing rather than vanishing mid-way.
   */
  const width = busy ? Math.max(0.08, progress) : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-50"
      style={{
        top: `${CHROME.barTop + CHROME.barHeight}%`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 240ms ease',
      }}
    >
      {/* The track. Faint, full width, so the fill is read against something. */}
      <div className="h-[10px] w-full overflow-hidden bg-accent/15">
        <div
          className="relative h-full overflow-hidden bg-accent"
          style={{ width: `${width * 100}%`, transition: 'width 340ms ease-out' }}
        >
          <div
            className="load-sheen absolute inset-y-0 w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
            }}
          />
        </div>
      </div>

      {/*
       * The word on a frosted plate, flush to the left edge, the same
       * treatment as the back control on a project. It has to be, because on a
       * full-bleed hero the content starts under the bar and this label lands
       * straight on the photograph — faint ink on someone's living room is not
       * type, it is a smudge. Frosted, it reads over any tone.
       */}
      <div className="mt-4 inline-flex rounded-r-[6px] border border-l-0 border-hairline bg-ground/70 px-8 py-3 backdrop-blur-[18px]">
        <span className="text-caption uppercase tracking-[0.2em] text-ink-muted">
          {t('loading')}
        </span>
      </div>
    </div>
  );
}
