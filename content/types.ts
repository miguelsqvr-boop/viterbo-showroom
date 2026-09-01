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
  /** Max ~60 words. Not a case study. */
  narrative: Localized;
  hero: Media;
  gallery: Media[];
  featuredInAttract?: boolean;
  order: number;
};

/** A single stage of the Craft journey (§8). One line of text, one piece of media. */
export type CraftStage = {
  id: string;
  index: number;
  title: Localized;
  line: Localized;
  media: Media;
};

export type Collaboration = { name: string; note: Localized };

/** An attract-loop frame carries a place name and nothing else (§8). */
export type AttractFrame = {
  media: Media;
  place: string;
  /** ISO country, used only to keep consecutive frames in different countries. */
  country: string;
};
