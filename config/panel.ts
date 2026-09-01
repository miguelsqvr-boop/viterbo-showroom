/**
 * The panel, as specified — and the operating values the app is laid out
 * against.
 *
 * These are not placeholders. `npm run verify` renders every screen at this
 * geometry and asserts the layout honours them, so changing a number here
 * changes what the app is held to. `/panel-diagnostics.html` remains available
 * to re-measure on site, and any figure it contradicts is a one-line edit.
 */

export const PHYSICAL = {
  diagonalInches: 43,
  /** Native 3840 × 2160, mounted portrait. Aspect is exactly 9:16. */
  nativeWidth: 2160,
  nativeHeight: 3840,
  /** Active glass in the mounted orientation. */
  glassWidthCm: 53.6,
  glassHeightCm: 95.2,
  /** 60Hz. Target 60fps, never aim higher. */
  refreshHz: 60,
  /**
   * The CSS space the viewport meta pins, whatever density Android reports
   * (§5). Every type size in the brief is written for this space.
   */
  cssWidth: 1080,
  cssHeight: 1920,
} as const;

/** ~102 ppi over a 37.5" × 21.1" panel — a soft image is visible at 60cm. */
export const PPI = Math.round(
  Math.hypot(PHYSICAL.nativeWidth, PHYSICAL.nativeHeight) / PHYSICAL.diagonalInches,
);

export type TouchType = 'ir' | 'pcap';

export const PANEL = {
  /**
   * IR, per the brief: likely on a totem at this price, and the conservative
   * choice either way — an IR-built interface degrades gracefully on a PCAP
   * panel, where the reverse is not true. Switching to 'pcap' restores pinch
   * zoom and drops targets to 96px, and nothing else changes.
   */
  touchType: 'ir' as TouchType,

  /** §4 says 96px; §6 raises it to 120px on IR, which is imprecise near contact. */
  minTouchTarget: 120, // 96 if pcap

  /** IR multi-touch is jittery — double-tap zoom replaces pinch. */
  enablePinchZoom: false, // true if pcap

  /** IR panels produce spurious double-fires. */
  tapDebounceMs: 60,

  /** Return to the attract loop with all state cleared. */
  idleTimeoutMs: 90_000,

  /** Attract loop: hold 7s, dissolve 1.2s. */
  attract: {
    holdMs: 7_000,
    crossfadeMs: 1_200,
    /** Barely perceptible drift, so the screen reads as alive but not animated. */
    scaleFrom: 1.0,
    scaleTo: 1.04,
  },

  /** Taps on the Viterbo mark that force a service-worker refresh (§2). */
  forceRefreshTapCount: 5,
  forceRefreshWindowMs: 3_000,

  /** §13 — hard ceiling on decoded full-size bitmaps. */
  maxDecodedImages: 8,
} as const;

/** Convenience: the touch-target floor, in the pinned 1080 CSS space. */
export const TOUCH_MIN = PANEL.minTouchTarget;
