'use client';

import { usePathname, useRouter } from 'next/navigation';
import { CHROME } from '@/config/layout';
import { PANEL } from '@/config/panel';
import { useLocale } from '@/lib/locale';
import { TapTarget } from './TapTarget';
import { Wordmark } from './Wordmark';

/**
 * The navigation bar is pinned to the top of the panel.
 *
 * It used to float at 45%, which put it in the middle of the reach envelope
 * on a 181cm totem. Ergonomically that was the better place; in the showroom
 * it read as an interruption — a band across the middle of every photograph —
 * so it moved to the top. See CHROME in config/layout.ts for what that costs
 * and how to put it back.
 *
 * Two rows: the studio's mark, and under it the five items with the language
 * toggle. It was one row until 10 September, when Miguel asked for a bigger
 * and more legible menu. 40px labels do not fit beside the mark — measured in
 * Portuguese, where "Especialidades" alone sets at 245px, the single row came
 * to more than the panel is wide. Stacking gives the menu the whole 1080.
 *
 * Five items and the toggle is still the ceiling: six never fitted, and five
 * only fits because the words are short. The bar is measured on every run
 * rather than assumed; `npm run verify` fails on horizontal overflow.
 *
 * Every label is set in full ink, not the muted grey it used to be. That grey
 * measures 5.56:1 against this ground — enough for AA, short of AAA, and this
 * is a 43-inch panel read from across a showroom rather than a page held at
 * arm's length. Full ink is 16.69:1. The current item is still marked, by the
 * accent rule under it and by a heavier stroke, so it does not depend on
 * colour alone to be findable.
 *
 * Recognition is not here: it is the end of Studio, along with the map and the
 * cities — facts about the practice, on the screen that is about the practice.
 * No hamburger, no dropdowns, no breadcrumbs.
 */
export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, locale, toggle } = useLocale();

  const items = [
    { href: '/', label: t('projects'), match: (p: string) => p === '/' || p.startsWith('/projects') },
    {
      href: '/specialties',
      label: t('specialties'),
      match: (p: string) => p.startsWith('/specialties'),
    },
    { href: '/studio', label: t('studio'), match: (p: string) => p.startsWith('/studio') },
    {
      href: '/services',
      label: t('services'),
      match: (p: string) => p.startsWith('/services'),
    },
    { href: '/contact', label: t('contact'), match: (p: string) => p.startsWith('/contact') },
  ];

  return (
    /*
     * Frosted rather than solid. On a light ground the bar is invisible, which
     * is the point — but on the Craft stages and portrait heroes it lies over
     * a full-bleed photograph, and an opaque band there crops the top off the
     * frame. Blur keeps the type legible over any tone without the chrome
     * becoming the thing you look at.
     */
    <nav
      data-chrome
      data-occluder
      className="fixed inset-x-0 z-40 flex flex-col items-center justify-center gap-4 border-y border-hairline bg-ground/70 px-6 backdrop-blur-[18px]"
      style={{ top: `${CHROME.barTop}%`, height: `${CHROME.barHeight}%` }}
    >
      {/*
       * The studio's logo, and the mark stays put so the five-tap maintenance
       * gesture is always in the same place.
       *
       * 26px tall, which is a measured ceiling and not a taste. The bar in
       * Portuguese carries "Especialidades" at 196px, and mark plus items plus
       * the language toggle plus the bar's own padding came to 1078 of the
       * panel's 1080 — the mark finished one pixel before "Projetos" began.
       * The bar's padding came in from 32px to 24px and the mark down from 28,
       * which between them leave a real gap on either side of it. Back-to-collection is the "Projects" item: it is
       * persistent, inside the reach zone, and one tap from anywhere — which
       * is what §8 asks for without adding a fifth thing to this bar.
       */}
      <Wordmark height={26} />

      {/*
       * Items and the language toggle on one row, the toggle set off by a
       * wider gap so it reads as a control rather than a sixth destination.
       */}
      <div className="flex items-center gap-2">
        {items.map((item) => {
          const current = item.match(pathname);
          return (
            <TapTarget
              key={item.href}
              label={item.label}
              onTap={() => router.push(item.href)}
              /*
               * px-2. The labels are 40px now and the mark has moved to its
               * own line, which gave the row back the 175px the mark was
               * taking — but not enough of it to be generous with the
               * padding. At px-3 the Portuguese row measured 1066 of the
               * panel's 1080 and ran to seven pixels from the glass on the
               * left, outside the bar's own 24px. px-2 pulls it back to a
               * real margin on both sides.
               * The tap targets do not get smaller either way: TapTarget
               * holds them to minTouchTarget, so a short label like Studio
               * still fills 120px however little padding is asked for, and
               * the bar is measured on every run — `npm run verify` fails on
               * horizontal overflow, which is what caught the version of this
               * where the mark and the menu shared a line.
               */
              className="justify-center px-2"
              minSize={PANEL.minTouchTarget}
            >
              <span
                className="text-nav"
                style={{
                  color: 'var(--color-ink)',
                  fontWeight: current ? 500 : 400,
                  borderBottom: current ? '2px solid var(--color-accent)' : '2px solid transparent',
                  paddingBottom: 8,
                }}
              >
                {item.label}
              </span>
            </TapTarget>
          );
        })}

        <TapTarget
          label={locale === 'en' ? 'Mudar para português' : 'Switch to English'}
          onTap={toggle}
          className="ml-6 justify-center"
          minSize={PANEL.minTouchTarget}
        >
          {/*
           * The language not in use is muted rather than faint. Faint is
           * 2.82:1 on this ground, which is below every threshold there is;
           * it was carrying the separator and the inactive half of a control
           * a visitor has to read before they can use it.
           */}
          <span className="text-nav">
            <span
              style={{
                color: 'var(--color-ink)',
                fontWeight: locale === 'en' ? 500 : 400,
              }}
            >
              EN
            </span>
            <span className="px-3 text-ink-muted">/</span>
            <span
              style={{
                color: 'var(--color-ink)',
                fontWeight: locale === 'pt' ? 500 : 400,
              }}
            >
              PT
            </span>
          </span>
        </TapTarget>
      </div>
    </nav>
  );
}
