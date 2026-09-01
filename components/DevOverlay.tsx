'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CHROME, PRIME, ZONES } from '@/config/layout';
import { PANEL } from '@/config/panel';

/**
 * Dev-only reach-zone overlay (§5). Toggle with `?overlay=1`.
 *
 * Review it on the actual panel, standing 60cm away — never in a desktop
 * browser window, where every one of these bands is a lie.
 */
type Violation = { label: string; reason: string };

export function DevOverlay() {
  const params = useSearchParams();
  const on = params.get('overlay') === '1';
  const [violations, setViolations] = useState<Violation[]>([]);
  const [fps, setFps] = useState(0);
  const [viewport, setViewport] = useState('');

  useEffect(() => {
    if (!on) return;
    setViewport(
      `${window.innerWidth}×${window.innerHeight} css · dpr ${window.devicePixelRatio} · ` +
        `${window.screen.width}×${window.screen.height} screen · ${navigator.maxTouchPoints} pts`,
    );

    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const tick = () => {
      frames += 1;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const audit = () => {
      const height = window.innerHeight;
      const found: Violation[] = [];
      document.querySelectorAll<HTMLElement>('[data-tap-target]').forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) return;
        // Only audit what is actually on screen — a card three flicks down the
        // collection is not "outside the reach envelope", it is off it.
        if (box.bottom <= 0 || box.top >= height) return;
        const label = el.getAttribute('aria-label') ?? el.tagName;
        const topPct = (box.top / height) * 100;
        const bottomPct = (box.bottom / height) * 100;
        // The intersection of §3 (13–55) and §15 (28–72).
        if (bottomPct > 72 || topPct < 28) {
          found.push({
            label,
            reason: `${topPct.toFixed(0)}%–${bottomPct.toFixed(0)}% — outside the reach envelope`,
          });
        }
        if (Math.min(box.width, box.height) < PANEL.minTouchTarget) {
          found.push({
            label,
            reason: `${Math.round(box.width)}×${Math.round(box.height)} — under ${PANEL.minTouchTarget}px`,
          });
        }
      });
      setViolations(found);
    };
    audit();
    const observer = new MutationObserver(audit);
    observer.observe(document.body, { childList: true, subtree: true });
    const interval = setInterval(audit, 1500);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [on]);

  if (!on) return null;

  const band = (top: number, bottom: number, color: string, label: string) => (
    <div
      key={label}
      className="absolute inset-x-0 border-y"
      style={{ top: `${top}%`, height: `${bottom - top}%`, borderColor: color, background: `${color}14` }}
    >
      <span className="absolute left-3 top-2 text-[20px]" style={{ color }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] font-mono">
      {band(0, ZONES.primeTop, '#ff6b6b', 'display only — above reach')}
      {band(PRIME.top, PRIME.bottom, '#6bff9a', `prime ${PRIME.top}–${PRIME.bottom}%`)}
      {band(ZONES.primeBottom, ZONES.secondaryBottom, '#ffd76b', 'secondary — low frequency only')}
      {band(ZONES.secondaryBottom, 100, '#ff6b6b', 'display only — never interactive')}
      <div
        className="absolute inset-x-0 border-y border-dashed"
        style={{ top: `${CHROME.barTop}%`, height: `${CHROME.barHeight}%`, borderColor: '#6bd5ff' }}
      />
      <div className="absolute left-3 top-3 max-w-[900px] bg-black/80 p-4 text-[20px] leading-tight text-white">
        <div>{viewport}</div>
        <div>
          {fps} fps · touch {PANEL.touchType} · target {PANEL.minTouchTarget}px
        </div>
        <div style={{ color: violations.length ? '#ff8080' : '#8dff9f' }}>
          {violations.length === 0
            ? 'all tap targets inside the envelope'
            : violations.map((v) => `${v.label}: ${v.reason}`).join('  |  ')}
        </div>
      </div>
    </div>
  );
}
