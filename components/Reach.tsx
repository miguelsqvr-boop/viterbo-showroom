'use client';

import { CITIES } from '@/content/craft';
import { useLocale } from '@/lib/locale';
import { WorldMap } from './WorldMap';

/**
 * Where the studio has worked — the shape, then the names.
 *
 * These two pages were the end of Craft. The studio asked for them at the
 * bottom of Studio, and they belong there: the reach is a fact about the
 * practice, which is what that screen is now for end to end.
 *
 * Both pages stay, and in this order. Neither says what the other says — the
 * drawing shows a scatter that runs from Cascais to Luanda, Macau, Bangkok,
 * Singapore and across to Brazil, and the list says which places those are.
 * A map alone is a claim nobody can check from three metres; a list alone is
 * nineteen lines of type with no shape to it.
 */
export function ReachSections() {
  const { t } = useLocale();

  return (
    <>
      <section className="snap-start-page relative h-full w-full">
        {/*
         * The label sits with the drawing rather than at the 12% every other
         * screen starts at. Those screens have type running from the top; this
         * one has a single graphic hung in the middle of the panel, and a lone
         * 24px line 500px above it reads as something that has come adrift.
         *
         * The map is full width and centred on 47% — around 132cm on a 181cm
         * totem, the same line the project frames are hung on.
         */}
        <p
          className="absolute inset-x-0 px-14 text-caption uppercase tracking-[0.2em] text-ink-faint"
          style={{ top: '26%' }}
        >
          {t('where')}
        </p>
        <div className="absolute inset-x-0 w-full" style={{ top: '32%' }}>
          <WorldMap className="w-full" />
        </div>
      </section>

      {/*
       * Non-interactive, so it may span the full height of the panel including
       * the dead zones. Ordered as a sweep outward from home: never
       * alphabetically, never grouped by country.
       */}
      <section className="snap-start-page relative h-full w-full">
        {/*
         * No heading, tight leading, one column, read as a sweep.
         *
         * Set at the section size rather than the body size. It was body size
         * because the bar at 45% cut three cities out of the middle of the
         * sweep at anything larger — the one thing this list cannot survive.
         * With the bar at the top the whole panel is free, and a list nobody
         * can read from three metres was not carrying the studio's reach.
         * Nineteen lines at 1.2 leading end at 78% of the panel.
         */}
        <ul className="absolute inset-x-0 px-14" style={{ top: '12%' }}>
          {CITIES.map((city) => (
            <li key={city.name} className="text-section leading-[1.2] text-ink">
              {city.name}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
