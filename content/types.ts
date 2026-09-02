/** The content model (§9, extended by §13a). Single typed source of truth. */

export const LOCALES = ['en', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];
/** Named union so adding Spanish later is a one-line change. */

export type Localized = Record<Locale, string>;

export type Aspect = 'landscape' | 'portrait' | 'square';

export type Image = {
  src: string;
  width: number;
  height: number;
  /** Drives band vs full-bleed. Derived at build time from the dimensions. */
  aspect: Aspect;
  blurDataURL: string;
  alt: Localized;
  caption?: Localized;
};

export type Video = {
  kind: 'video';
  src: { mp4: string; webm: string };
  poster: Image;
  durationMs: number;
  aspect: Exclude<Aspect, 'square'>;
  alt: Localized;
  caption?: Localized;
};

export type Media = ({ kind: 'image' } & Image) | Video;

export const asMedia = (image: Image): Media => ({ kind: 'image', ...image });

export function mediaPoster(media: Media): Image {
  return media.kind === 'video' ? media.poster : media;
}

/**
 * Whether an image may take the full frame.
 *
 * A full-bleed portrait hero covers 2160 × 3840 physical pixels. At ~102 ppi
 * and 60cm, upscaling a 1600px source to fill that is visible immediately —
 * §5 is explicit that a soft image is the one thing you cannot hide on this
 * panel. So the layout adapts to the resolution it actually has: an image that
 * cannot fill the frame is shown in a band, where it is asked to cover a
 * quarter of the height and comfortably can.
 *
 * This is not a placeholder for better sources. It is the correct behaviour
 * even once every master is 4K, because the archive will always contain the
 * occasional older shoot.
 */
export const FULL_BLEED_MIN_WIDTH = 2160;

export function canFullBleed(media: Media): boolean {
  const poster = mediaPoster(media);
  return poster.aspect === 'portrait' && poster.width >= FULL_BLEED_MIN_WIDTH;
}

/**
 * Style is the sequencing logic for the collection, not a filter (§7).
 * A visitor scrolling from contemporary to classic to beach house understands
 * the range without ever touching a control.
 */
export type Style = 'contemporary' | 'contemporary-twist' | 'classic' | 'beach-countryside';

export type Project = {
  slug: string;
  name: Localized;
  location: Localized;
  typology: Localized;
  style: Style;
  year?: number;
  area?: string;
  scope?: Localized;
  architect?: string;
  /**
   * Which shoot an image came from. Archival provenance for the studio, NOT
   * rendered on the screen — the facts strip deliberately does not carry a
   * photography credit.
   */
  photographer?: string;
  /** Max ~60 words. Not a case study. */
  narrative: Localized;
  hero: Media;
  gallery: Media[];
  featuredInAttract?: boolean;
  order: number;
};

/**
 * A single stage of the Craft journey (§8): one line of text, one image.
 *
 * `media` is optional, and that is deliberate. The studio's archive currently
 * holds no photography of the atelier, the workshops, the Port of Lisbon
 * warehouse, the crates or an installation — the five things this section
 * exists to show. A stage without its image renders as typography on the
 * ground rather than as a stand-in picture: the screen would rather say less
 * than show a placeholder, and the cities list two screens later proves the
 * type can carry a screen on its own.
 *
 * Add `media` and the stage becomes full-bleed with a scrim. Nothing else
 * needs to change.
 */
export type CraftStage = {
  id: string;
  index: number;
  title: Localized;
  line: Localized;
  media?: Media;
};

export type Collaboration = { name: string; note: Localized };

/** An attract-loop frame carries a place name and nothing else (§8). */
export type AttractFrame = {
  media: Media;
  place: string;
  /** ISO country, used only to keep consecutive frames in different countries. */
  country: string;
};
