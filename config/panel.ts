/**
 * Panel facts and contingencies.
 *
 * Everything the brief marks Unconfirmed lives here as a single flag so that
 * confirming it on site is a one-line edit, never a rewrite. Run
 * `/panel-diagnostics.html` on the panel (Phase 0) and set these from what it
 * reports — do not lay out a screen against assumed numbers.
 */

export type TouchType = 'ir' | 'pcap';

export const PANEL = {
  /**
   * UNCONFIRMED until diagnostics. `ir` is the conservative assumption for a
   * totem at this price: it degrades gracefully on a PCAP panel, where the
   * reverse is not true.
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
