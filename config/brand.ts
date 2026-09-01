/**
 * Brand tokens — the only file that knows what the studio looks like.
 *
 * Light ground, Cormorant Garamond, sentence case. The typeface is
 * self-hosted from npm (@fontsource-variable) rather than pulled from Google
 * Fonts at runtime: a kiosk that loses Wi-Fi must not lose its typography, and
 * the panel's Android has no serif worth falling back to — before this, the
 * app's Optima/Palatino stack was silently rendering as Noto Serif.
 *
 * If the studio licenses its own face, drop the files in `public/fonts/`, add
 * the @font-face rules to app/globals.css, and change `stack` here. Nothing
 * else in the app hardcodes a typeface or a colour.
 *
 * Indigo stays off this screen (§7), but the same codebase re-skins into an
 * Indigo trade-show screen by swapping the export at the bottom.
 */

export type Brand = {
  id: 'viterbo' | 'indigo';
  wordmark: string;
  color: {
    /**
     * Warm off-white rather than pure white. The panel is glossy at 300–350
     * nits, and full white is the state most likely to mirror the showroom
     * back at the visitor; this keeps almost all the brightness with
     * noticeably less bloom, and interiors photography sits on it without its
     * edges glowing.
     */
    ground: string;
    groundRaised: string;
    ink: string;
    inkMuted: string;
    inkFaint: string;
    hairline: string;
    /** Used with extreme restraint. Never for emphasis on figures. */
    accent: string;
    /**
     * Type set over full-bleed photography, which carries its own scrim.
     * A light-ground app still puts light type on a photograph — that is what
     * a magazine does, and it is the only thing that reads over an image
     * whose tone you do not control.
     */
    onMedia: string;
  };
  typeface: {
    stack: string;
    weight: { display: number; body: number; strong: number };
  };
};

export const VITERBO: Brand = {
  id: 'viterbo',
  wordmark: 'Viterbo',
  color: {
    ground: '#faf8f3',
    groundRaised: '#f1ede4',
    ink: '#1a1815',
    inkMuted: 'rgba(26, 24, 21, 0.66)',
    inkFaint: 'rgba(26, 24, 21, 0.44)',
    hairline: 'rgba(26, 24, 21, 0.14)',
    accent: '#8a7048',
    onMedia: '#faf8f3',
  },
  typeface: {
    stack: "'Cormorant Garamond Variable', 'Cormorant Garamond', 'EB Garamond', Georgia, serif",
    /**
     * Cormorant is a display Garamond: fine hairlines and a small x-height.
     * Display sizes take 300 and look the better for it; the 24px caption
     * floor takes 500, because at the size where legibility is already at its
     * limit, stroke weight is the only lever left.
     */
    weight: { display: 300, body: 400, strong: 500 },
  },
};

export const INDIGO: Brand = {
  ...VITERBO,
  id: 'indigo',
  wordmark: 'Indigo',
  color: {
    ...VITERBO.color,
    ground: '#f4f6f8',
    groundRaised: '#e7ebef',
    ink: '#14181c',
    accent: '#3f5b7a',
  },
};

export const BRAND: Brand = VITERBO;
