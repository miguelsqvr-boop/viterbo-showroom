/**
 * A length in panel-height units.
 *
 * `vh` is wrong inside this app. The panel lays out in a fixed 1080x1920 box
 * (§5), and on anything smaller than that — a laptop, a phone, a preview
 * window — globals.css renders that box at true size and scales it to fit. A
 * `vh` inside the scaled box still measures the browser viewport, so a 58vh
 * card collapsed to a fraction of its height and the whole stack mis-snapped.
 * `--panel-vh` is 1vh on the panel and 19.2px in the scaled preview, so this
 * helper means the same thing in both places.
 */
export function panelVh(value: number): string {
  return `calc(var(--panel-vh) * ${value})`;
}
