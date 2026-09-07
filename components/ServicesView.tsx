'use client';

import { SERVICES } from '@/content/services';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';
import { Mounted } from './Mounted';

/**
 * Services (§8) — one screen per service, snap-scrolled.
 *
 * Deliberately built as Craft is built rather than as a grid of cards: the
 * studio's website lays these out five across, which works on a laptop and
 * fails on a portrait panel read from three metres, where five columns of body
 * copy would be five columns nobody reads. One service to a screen gives each
 * sentence the room to be read standing in front of it.
 *
 * Numbered, like Craft, and for the same reason: these are a sequence, not a
 * menu. Drawn, designed, documented, made, installed — the order is the
 * argument, and the last three are the ones almost nobody else owns.
 */
export function ServicesView() {
  const { s, t } = useLocale();

  return (
    <div
      data-scroll-root
      data-scroll-reset
      className="snap-y-page no-scrollbar h-full w-full overflow-y-auto"
    >
      {SERVICES.map((service, i) => (
        <section key={service.id} className="snap-start-page relative h-full w-full">
          {service.media ? (
            <>
              <Mounted className="absolute inset-0" rootMargin="100% 0px">
                <MediaFrame
                  media={service.media}
                  mode="bleed"
                  priority={i === 0}
                  active={i === 0}
                  className="h-full w-full"
                />
              </Mounted>
              <div className="media-scrim absolute inset-0" />
            </>
          ) : null}

          {/*
           * 19%, where Craft anchors at 26%. Craft's stages are one short line
           * each; these are the studio's own sentences and the longest of them
           * runs to five lines in Portuguese, which at 26% put the last line
           * 32px inside the bar — caught by `npm run verify`, not by eye. The
           * prime band is a rule about where targets go, and there are none on
           * this screen, so the text is free to sit higher.
           */}
          <div className="absolute inset-x-0 px-14" style={{ top: '19%' }}>
            <p
              className={`text-caption tracking-[0.3em] ${
                service.media ? 'text-on-media/70' : 'text-ink-faint'
              }`}
            >
              {String(service.index).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
            </p>
            <h2 className={`mt-5 text-hero ${service.media ? 'text-on-media' : 'text-ink'}`}>
              {s(service.title)}
            </h2>
            {/*
             * One sentence, at the same measure Craft uses. The studio's own
             * copy, not rewritten — this is the screen where a visitor decides
             * whether to start a conversation, and the words on the panel
             * should be the words they will hear in the showroom.
             */}
            <p
              className={`mt-6 max-w-[860px] text-meta ${
                service.media ? 'text-on-media' : 'text-ink-muted'
              }`}
            >
              {s(service.line)}
            </p>
          </div>

          {i === 0 ? (
            <p className="absolute inset-x-0 px-14 text-caption uppercase tracking-[0.2em] text-ink-faint" style={{ top: '5.5%' }}>
              {t('services')}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
