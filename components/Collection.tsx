'use client';

import { useRouter } from 'next/navigation';
import { COLLECTION } from '@/config/layout';
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
 */
export function Collection() {
  const router = useRouter();
  const { s, t } = useLocale();

  const stride = COLLECTION.cardStride;
  // Projects plus the closing "art of craft" card.
  const { active, register } = useActiveCard(PROJECTS_IN_ORDER.length + 1);

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
        paddingTop: `${COLLECTION.cardTop}vh`,
        scrollPaddingTop: `${COLLECTION.cardTop}vh`,
      }}
    >
      {PROJECTS_IN_ORDER.map((project, i) => (
        <section
          key={project.slug}
          className="snap-start-page relative w-full"
          style={{ height: `${stride}vh` }}
        >
          <Mounted className="relative w-full" rootMargin="100% 0px">
            <MediaFrame
              media={project.hero}
              mode="band"
              priority={i === 0}
              className="w-full"
              style={{ height: `${COLLECTION.imageHeight}vh` }}
            />
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
              style={{ height: `${COLLECTION.metaHeight}vh` }}
            >
              {/*
               * Location sits at the same weight as the name, not as a
               * subtitle beneath it (§7a). Scrolling the list is the geography.
               */}
              <div className="flex items-baseline gap-6">
                <span className="text-hero">{s(project.name)}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-meta text-ink">{s(project.location)}</span>
                <span className="text-caption text-ink-faint">{t('viewProject')}</span>
              </div>
            </div>
          </TapTarget>
        </section>
      ))}

      {/*
       * The art of craft closes the stack. It is not in the nav — three items
       * only — but it is the strongest asset the studio has, so it earns the
       * place a visitor reaches by finishing the list.
       */}
      <section className="snap-start-page relative w-full" style={{ height: `${stride}vh` }}>
        <Mounted className="relative w-full">
          <MediaFrame
            media={PROJECTS_IN_ORDER[0].hero}
            mode="band"
            className="w-full opacity-70"
            style={{ height: `${COLLECTION.imageHeight}vh` }}
          />
        </Mounted>
        <TapTarget
          full
          enabled={active === PROJECTS_IN_ORDER.length}
          label={t('craft')}
          onTap={() => router.push('/craft')}
          className="w-full px-14"
        >
          <div
            ref={register(PROJECTS_IN_ORDER.length)}
            className="flex w-full flex-col justify-center border-b border-hairline"
            style={{ height: `${COLLECTION.metaHeight}vh` }}
          >
            <span className="text-hero">{t('craft')}</span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-meta text-ink">Cascais · Lisboa</span>
              <span className="text-caption text-ink-faint">{t('viewProject')}</span>
            </div>
          </div>
        </TapTarget>
      </section>

      {/* Tail spacer: just enough for the last card to reach its snap position. */}
      <div style={{ height: `${Math.max(0, 100 - stride - COLLECTION.cardTop)}vh` }} aria-hidden />
    </div>
  );
}
