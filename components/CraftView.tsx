'use client';

import { CITIES, COLLABORATIONS, CRAFT_STAGES } from '@/content/craft';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';
import { Mounted } from './Mounted';

/**
 * The art of craft (§8) — the studio's own words for this, not an invented
 * section name.
 *
 * Structured as a journey rather than a gallery, because the content genuinely
 * is a sequence and the sequence is the argument: designed in Cascais, made in
 * our own workshops, inspected at the Port of Lisbon, installed by our own
 * people anywhere in the world. Plenty of studios claim the first and the
 * last; almost none own the middle.
 *
 * Numbered stages are legitimate here and nowhere else in the app.
 */
export function CraftView() {
  const { s, t } = useLocale();

  return (
    <div
      data-scroll-root
      data-scroll-reset
      className="snap-y-page no-scrollbar h-full w-full overflow-y-auto"
    >
      {CRAFT_STAGES.map((stage, i) => (
        <section key={stage.id} className="snap-start-page relative h-full w-full">
          {/*
           * A stage with photography takes the full frame behind a scrim. A
           * stage without it is set as type on the ground — see CraftStage in
           * content/types.ts. The screen would rather say less than stand a
           * placeholder where a workshop bench belongs.
           */}
          {stage.media ? (
            <>
              <Mounted className="absolute inset-0" rootMargin="100% 0px">
                <MediaFrame
                  media={stage.media}
                  mode="bleed"
                  priority={i === 0}
                  active={i === 0}
                  className="h-full w-full"
                />
              </Mounted>
              <div className="media-scrim absolute inset-0" />
            </>
          ) : null}

          <div className="absolute inset-x-0 px-14" style={{ top: '26%' }}>
            <p
              className={`text-caption tracking-[0.3em] ${
                stage.media ? 'text-on-media/70' : 'text-ink-faint'
              }`}
            >
              {String(stage.index).padStart(2, '0')} / {String(CRAFT_STAGES.length).padStart(2, '0')}
            </p>
            <h2 className={`mt-5 text-hero ${stage.media ? 'text-on-media' : 'text-ink'}`}>
              {s(stage.title)}
            </h2>
            {/* One line of text. No paragraphs. */}
            <p
              className={`mt-6 max-w-[860px] text-body ${
                stage.media ? 'text-on-media' : 'text-ink-muted'
              }`}
            >
              {s(stage.line)}
            </p>
          </div>
        </section>
      ))}

      {/*
       * The closing frame of the journey (§8). After the workshop bench, the
       * warehouse and the crates, the list is proof rather than a boast — which
       * is why it lives here and not on the Studio screen.
       *
       * Non-interactive, so it may span the full height of the panel including
       * the dead zones. Ordered as a sweep outward from home: never
       * alphabetically, never grouped by country.
       */}
      <section className="snap-start-page relative h-full w-full">
        {/*
         * No heading, tight leading, and the whole block above the navigation
         * bar. Nineteen lines at the body measure is 38% of the panel — set
         * any looser and the bar at 45% cuts three cities out of the middle of
         * the sweep, which is the one thing this list cannot survive.
         */}
        <ul className="absolute inset-x-0 px-14" style={{ top: '5.5%' }}>
          {CITIES.map((city) => (
            <li key={city} className="text-body leading-[1.2] text-ink">
              {city}
            </li>
          ))}
        </ul>
      </section>

      <section className="snap-start-page relative h-full w-full">
        <div className="absolute inset-x-0 px-14" style={{ top: '9%' }}>
          <p className="mb-10 text-caption uppercase tracking-[0.2em] text-ink-faint">
            {t('collaborations')}
          </p>
          {COLLABORATIONS.map((collaboration) => (
            <div key={collaboration.name} className="border-b border-hairline py-6">
              <p className="text-section">{collaboration.name}</p>
              <p className="mt-2 text-caption text-ink-faint">{s(collaboration.note)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
