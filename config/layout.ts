/**
 * The reach zone (§3) — the governing constraint of this build.
 *
 * The unit is a 181cm floor-standing totem; the 95.2cm panel spans 82cm to
 * 177cm off the floor. Comfortable touch is 100–165cm, comfortable gaze is
 * 125–177cm, and the overlap is 125–165cm — which on this panel is 13% to 55%
 * down from the top.
 *
 * The whole geometry hangs off the two numbers below. Change either and every
 * band in the app recomputes; `npm run verify` then re-checks every screen
 * against the new bands, so a re-measurement on site is a one-line edit
 * followed by one command.
 */

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
 * Fixed chrome (nav bar).
 *
 * §7 put the bar at 45% — inside the prime band, roughly 130cm off the floor
 * on a 181cm totem, which is where a hand goes without thinking. That is still
 * the ergonomically correct answer and it is not what is here.
 *
 * Miguel tested the panel in the showroom and the mid-screen bar reads as an
 * interruption: it crosses every photograph at the waist, and a visitor does
 * not look for navigation in the middle of a picture. Pinned to the top it
 * reads as chrome, which is what it is. That judgement came from standing in
 * front of the thing, which beats the geometry argument.
 *
 * The cost is real and worth writing down: the top of the glass sits around
 * 175cm, so the bar is now above shoulder height for most people and out of
 * comfortable reach from a wheelchair. If that bites on site, put it back to
 * 45 — but that is not a one-number change. The bar is the only thing these
 * two values position; the blocks on each screen carry their own anchors,
 * tuned by measurement to whatever the bar was doing at the time, and moving
 * the bar back means re-tuning them. `npm run verify` will tell you which
 * ones: it fails on type under the bar and on type off the bottom of a
 * snapped page, which between them catch the collisions.
 */
export const CHROME = {
  barTop: 0,
  /*
   * 11%, not 9%. The bar carries two rows now — the studio's mark above, the
   * five items and the language toggle below — because Miguel asked for a
   * bigger, more legible menu on 10 September and 40px labels do not fit
   * beside the mark on one line: in Portuguese the row alone measures wider
   * than the panel. Stacking frees the whole 1080 for the menu.
   *
   * 11% is 211px, which is what the two rows actually need: a 26px mark, 16px
   * of air, and a 120px tap target, leaving about 24px above and below. It is
   * not a free number — COLLECTION.cardTop moved with it, below.
   */
  barHeight: 11,
} as const;

/**
 * Collection geometry, in vh, expressed so the whole stack scales with the
 * panel rather than with an assumed pixel height (§5).
 */
export const COLLECTION = {
  /**
   * Where a snapped card's image band begins. 14%, not 6%: the bar is pinned
   * to the top and occupies the first 11%, so a card resting at 6% put the
   * previous card's name under it — `npm run verify` caught "Chelsea"
   * overlapping by 22px in the middle of the list. It was 12 while the bar was
   * 9% tall; both moved by 2 on 10 September so the clearance below the bar
   * stays the 58px that was working.
   */
  cardTop: 14,
  imageHeight: 26,
  metaHeight: 11,
  /** Distance from one snap position to the next. Leaves the next card peeking. */
  cardStride: 58,
} as const;
