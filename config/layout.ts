/**
 * The reach zone (§3) — the governing constraint of this build.
 *
 * The unit is a 181cm floor-standing totem; the 95.2cm panel spans roughly
 * 82cm to 177cm off the floor. Comfortable touch is 100–165cm, comfortable
 * gaze is 125–177cm, and the overlap is 125–165cm — which on this panel is
 * 13% to 55% down from the top.
 *
 * MEASURE ON ARRIVAL. Floor to the bottom of the active glass settles it. If
 * SCREEN_BOTTOM_CM differs by more than 5cm from the derived value, change the
 * two constants below and every band in the app recomputes.
 */

/** Derived from the chassis drawing — confirm with a tape measure (Phase 0). */
export const SCREEN_BOTTOM_CM = 82;
export const SCREEN_TOP_CM = 177;
const SCREEN_SPAN_CM = SCREEN_TOP_CM - SCREEN_BOTTOM_CM;

/** Height off the floor -> percentage down from the top of the screen. */
export function cmToPercentFromTop(cm: number): number {
  return ((SCREEN_TOP_CM - cm) / SCREEN_SPAN_CM) * 100;
}

export const ZONES = {
  /** Above this: reachable, but at the stretch limit for a 155cm visitor. */
  primeTop: cmToPercentFromTop(165), // ~12.6%
  /** Below this: reachable, but the gaze angle is already poor. */
  primeBottom: cmToPercentFromTop(125), // ~54.7%
  /** Below this: display only. Never a button, never a swipe target. */
  secondaryBottom: cmToPercentFromTop(110), // ~70.5%
} as const;

/**
 * The band every primary control renders inside.
 *
 * §3 gives 13%–55%. §15 gives 28%–72%. The two do not agree, so this build
 * uses the intersection — 28%–55% — which satisfies both without argument.
 * The extra 15% at the top is spent on imagery, which is where it belongs on
 * a totem anyway.
 */
export const PRIME = {
  top: 28,
  bottom: 55,
} as const;

/**
 * Fixed chrome (nav bar, back affordance) — §7 puts the bar at roughly 45%
 * from the top, inside the prime band rather than pinned to the bottom edge.
 * On a 181cm totem a bottom-pinned bar lands at 85cm off the floor.
 */
export const CHROME = {
  barTop: 45,
  barHeight: 9,
} as const;

/**
 * Collection geometry, in vh, expressed so the whole stack scales with the
 * panel rather than with an assumed pixel height (§5).
 */
export const COLLECTION = {
  /** Where a snapped card's image band begins. */
  cardTop: 6,
  imageHeight: 26,
  metaHeight: 11,
  /** Distance from one snap position to the next. Leaves the next card peeking. */
  cardStride: 58,
} as const;
