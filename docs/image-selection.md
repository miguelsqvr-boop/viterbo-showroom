# Image selection

Working record of which frame goes where, and why. Numbers refer to the
contact sheets generated from the low-res previews in the studio's Drive
archive (`05 - Project images / _LOW-RES PREVIEWS`).

Anyone at the studio can overrule a pick by number — nothing here is load
bearing until the high-res files are pulled and wired.

**Method.** Every project's previews are pulled from Drive, laid out as one
numbered contact sheet, and judged as a whole. For shoots whose files are
named by room the sample covers one frame per room; for shoots numbered in
sequence it is every third frame, since consecutive numbers are almost always
the same room from a slightly different angle.

**Criteria.** The hero is the one frame that says what the project *is*, and a
hero with genuine vertical composition earns the full-bleed treatment on a
portrait panel — most interiors photography is landscape, so this is rarer than
it sounds. The gallery is three or four frames that move from room to detail
without repeating. The attract frame has to read from three metres away and
carry its place name without a caption, which usually means an exterior or a
window.

---

## 1. Castilho 203 — Lisboa — Francisco Nogueira, 2021

Not an apartment: the shared floors of a Lisbon building — lobby, spa, indoor
pool, gym — treated with the care usually given to a private one.

- **Hero — 11.** The indoor pool. Travertine box, dead symmetrical, the water
  holding all the light in the frame.
- **Gallery — 17, 03, 13, 19.** The dried-flower cloud over the brass console;
  the curved cream sofa under copper pendants; the pool through curtains; the
  spa room.
- **Attract — 11.**

## 2. Avenida da República — Lisboa — Francisco Nogueira, 2022

Not yet reviewed.

## 3. Seafront Pied-à-Terre — Cascais — Francisco Nogueira, 2021

Not yet reviewed.

## 4. Chelsea — London — Simon Upton, 2025

- **Hero — 01, DiningRm1.** Portrait composition, so it takes the full frame.
  Hand-painted chinoiserie behind a green banquette: the picture that says what
  this house is, and vertical, which almost no interior shot is.
- **Gallery — 09, 05, 17, 19.** The dining room reading through glass to the
  walled garden (the whole idea of the house in one frame); the teal velvet and
  the artwork; the library; the dark green bedroom.
- **Attract — 08, Exterior1.** White stucco, black door, area railings. Reads
  as London instantly, which is the entire job of an attract frame.
- **Note.** The chinoiserie is almost certainly **de Gournay**, who the brief
  names as a collaborator — this project can carry a link into Collaborations.
- **Note.** Frame 21 is Gracinha and Miguel photographed in this house.

## 5. Singapore Penthouse — Massimo Listri, 2013

Built around a collection of Warhol's *Endangered Species* prints.

- **Hero — 03.** Portrait, the zebra and frog on the gallery wall.
- **Gallery — 02, 05, 07, 04.** The long wall of prints; the mirrored screen
  over the tufted banquette; the living room against the city; the eagle and
  the ape.
- **Attract — 07.** The city through the window is what says Singapore.
- **⚠ Resolution risk.** Ten frames only, from 2013, visibly softer and smaller
  than the rest of the archive. To be checked against the 2160px requirement
  when the high-res is pulled; if it falls short, say so rather than ship a
  soft hero on a 102 ppi panel viewed from 60cm.

## 6. Seafront Apartment — Rio de Janeiro, 2014

Not yet reviewed. Same vintage as Singapore — check resolution.

## 7. Porto Villa — José Manuel Ferrão, 2023

Not yet reviewed.

## 8. Bangkok Estate — Sean Myers, 2016

Not yet reviewed. Three folders (public areas, penthouse 1, penthouse 2) are
one project and should be selected across all three.

## 9. Lisbon Palace — Francisco Nogueira, 2020

- **Hero — 06.** A pair of lit arched niches lined with hand-painted
  chinoiserie against a deep grey-green wall. Portrait, and the signature of
  the place.
- **Gallery — 05, 03, 09, 17.** The curved velvet sofa in front of those
  panels; the azulejo-framed bathroom; the yellow-and-blue striped curtains at
  the window; the floral bedroom.
