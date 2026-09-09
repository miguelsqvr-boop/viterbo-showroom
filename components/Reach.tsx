'use client';

import { CITIES } from '@/content/reach';
import { panelVh } from '@/lib/panel';
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
       * The names, alphabetical, in two columns.
       *
       * It was one column of nineteen lines swept outward from Cascais, and
       * the sweep was the argument: the European corridor, the Asia practice
       * and the lusophone world emerged without a label on them. The studio
       * looked at it on the panel and asked for something better looking —
       * alphabetical, in columns — so that is what it is. What the order used
       * to say, the map on the page before now says better anyway, and it says
       * it in one glance rather than nineteen lines.
       *
       * Down the first column, then the second: `grid-flow-col` over ten fixed
       * rows, which is what a reader expects of a list in columns and what
       * `columns-2` would also give. Ten rows because nineteen names split
       * ten and nine, and the odd one belongs at the bottom of the first
       * column rather than the top of the second.
       *
       * Non-interactive, so it may use the full height of the panel including
       * the dead zones.
       */}
      <section className="snap-start-page relative h-full w-full">
        <p
          className="absolute inset-x-0 px-14 text-caption uppercase tracking-[0.2em] text-ink-faint"
          style={{ top: '12%' }}
        >
          {t('where')}
        </p>

        <ul
          className="absolute inset-x-0 grid grid-flow-col px-14"
          style={{
            top: panelVh(20),
            height: panelVh(58),
            gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
          }}
        >
          {[...CITIES]
            .sort((a, b) => a.name.localeCompare(b.name, 'pt'))
            .map((city) => (
              <li key={city.name} className="flex items-center gap-6">
                {/*
                 * The same gold as the points on the map, at the same size, so
                 * the two pages read as one thought: the shape, then the names
                 * of the marks that made it.
                 */}
                <span
                  aria-hidden
                  className="inline-block shrink-0 rounded-full bg-accent"
                  style={{ width: 14, height: 14 }}
                />
                <span className="text-section leading-[1.1] text-ink">{city.name}</span>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
