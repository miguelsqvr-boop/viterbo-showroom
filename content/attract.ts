/**
 * The attract loop (§7a) — the most efficient communication of reach on the
 * whole screen, because it costs no interaction at all.
 *
 * Each frame carries its place name and nothing else. Consecutive frames are
 * in different countries; the sequence below alternates PT with somewhere else
 * throughout, and `adjacentCountryClashes` asserts it rather than trusting the
 * author to keep it true as frames are added.
 */
import type { AttractFrame } from './types';
import { asMedia } from './types';
import { plate } from './generated/placeholder-media';

export const ATTRACT: AttractFrame[] = [
  { media: asMedia(plate('castilho-203-hero')), place: 'Lisboa', country: 'PT' },
  { media: asMedia(plate('chelsea-hero')), place: 'London', country: 'GB' },
  { media: asMedia(plate('cabana-sass-hero')), place: 'Algarve', country: 'PT' },
  { media: asMedia(plate('singapore-penthouse-hero')), place: 'Singapore', country: 'SG' },
  { media: asMedia(plate('hotel-albatroz-hero')), place: 'Cascais', country: 'PT' },
  { media: asMedia(plate('bangkok-estate-hero')), place: 'Bangkok', country: 'TH' },
  { media: asMedia(plate('porto-villa-hero')), place: 'Porto', country: 'PT' },
  { media: asMedia(plate('tuscany-estate-hero')), place: 'Tuscany', country: 'IT' },
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
