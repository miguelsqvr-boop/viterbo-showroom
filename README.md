# Viterbo — Showroom Touchscreen

A portrait kiosk app for a 43" floor-standing totem in the Cascais showroom.
Next.js 15 on Vercel, displayed by Fully Kiosk Browser on the panel's own
Android, with a service worker so a Wi-Fi outage is invisible.

This is a self-contained app. It lives in a subdirectory of this repository but
shares nothing with the code at the repo root — deploy it with the Vercel
project's **Root Directory** set to `viterbo-showroom`, and it gets its own URL.

---

## 1. Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

Look at it in a 1080 × 1920 window, not a desktop one. Better: look at it on the
panel. Add `?overlay=1` to any route to draw the reach-zone bands, the frame
rate, and a live audit of every tap target's position and size.

## 2. Phase 0 — measure before you design

`/panel-diagnostics.html` is a standalone page with no build step. Open it on
the panel, in the mounted orientation, before laying out a single screen. It
reports:

| What | Why it matters |
|---|---|
| `innerWidth` × `devicePixelRatio` | Confirms the CSS viewport. The app pins 1080, so either density works — but confirm the panel really is 2160 × 3840. |
| Contact radius and pressure | Decides **IR vs PCAP**, which changes pinch-vs-double-tap and 96px-vs-120px targets. |
| Frame rate under stress | Decides whether the panel's SoC drives the app or whether a €150 mini PC goes in the player bay. |
| AVIF vs WebP decode | AVIF is smaller and slower to decode. On a weak SoC, WebP can win. Do not assume. |
| `deviceMemory` | The decoded-bitmap ceiling is sized against this. |

Then take one tape measure from the floor to the **bottom of the active glass**.
If it is not ~82cm, change `SCREEN_BOTTOM_CM` in `config/layout.ts` and every
band in the app recomputes.

Write the answers into `config/panel.ts` and `config/layout.ts`. Nothing else
needs touching.

## 3. Where things live

```
config/panel.ts      touch type, target size, debounce, idle timeout, attract timing
config/layout.ts     the reach zone — cm → %, prime band, chrome position
config/brand.ts      colour and type. The ONLY file that knows what the studio looks like
content/*.ts         projects, craft, studio, contact, and every UI string, EN + PT
components/          PrimeBand, TapTarget, MediaFrame, Gallery, FullView, Keyboard…
scripts/             image pipeline, QR generation, placeholder plates
public/panel-diagnostics.html
```

## 4. Content

No CMS. Content is typed data in `content/`, pushed to `main`, built by Vercel,
picked up by the panel on the next service-worker revalidation — or immediately
via the hidden gesture below.

Every user-facing string is `{ en, pt }`. There is no hardcoded copy in any
component, so the language toggle flips everything including button labels and
the attract-loop invitation.

**Images.** Drop full-resolution originals (3840px on the long edge or better)
into `media-src/<project-slug>/` and run:

```bash
npm run media:process              # masters + typed metadata + blurDataURL
npm run media:process -- --variants  # also emit 1080/1620/2160 in AVIF and WebP
                                     # for the on-panel format A/B
```

`next/image` is configured to emit exactly 1080 / 1620 / 2160 and nothing else,
so a collection thumbnail can never be handed a 2160px file.

Until real photography exists the app runs on generated placeholder plates
(`npm run media:placeholders`). They are labelled `PLACEHOLDER` on purpose.

**Video** is supported in the content model (`Media` union) but no clips ship
yet. The rules are strict: silent with no audio track at all, 8–20s seamless
loop, no titles or end cards, `autoplay muted loop playsinline`, under 8MB,
encoded at 1080×1920 or 1620 wide. Never a YouTube embed — it would put
youtube.com on the kiosk allowlist and undo the lockdown. Only one `<video>`
plays at a time; everything else shows a poster frame.

## 5. Deploy

1. New Vercel project from this repo, **Root Directory** `viterbo-showroom`.
2. Add the domain — `showroom.viterbo.pt` or a subdomain of the studio's live
   domain. `X-Robots-Tag: noindex` is already set on every route, and
   `/robots.txt` disallows everything.
3. Set `CONTACT_WEBHOOK_URL` (see `.env.example`) **or** set
   `CONTACT.formEnabled = false` in `content/contact.ts`. With neither, the form
   deliberately fails loudly rather than swallowing a lead.
4. Point Fully Kiosk at the URL.

Updates: push to `main`. The panel picks the deploy up on its next
revalidation. To force it in the room, **tap the Viterbo wordmark five times
within three seconds** — the service worker updates and the page reloads. No
Android settings, no keyboard.

