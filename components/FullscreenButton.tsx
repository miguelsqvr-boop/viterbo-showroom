'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale';
import { PANEL } from '@/config/panel';
import { TapTarget } from './TapTarget';

/**
 * The one control on this panel that is not for visitors.
 *
 * Whoever opens the showroom switches the totem on and gets a browser with a
 * URL bar and a tab strip across the top of the picture. Fully Kiosk hides
 * that by itself, but the panel is not always running under Fully Kiosk — a
 * plain browser is the fallback when the kiosk app is being set up, has been
 * updated, or has fallen over, and that is exactly the morning when nobody
 * wants to hunt through a menu. One press here and the chrome is gone.
 *
 * Bottom-right, not in the navigation bar. Three reasons, all deliberate:
 *
 *   1. The bar is full. Six items overflow it, measured — see NavBar.
 *   2. This is a staff control, pressed once a day by someone standing at the
 *      glass. The bottom of the panel is 82cm off the floor, which is the
 *      easiest corner to reach and the least valuable place to display
 *      anything. The reach envelope exists to keep *visitor* controls where a
 *      visitor's hand goes; spending the dead zone on the one control a
 *      visitor must never need is the right trade. It carries `data-chrome`
 *      so `npm run verify` reads it as chrome rather than as a screen that
 *      has quietly grown a button below the line.
 * The offset is on the fixed box rather than as padding inside it, so the
 * element `npm run verify` measures is the chip a visitor can actually see. A
 * padded wrapper reported a 275x184 obstruction where there is a 199x120 one.
 *
 *   3. Right, not left, because every line of type on this panel is set from
 *      the left margin. On the left it sat on top of the next project's name
 *      at the bottom of the collection — found by the occlusion check, which
 *      measures floating controls against the type behind them.
 *
 * It sits above the attract loop (z-50) and the full view (z-60), because the
 * state the panel is in when the TV comes on in the morning is the attract
 * loop, and a control that needs a dismissing tap first is a control that gets
 * missed.
 *
 * It disappears the moment it has done its job, and never appears at all on
 * the totem in normal service.
 */
export function FullscreenButton() {
  const { t } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    /*
     * Fully Kiosk injects a `fully` object and is already running edge to edge,
     * so there is nothing for this button to do there. Testing for the kiosk
     * app rather than comparing innerHeight against screen.height, because the
     * viewport is pinned to 1080 CSS px (§5) and those two numbers have no
     * fixed relationship on this hardware.
     */
    const kiosk = typeof window !== 'undefined' && 'fully' in window;
    const read = () =>
      setShow(!kiosk && document.fullscreenEnabled && document.fullscreenElement === null);
    read();
    document.addEventListener('fullscreenchange', read);
    return () => document.removeEventListener('fullscreenchange', read);
  }, []);

  if (!show) return null;

  return (
    <div data-chrome data-occluder className="fixed bottom-8 right-8 z-[70]">
      <TapTarget
        label={t('fullScreen')}
        minSize={PANEL.minTouchTarget}
        onTap={() => {
          /*
           * Failure is silent on purpose. A browser that refuses the request
           * (an iframe without the permission, a policy that blocks it) leaves
           * the panel exactly as it was, which is a working panel with browser
           * chrome — not something to interrupt the room with an error about.
           */
          void document.documentElement.requestFullscreen?.().catch(() => {});
        }}
        /* The house button: 6px corners, hairline border. Frosted like the
         * navigation bar, because it has to stay legible sitting over whatever
         * photograph the attract loop is showing behind it. */
        className="justify-center rounded-[6px] border border-hairline bg-ground/70 px-10 backdrop-blur-[18px]"
      >
        <span className="text-meta text-ink-muted">{t('fullScreen')}</span>
      </TapTarget>
    </div>
  );
}
