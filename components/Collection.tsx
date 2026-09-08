'use client';

import { useRouter } from 'next/navigation';
import { COLLECTION } from '@/config/layout';
import { panelVh } from '@/lib/panel';
import { PROJECTS_IN_ORDER } from '@/content/projects';
import { useActiveCard } from '@/lib/useActiveCard';
import { useLocale } from '@/lib/locale';
import { MediaFrame } from './MediaFrame';
import { Mounted } from './Mounted';
import { TapTarget } from './TapTarget';

/**
 * The collection (§8) — a vertical stack of full-width project bands.
 *
 * Portrait makes vertical scroll the natural gesture, so the list is a stack
 * and not a rail. Each band snaps to a resting position that puts its image in
 * the upper display area and its tap target inside the prime band, so a flick
 * always lands on a project rather than halfway between two.
 *
 * The image itself is deliberately not tappable. At its snapped position it
 * sits above 28%, and the acceptance criteria put every interactive element
 * below that line — so the name-and-location block is the target, and the
 * photography is left alone to be photography.
 *
 * The band of ground between the resting card's rule and the next card's
 * photograph carries the fact that the list continues, because on a panel with
 * no scrollbar and no mouse a visitor will otherwise read the first card as
 * the whole collection. On the first card it is a chevron nudging downward;
 * once the visitor has moved it becomes a counter, which says both that there
 * is more and how much.
 *
 * A rail down the right edge was the other candidate and was built and thrown
 * away: the photography runs full-bleed to both edges, so any persistent rail
 * draws a line across every picture in the collection. A mark in the ground
 * gap costs the photography nothing.
 */
export function Collection() {
  const router = useRouter();
  const { s, t } = useLocale();

  const stride = COLLECTION.cardStride;
  /*
   * One card per project and nothing after them. The stack used to close with
   * an "art of craft" card; Craft came off the panel on 8 September at the
   * studio's request, so the last project is now the last card — which is what
   * the counter in the cue has to agree with, or it counts a screen nobody can
   * reach.
   */
  const { active, register } = useActiveCard(PROJECTS_IN_ORDER.length);

  return (
    <div
      data-scroll-root
      data-scroll-reset
      className="snap-y-page no-scrollbar h-full w-full overflow-y-auto"
      /*
       * paddingTop puts the first card at its resting position without a
       * scroll; scrollPaddingTop puts every later card in the same place when
       * it snaps. Both are needed — with only the second, the collection opens
       * with its first tap target 2% above the reach envelope.
       */
      style={{
        paddingTop: panelVh(COLLECTION.cardTop),
        scrollPaddingTop: panelVh(COLLECTION.cardTop),
      }}
    >
      {PROJECTS_IN_ORDER.map((project, i) => (
        <section
          key={project.slug}
          className="snap-start-page relative w-full"
          style={{ height: panelVh(stride) }}
        >
          {/*
           * The height belongs to the wrapper, not to the image: an unmounted
           * card has to occupy exactly the space a mounted one does, or every
           * snap position below it is wrong. See Mounted.
           */}
          <Mounted
            className="relative w-full"
            rootMargin="100% 0px"
            style={{ height: panelVh(COLLECTION.imageHeight) }}
          >
            <MediaFrame media={project.hero} mode="band" priority={i === 0} className="h-full w-full" />
          </Mounted>

          <TapTarget
            full
            enabled={active === i}
            label={`${s(project.name)} — ${s(project.location)}`}
            onTap={() => router.push(`/projects/${project.slug}`)}
            className="w-full px-14"
          >
            <div
              ref={register(i)}
              className="flex w-full flex-col justify-center border-b border-hairline"
              style={{ height: panelVh(COLLECTION.metaHeight) }}
            >
              {/*
               * Location sits at the same weight as the name, not as a
               * subtitle beneath it (§7a). Scrolling the list is the geography.
               */}
              {/*
               * Capped so a name can never run into the bottom-right corner,
               * where the full-screen control sits. "Cobertura em Singapura"
               * is 874px set at the hero size and did exactly that on the card
               * peeking below the fold — found by the occlusion check. 780px
               * is the left margin to the near edge of that control. Longer
               * names wrap to two lines, which the 11vh meta block has room
               * for.
               */}
              <div className="flex max-w-[780px] items-baseline gap-6">
                <span className="text-hero">{s(project.name)}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-meta text-ink">{s(project.location)}</span>
                {/*
                 * Only on the card that is actually tappable. Every card used
                 * to carry this label while only the one resting in the prime
                 * band had a handler, so most of them were an invitation to
                 * press something that did nothing — which is exactly how it
                 * was reported: "links to view project are not working well".
                 * Now the label appears where the tap works, and doubles as
                 * the mark of which card the panel is pointing at.
                 */}
                {active === i ? (
                  <span className="text-caption text-ink-faint">{t('viewProject')}</span>
                ) : null}
              </div>
            </div>
          </TapTarget>
        </section>
      ))}

      {/* Tail spacer: just enough for the last card to reach its snap position. */}
      <div style={{ height: panelVh(Math.max(0, 100 - stride - COLLECTION.cardTop)) }} aria-hidden />

      <ScrollCue
        active={active}
        count={PROJECTS_IN_ORDER.length}
        label={t('scrollHint')}
      />
    </div>
  );
}

/**
 * The cue in the ground gap: there is more below this card.
 *
 * Aligned to the same left margin as the type and sitting between the resting
 * card's rule and the top of the next card's photograph, so it never marks an
 * image. On the first card it moves, because motion is what reads as "this
 * continues" from three metres; after that it stops moving and counts, because
 * a cue that keeps insisting after it has been understood is noise.
 */
function ScrollCue({ active, count, label }: { active: number; count: number; label: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-30 flex items-center gap-5 px-14"
      style={{ top: '55%' }}
    >
      {active === 0 ? (
        <>
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
            {label}
          </span>
        </>
      ) : (
        <span className="text-caption tracking-[0.3em] text-ink-faint">
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}
