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
npm run verify         # acceptance harness — see below
```

Look at it in a 1080 × 1920 window, not a desktop one. Better: look at it on the
panel. Add `?overlay=1` to any route to draw the reach-zone bands, the frame
rate, and a live audit of every tap target's position and size.

**`npm run verify` is the gate.** It renders 25 screen states — every route,
every beat of a project, every stage of Craft, the contact form in both keyboard
modes, the full view — at 1080 × 1920, in **both languages**, and fails on:

- a tap target outside 28%–72% of screen height,
- a tap target under 120px on its shortest side,
- text rendered below 24px,
- anything overflowing the pinned 1080 space,
- **text painted underneath the navigation bar**, which is what catches a
  narrative, a figures line or a city list growing into the chrome.

Portuguese is checked because Portuguese runs longer than English almost
everywhere, and a label that fits in one language is not evidence. Run it after
any content or type change — a longer project name is a layout change.

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

All thirteen projects, all ten attract frames and the Studio portrait now run
on the studio's own photography, pulled from the Drive archive and selected
frame by frame — see `docs/image-selection.md` for what was chosen and why.
The placeholder generator (`npm run media:placeholders`) still exists for
sections that have no photography yet; its plates are labelled `PLACEHOLDER`
on purpose, and Craft deliberately renders type instead of using them.

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
| Every interactive element between 28% and 72% of screen height | Enforced. `PRIME` is the intersection of §3 (13–55%) and §15 (28–72%); `npm run verify` fails the build on any breach, and `?overlay=1` shows it live on the panel. |
| Touch targets ≥ 96px (120px if IR) | Enforced by `TapTarget`; keyboard keys are 122px, which is why its rows wrap at eight rather than ten. |
| No text below 24px | `--text-caption: 24px` is the floor in the scale, and `npm run verify` fails on any rendered text below it. |
| Renders at 2160 × 3840 whatever CSS viewport Android reports | Viewport pinned to `width=1080`. |
| ≤ 8 decoded images in memory | `Mounted` unmounts off-screen cards; Embla renders a five-slide window. **Verify over ADB on the panel** — this cannot be verified on a desktop. |
| Survives Wi-Fi disconnection indefinitely | Serwist: precache + cache-first images + navigation fallback. |
| Picks up a new deploy within one reload | Worker updates on a 15-minute heartbeat, on reconnect, and on the five-tap gesture. |
| 90s idle → attract loop, state cleared | `IdleProvider`: router home, scroll containers reset. |
| Language toggle flips every visible string | All copy is `{ en, pt }`, and every screen is verified in both. |
| Gallery at a steady 60fps on the panel's SoC | **Unverified — Phase 0/2 on the panel.** |
| No browser chrome, scrollbars, cursor, selection, context menu | Kiosk reset in `app/globals.css`, plus Fully Kiosk settings above. |
| Relaunch within 5s of a kill | Fully Kiosk setting. |
| Readable and reachable from 60cm | **Unverified — needs a person standing at the panel.** |

## 8. Look

Warm off-white ground (`#FAF8F3`), near-black warm ink, **Cormorant Garamond**
set light at display sizes and at 500 on the 24px floor.

The typeface is self-hosted from npm and bundled into the app, not fetched from
Google Fonts — a kiosk that loses Wi-Fi must not lose its typography. This also
fixes a bug that was invisible from a desktop: the previous Optima/Palatino
stack does not exist on Android, so the panel had been falling back to Noto
Serif the whole time.

Two consequences of a light ground worth knowing:

- **Type over photography stays light.** Full-bleed heroes, the Craft stages and
  the attract loop set their type in `--color-on-media` over `.media-scrim`. A
  light-ground app still puts light type on a photograph, because it is the only
  thing that reads over an image whose tone nobody controls.
- **The navigation bar is frosted, not solid.** On the light ground it is
  invisible; over a full-bleed photograph at 45% an opaque band would cut the
  image in half.

One thing to watch on site: the panel is glossy at 300–350 nits, and a light
screen is the state most likely to mirror the showroom back at the visitor. The
off-white keeps almost all the brightness with less bloom, but position the
totem away from the window wall regardless, and budget €60 for anti-glare film.

## 9. Decisions worth knowing about

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

**The contact form advances rather than letting you pick a field.** Two tappable
field rows plus a 120px keyboard plus an actions row is 1010px of content in the
845px the reach envelope allows. Something had to give, and it should not be key
size on an IR panel — so the fields are display, and one forward button moves
name → email → send. With two fields in an obvious order this costs nothing and
buys back 240px.

**Craft is reached from the end of the collection,** not from the nav. The brief
allows three nav items and Craft is not one of them, so it closes the stack —
the reward for scrolling to the bottom.

## 10. Open — needs the studio or the panel

1. **Craft has no photography.** Its five stages — the Cascais atelier, the
   workshops, the 2,000 m² Port of Lisbon warehouse, crates in transit, an
   installation on site — do not exist anywhere in the archive, and searching
   the wider Drive turns up only carpentry drawings and material from 2014–17.
   This needs a shoot, not a search. Until then each stage renders as
   typography on the ground rather than a placeholder plate; adding `media` to
   a stage in `content/craft.ts` restores the full-bleed treatment with no
   other change. It is the studio's strongest argument and the one section the
   screen cannot currently make.
2. **Images are the 1600px preview set.** The Drive connector this was built
   through refuses files over 10 MB and the masters are 8–24 MB. See
   `docs/image-selection.md`; `canFullBleed()` keeps under-resolution images
   out of the full-bleed treatment, so nothing on screen is upscaled — but a
   ~2560px export would let the portrait heroes take the whole frame.
3. **Copy is draft.** Narratives were written from the photography and are
   deliberately unspecific where the archive does not support a claim. `area`
   and `scope` are absent on almost every project on purpose. The words have
   not been through the studio.
4. **One project name is unconfirmed.** The folder says "Lisbon Palace" but
   every file is named `ViterboIvens` and the shoot is guest rooms. See
   `docs/image-selection.md`.
5. **The palette is matched, not sampled.** The accent gold is taken from the
   studio's own logo, but viterbointeriordesign.com is unreachable from the
   build environment, so ground and ink were matched to a reference. If the
   studio licenses its own face, drop the files in `public/fonts/`, add the
   @font-face rules, and change `typeface.stack` in `config/brand.ts`.
6. **Phase 0 confirms rather than decides.** The app is built to the brief's
   figures and `npm run verify` holds it to them. `/panel-diagnostics.html`
   still exists to check them against the real panel — frame rate and the
   AVIF/WebP choice in particular can only be answered by the SoC — and any
   figure it contradicts is a one-line edit in `config/panel.ts` or
   `config/layout.ts` followed by one command.
7. **The plinth.** The unit ships as a black signage totem on visible castors.
   It does not affect this code, and it is cheaper to plan before the screen is
   standing next to the cabinet of curiosities.
