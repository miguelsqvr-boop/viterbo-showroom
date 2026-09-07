'use client';

import { CHROME } from '@/config/layout';
import { PHYSICAL } from '@/config/panel';
import { SERVICES } from '@/content/services';
import { canFullBleed, mediaPoster, type Service } from '@/content/types';
import { panelVh } from '@/lib/panel';
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
/** True only when the type is set over the photograph rather than beside it. */
function onMedia(service: Service): boolean {
  return service.media !== undefined && canFullBleed(service.media);
}

/**
 * Wider than 2:1 is a drawing, not a room. Read from the file rather than
 * declared per service, so a replacement image changes the treatment with it.
 */
function isDrawing(service: Service): boolean {
  if (!service.media) return false;
  const poster = mediaPoster(service.media);
  return poster.width / poster.height > 2;
}

/**
 * How tall the band is, in panel heights.
 *
 * A photograph gets the 30% ProjectView gives a landscape hero. A drawing gets
 * only what its own proportions need at the panel's width, because a contained
 * image in a taller box is just a band with air above and below it.
 */
function bandHeight(service: Service): number {
  if (!isDrawing(service)) return 30;
  const poster = mediaPoster(service.media!);
  return Math.round(((PHYSICAL.cssWidth / (poster.width / poster.height)) / PHYSICAL.cssHeight) * 100);
}

/**
 * Where the type starts, in percent from the top.
 *
 * Under the photograph when there is one, at Craft's anchor when there is not.
 * Derived from the band rather than written down twice, so a drawing — which
 * takes a shorter band than a photograph — does not leave a hole.
 */
function textTop(service: Service): number {
  if (!service.media || canFullBleed(service.media)) return 26;
  return CHROME.barTop + CHROME.barHeight + bandHeight(service) + 5;
}

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
          {/*
           * Three states, and the screen picks between them from the file it
           * actually has rather than from what anyone hoped it would have.
           *
           * A portrait frame at 2160px or better takes the whole panel. None of
           * the studio's service photography is that yet — all four are
           * landscape — so they take a band under the navigation bar and leave
           * the type on the ground below, the way ProjectView already handles
           * a landscape hero. And a service with no photograph at all is set
           * as type on the ground and looks deliberate, because it is.
           */}
          {service.media && canFullBleed(service.media) ? (
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
          ) : service.media ? (
            <Mounted
              className="absolute inset-x-0 w-full"
              rootMargin="100% 0px"
              style={{
                top: `${CHROME.barTop + CHROME.barHeight}%`,
                height: panelVh(bandHeight(service)),
              }}
            >
              <MediaFrame
                media={service.media}
                /*
                 * A drawing is contained, a photograph is cropped. Cover a
                 * 2.35:1 elevation into a 1.9:1 band and the annotations down
                 * both sides — which are the reason a visitor is looking at a
                 * drawing at all — are the first thing cut off.
                 */
                mode={isDrawing(service) ? 'contain' : 'band'}
                priority={i === 0}
                className="h-full w-full"
              />
            </Mounted>
          ) : null}

          {/*
           * 26%, the same anchor Craft uses, so the two sequences read as one
           * family. It sat at 19% for a while with the sentence dropped to the
           * meta size, because the longest of these paragraphs runs to five
           * lines in Portuguese and at 26% the last line landed 32px inside the
           * bar at 45%. That was a workaround for a bar that is no longer
           * there; with the chrome pinned to the top the copy has the whole
           * panel below it and goes back to the size it should have been.
           */}
          <div className="absolute inset-x-0 px-14" style={{ top: `${textTop(service)}%` }}>
            {/*
             * The section label rides with the type rather than sitting at a
             * fixed 12%, which is now inside the image band: set in ink over a
             * dark kitchen it was very nearly invisible.
             */}
            {i === 0 ? (
              <p
                className={`mb-8 text-caption uppercase tracking-[0.2em] ${
                  onMedia(service) ? 'text-on-media/70' : 'text-ink-faint'
                }`}
              >
                {t('services')}
              </p>
            ) : null}
            <p
              className={`text-caption tracking-[0.3em] ${
                onMedia(service) ? 'text-on-media/70' : 'text-ink-faint'
              }`}
            >
              {String(service.index).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
            </p>
            <h2 className={`mt-5 text-hero ${onMedia(service) ? 'text-on-media' : 'text-ink'}`}>
              {s(service.title)}
            </h2>
            {/*
             * One sentence, at the same measure Craft uses. The studio's own
             * copy, not rewritten — this is the screen where a visitor decides
             * whether to start a conversation, and the words on the panel
             * should be the words they will hear in the showroom.
             */}
            <p
              className={`mt-6 max-w-[860px] text-body ${
                onMedia(service) ? 'text-on-media' : 'text-ink-muted'
              }`}
            >
              {s(service.line)}
            </p>
          </div>


        </section>
      ))}
    </div>
  );
}