- **⚠ Naming.** The folder says "Lisbon Palace" but every file is named
  `ViterboIvens`, and the shoot is overwhelmingly bedrooms and bathrooms —
  more guest rooms than private apartment. The studio should confirm what this
  project is called on the screen before it goes live; the app currently shows
  "Lisbon Palace", which may be wrong.

## 10. Hotel Albatroz — Cascais — Francisco Almeida Dias, 2019


- **Hero — 06.** The striped stair hall over an azulejo dado, arched windows
  above. Portrait, and unmistakably Portuguese without a caption saying so.
- **Gallery — 07, 08, 03, 09.** The bar framed by its doorway over a
  checkerboard floor; the restaurant; the gilded crane screen against the blue
  banquette; a bedroom.
- **Attract — 06.**
- **Alternative hero — 05,** the BAR door between azulejo panels, also portrait.

## 11. Estoril Estate — Francisco Nogueira, 2022

Not yet reviewed.

## 12. Tuscany Estate — José Manuel Ferrão, 2022

The richest set in the archive so far, and the only one with real landscape.

- **Hero — 05.** The arched stone entry, iron gate open onto cypresses.
  Portrait, and it is the whole estate in one frame.
- **Gallery — 06, 10, 12, 19.** The living room under its stone arch; the
  brick-vaulted dining room; the hand-painted green kitchen; the four-poster.
- **Attract — 03.** Wheat and cypresses, portrait. Says Tuscany from across
  the room without a caption, which is exactly the job. (04, the estate seen
  small across the hay field, is the landscape alternative.)
- **Note.** Frame 01 is Gracinha and Miguel carrying baskets in the courtyard —
  another Studio candidate, and the warmest of them.

## 13. Cabana Sass — Algarve — Francisco Almeida Dias, 2026

Not yet reviewed.

---

## Studio

Miguel and Gracinha appear inside their own work in at least three shoots —
Castilho frames 05/06/07, Chelsea frame 21 — which is a better Studio image
than a posed portrait against a backdrop. There is also a dedicated
"Miguel and Gracinha" folder to review alongside them.

## ⚠ Resolution: the 10 MB ceiling

The archive holds two sets: `_LOW-RES PREVIEWS` at **1600px** on the long edge,
and full masters at **8–24 MB** each.

The Drive connector this session reads through refuses any file over **10 MB**,
and almost every master is above it — Tuscany's chosen frames are 12, 12, 23,
12, 21 and 10 MB. So the masters cannot be pulled through this route at all,
and every image currently wired into the app comes from the 1600px preview set.

What that costs, precisely: a full-bleed portrait hero covers 2160 × 3840
physical pixels, and 1600px upscaled to fill that is visibly soft at 60cm on a
102 ppi panel. A collection band (2160 × ~1000) and a gallery slide (~920 wide)
are comfortably served by 1600px.

So the app now adapts rather than pretending: `canFullBleed()` in
content/types.ts grants the full frame only to a portrait image of at least
2160px, and anything short of that gets the band treatment, which it can
actually fill. Nothing on the screen is upscaled beyond what it can carry.

**To lift it**, any one of these works:
- export a ~2560px set alongside the previews, which clears both the 10 MB cap
  and the 2160 requirement with room to spare;
- or run `npm run media:process` locally against the real masters — the
  pipeline is already written for exactly this and needs no changes;
- or hand the repo a `media-src/` folder with the chosen frames at full size.

Until then the layout is correct and honest, and the heroes are banded rather
than soft.

## Craft — the gap

The Craft journey is five stages: the Cascais atelier, the workshops, the
2,000 m² warehouse at the Port of Lisbon, crates in transit, and installation
on site. The archive as first seen held finished-interiors photography only —
no benches, no warehouse, no crates, no install. More material is being
uploaded; this is the section to check on each pass, because it is the
studio's strongest argument and it cannot be assembled from room photography.

Pastéis de Belém and the Lisbon Arts & Antiques Fair are both in the archive
and belong to the Collaborations strand that closes Craft.
