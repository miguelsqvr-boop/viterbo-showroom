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
 * Five items and the language toggle, which is the ceiling: six never fitted,
 * and five only fits because the words are short. Specialties took the slot
 * Craft left on 8 September, and it is the longest label in the bar —
 * "Especialidades" is 200px set in Portuguese — so the bar is measured on
 * every run rather than assumed; `npm run verify` fails on horizontal
 * overflow.
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
      className="fixed inset-x-0 z-40 flex items-center justify-between border-y border-hairline bg-ground/70 px-6 backdrop-blur-[18px]"
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

      <div className="flex items-center gap-1">
        {items.map((item) => {
          const current = item.match(pathname);
          return (
            <TapTarget
              key={item.href}
              label={item.label}
              onTap={() => router.push(item.href)}
              /*
               * px-2, not px-5. Miguel asked for a bigger menu on 9 September
               * and the labels went from 28px to 32px, which is 4px on ten
               * edges and more than the bar had spare. The padding pays for
               * it. The tap targets do not get smaller: TapTarget holds them
               * to minTouchTarget, so a short label like Studio still fills
               * 120px however little padding is asked for, and the bar is
               * measured on every run — `npm run verify` fails on horizontal
               * overflow, which is what caught the last version of this. The
               * gap went 8px to 4px in the same pass; between them they buy
               * back the 44px the logo and the larger type cost.
               */
              className="justify-center px-2"
              minSize={PANEL.minTouchTarget}
            >
              <span
                className="text-body"
                style={{
                  color: current ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                  borderBottom: current ? '1px solid var(--color-accent)' : '1px solid transparent',
                  paddingBottom: 6,
                }}
              >
                {item.label}
              </span>
            </TapTarget>
          );
        })}
      </div>

      <TapTarget
        label={locale === 'en' ? 'Mudar para português' : 'Switch to English'}
        onTap={toggle}
        className="justify-center"
        minSize={PANEL.minTouchTarget}
      >
        <span className="text-body text-ink-muted">
          <span style={{ color: locale === 'en' ? 'var(--color-ink)' : undefined }}>EN</span>
          <span className="px-2 text-ink-faint">/</span>
          <span style={{ color: locale === 'pt' ? 'var(--color-ink)' : undefined }}>PT</span>
        </span>
      </TapTarget>
    </nav>
  );
}
