/**
 * The attract loop (§7a) — the most efficient communication of reach on the
 * whole screen, because it costs no interaction at all.
 *
 * Each frame carries its place name and nothing else. Consecutive frames are
 * in different countries; the sequence below alternates PT with somewhere else
 * throughout, and `adjacentCountryClashes` asserts it rather than trusting the
 * author to keep it true as frames are added.
 */
import type { AttractFrame, Media } from './types';
import { asMedia } from './types';
import { plate } from './generated/placeholder-media';
import { media } from './generated/media';

const img = (key: string, en: string, pt: string): Media =>
  asMedia({ ...media(key), alt: { en, pt } });

export const ATTRACT: AttractFrame[] = [
  { media: img('castilho-203/hero', 'An indoor pool lined in travertine, Lisboa', 'Uma piscina interior revestida a travertino, Lisboa'), place: 'Lisboa', country: 'PT' },
  { media: img('chelsea/attract', 'A white stucco townhouse behind area railings, London', 'Uma casa de estuque branco atrás de gradeamento, Londres'), place: 'London', country: 'GB' },
  { media: asMedia(plate('cabana-sass-hero')), place: 'Algarve', country: 'PT' },
  { media: img('singapore-penthouse/03', 'A living room against the city skyline, Singapore', 'Uma sala de estar contra a linha da cidade, Singapura'), place: 'Singapore', country: 'SG' },
  { media: img('hotel-albatroz/hero', 'A striped stair hall above an azulejo dado, Cascais', 'Uma escadaria às riscas sobre um lambril de azulejo, Cascais'), place: 'Cascais', country: 'PT' },
  { media: asMedia(plate('bangkok-estate-hero')), place: 'Bangkok', country: 'TH' },
  { media: asMedia(plate('porto-villa-hero')), place: 'Porto', country: 'PT' },
  { media: img('tuscany-estate/attract', 'Wheat and cypresses on the estate, Tuscany', 'Trigo e ciprestes na propriedade, Toscana'), place: 'Tuscany', country: 'IT' },
  { media: asMedia(plate('estoril-estate-hero')), place: 'Estoril', country: 'PT' },
  { media: asMedia(plate('rio-de-janeiro-hero')), place: 'Rio de Janeiro', country: 'BR' },
];

/** Dev guard: two frames from the same country must never sit next to each other. */
export function adjacentCountryClashes(frames: AttractFrame[] = ATTRACT): string[] {
  const clashes: string[] = [];
  for (let i = 0; i < frames.length; i += 1) {
    const next = frames[(i + 1) % frames.length];
    if (frames[i].country === next.country) clashes.push(`${frames[i].place} → ${next.place}`);
  }
  return clashes;
}
