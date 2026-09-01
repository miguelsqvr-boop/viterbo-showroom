'use client';

import { usePathname, useRouter } from 'next/navigation';
import { CHROME } from '@/config/layout';
import { PANEL } from '@/config/panel';
import { useLocale } from '@/lib/locale';
import { TapTarget } from './TapTarget';
import { Wordmark } from './Wordmark';

/**
 * The navigation bar sits at roughly 45% from the top (§7).
 *
 * This is unusual and it is correct: on a 181cm totem a bottom-pinned bar
 * lands at 85cm off the floor, below both the natural gaze line and
 * comfortable reach. Three items only, plus the language toggle. No
 * hamburger, no dropdowns, no breadcrumbs.
 */
export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, locale, toggle } = useLocale();

  const items = [
    { href: '/', label: t('projects'), match: (p: string) => p === '/' || p.startsWith('/projects') },
    { href: '/studio', label: t('studio'), match: (p: string) => p.startsWith('/studio') },
    { href: '/contact', label: t('contact'), match: (p: string) => p.startsWith('/contact') },
  ];

  return (
    <nav
      data-chrome
      className="fixed inset-x-0 z-40 flex items-center justify-between border-y border-hairline bg-ground/85 px-12 backdrop-blur-[2px]"
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