## 6. Fully Kiosk Browser

Licence is a one-off, roughly €10, and it is the right tool: URL allowlisting,
auto-launch on boot, crash auto-restart, motion-triggered wake, screen
scheduling, remote admin over the LAN, and no browser chrome.

- **Start URL** locked to the showroom origin; allowlist that origin plus Vercel
  asset hosts, nothing else.
- **Kiosk mode on**; status bar and navigation bar hidden.
- **Screensaver off** — the app's own attract loop replaces it.
- **Auto-launch on boot**, auto-reload on crash, reload on network reconnect.
- **Motion detection** to wake the panel; scheduled screen-off outside showroom
  hours. A totem burning 350 nits into an empty room at 3am shortens the panel's
  life for nothing.
- **Disable** pull-to-refresh, text selection, long-press context menu, browser
  zoom.
- **Remote admin** on the local network only, with a password.
- **Android developer options**: disable system gestures and lock screen.

## 7. Acceptance criteria

| Criterion | Status |
|---|---|
| Every interactive element between 28% and 72% of screen height | Enforced. `PRIME` is the intersection of §3 (13–55%) and §15 (28–72%), and `?overlay=1` audits every on-screen tap target live. |
| Touch targets ≥ 96px (120px if IR) | Enforced by `TapTarget`; keyboard keys are 122px, which is why its rows wrap at eight rather than ten. |
| No text below 24px | `--text-caption: 24px` is the floor in the scale; nothing smaller is defined. |
| Renders at 2160 × 3840 whatever CSS viewport Android reports | Viewport pinned to `width=1080`. |
| ≤ 8 decoded images in memory | `Mounted` unmounts off-screen cards; Embla renders a five-slide window. **Verify over ADB on the panel** — this cannot be verified on a desktop. |
| Survives Wi-Fi disconnection indefinitely | Serwist: precache + cache-first images + navigation fallback. |
| Picks up a new deploy within one reload | Worker updates on a 15-minute heartbeat, on reconnect, and on the five-tap gesture. |
| 90s idle → attract loop, state cleared | `IdleProvider`: router home, scroll containers reset. |
| Language toggle flips every visible string | All copy is `{ en, pt }`. |
| Gallery at a steady 60fps on the panel's SoC | **Unverified — Phase 0/2 on the panel.** |
| No browser chrome, scrollbars, cursor, selection, context menu | Kiosk reset in `app/globals.css`, plus Fully Kiosk settings above. |
| Relaunch within 5s of a kill | Fully Kiosk setting. |
| Readable and reachable from 60cm | **Unverified — needs a person standing at the panel.** |

## 8. Decisions worth knowing about

**The reach envelope is 28%–55%, not 13%–55%.** §3 and §15 of the brief give
different numbers. This build uses the intersection so both are satisfied
without arbitration. The 15% that is given up at the top goes to imagery.

**Collection images are not tappable.** At their snapped position they sit above
28%. The name-and-location block is the target, and the photography is left
alone to be photography.

**Only the card resting in the prime band is tappable.** The collection always
has a card peeking below the fold whose name block lands around 90% of screen
height — furniture, not interface. Off-band cards render as plain boxes with no
handler at all.

**The project screen is four snapped beats,** not one scroll. Sixty words at 32px
on a 34–40 character measure is ten lines; stacked under a hero and a title it
runs straight through the navigation bar. Giving the narrative its own screen
costs one flick.

**The cities list has no heading and tight leading.** Nineteen lines at the body
measure is 38% of the panel. Any looser and the bar at 45% cuts three cities out
of the middle of a list whose whole point is an uninterrupted sweep.

**Craft is reached from the end of the collection,** not from the nav. The brief
allows three nav items and Craft is not one of them, so it closes the stack —
the reward for scrolling to the bottom.

## 9. Open — needs the studio or the panel

1. **Brand tokens are provisional.** `config/brand.ts` carries the brief's own
   direction (deep warm neutral, one serif, sentence case) because
   viterbointeriordesign.com is not reachable from the build environment. Read
   the live site's computed `font-family` and colours, drop the webfont into
   `public/fonts/`, and replace that one file.
2. **All copy is draft.** Structure is final; the words have not been through
   the studio.
3. **All imagery is placeholder.** See §4.
4. **Phase 0 is not done.** Touch type, CSS viewport, frame rate, codec choice
   and the mounting height are all still assumptions.
5. **Glare and plinth.** The panel is glossy at 300–350 nits and ships as a
   black signage totem on visible castors. Neither affects this code, and both
   are cheaper to plan before the screen is standing next to the cabinet of
   curiosities.
