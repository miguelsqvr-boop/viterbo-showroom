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
 * Five items and the language toggle, which is the hard ceiling: six needs
 * 1101px of bar in English and 1090px in Portuguese against the 984px there
 * is, measured. Recognition therefore is not here: it is the end of Studio,
 * two pages down from the portrait — a fact about the practice, on the screen
 * that is about the practice. No hamburger, no dropdowns, no breadcrumbs.
 */
export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, locale, toggle } = useLocale();

  const items = [
    { href: '/', label: t('projects'), match: (p: string) => p === '/' || p.startsWith('/projects') },
    {
      href: '/craft',
      label: t('craftShort'),
      match: (p: string) => p.startsWith('/craft'),
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
      className="fixed inset-x-0 z-40 flex items-center justify-between border-y border-hairline bg-ground/70 px-12 backdrop-blur-[18px]"
      style={{ top: `${CHROME.barTop}%`, height: `${CHROME.barHeight}%` }}
    >
      {/*
       * The mark stays put so the five-tap maintenance gesture is always in
       * the same place. Back-to-collection is the "Projects" item: it is
       * persistent, inside the reach zone, and one tap from anywhere — which
       * is what §8 asks for without adding a fifth thing to this bar.
       */}
      <Wordmark className="text-meta tracking-[0.14em] text-ink-faint" />

      <div className="flex items-center gap-2">
        {items.map((item) => {
          const current = item.match(pathname);
          return (
            <TapTarget
              key={item.href}
              label={item.label}
              onTap={() => router.push(item.href)}
              className="justify-center px-7"
              minSize={PANEL.minTouchTarget}
            >
              <span
                className="text-meta"
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
        <span className="text-meta text-ink-muted">
          <span style={{ color: locale === 'en' ? 'var(--color-ink)' : undefined }}>EN</span>
          <span className="px-2 text-ink-faint">/</span>
          <span style={{ color: locale === 'pt' ? 'var(--color-ink)' : undefined }}>PT</span>
        </span>
      </TapTarget>
    </nav>
  );
}
