/**
 * Brand tokens — the only file that knows what the studio looks like.
 *
 * ⚠️ PROVISIONAL. The build brief says to take the palette and typefaces from
 * the live site and not to invent a brand. viterbointeriordesign.com is not
 * reachable from this build environment, so the values below are the brief's
 * own direction (§10: deep warm neutral around #14120F, one typeface, three
 * sizes, sentence case) rather than extracted values.
 *
 * TO FINISH THE BRAND (one file, no component changes):
 *   1. Open viterbointeriordesign.com, read the computed `font-family` on a
 *      heading and on body copy, and the background/foreground colours.
 *   2. Replace `typeface.stack` here and drop the webfont files into
 *      `public/fonts/`, then add the @font-face rules in app/globals.css.
 *   3. Replace the colour values. Nothing else in the app hardcodes a colour.
 *
 * Indigo stays off this screen (§7), but the same codebase re-skins into an
 * Indigo trade-show screen by swapping the export below.
 */

export type Brand = {
  id: 'viterbo' | 'indigo';
  wordmark: string;
  color: {
    /** Deep warm neutral, not pure black — interiors sit better on it. */
    ground: string;
    groundRaised: string;
    ink: string;
    inkMuted: string;
    inkFaint: string;
    hairline: string;
    /** Used with extreme restraint. Never for emphasis on figures. */
    accent: string;
  };
  typeface: {
    /**
     * One typeface, three sizes (§10). A system stack is used as the fallback
     * so a cold start with no network still renders correct metrics — replace
     * the first entry with the studio's own face.
     */
    stack: string;
    /** Sentence case, not tracked-out caps. Caps read as signage. */
    headingTracking: string;
  };
};

export const VITERBO: Brand = {
  id: 'viterbo',
  wordmark: 'Viterbo',
  color: {
    ground: '#14120F',
    groundRaised: '#1C1915',
    ink: '#F2EEE7',
    inkMuted: 'rgba(242, 238, 231, 0.68)',
    inkFaint: 'rgba(242, 238, 231, 0.42)',
    hairline: 'rgba(242, 238, 231, 0.16)',
    accent: '#B9A489',
  },
  typeface: {
    stack:
      "'Viterbo Display', 'Optima', 'Palatino', 'Palatino Linotype', 'Georgia', serif",
    headingTracking: '-0.01em',
  },
};

export const INDIGO: Brand = {
  ...VITERBO,
  id: 'indigo',
  wordmark: 'Indigo',
  color: {
    ...VITERBO.color,
    ground: '#0E1116',
    groundRaised: '#161B22',
    accent: '#8FA6C4',
  },
};

export const BRAND: Brand = VITERBO;
