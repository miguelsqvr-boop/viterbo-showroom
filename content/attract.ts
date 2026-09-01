/**
 * The attract loop (§7a) — the most efficient communication of reach on the
 * whole screen, because it costs no interaction at all.
 *
 * Each frame carries its place name and nothing else: no project name, no
 * year, no caption. Consecutive frames are in different countries; the helper
 * below asserts it rather than trusting the author to keep it true.
 */
import type { AttractFrame } from './types';
import { asMedia } from './types';
import { plate } from './generated/placeholder-media';

export const ATTRACT: AttractFrame[] = [
  { media: asMedia(plate('restelo-hero')), place: 'Lisboa', country: 'PT' },
  { media: asMedia(plate('monaco-terrace-hero')), place: 'Monaco', country: 'MC' },
  { media: asMedia(plate('bangkok-house-hero')), place: 'Bangkok', country: 'TH' },
  { media: asMedia(plate('london-mews-hero')), place: 'London', country: 'GB' },
  { media: asMedia(plate('tuscan-farmhouse-hero')), place: 'Tuscany', country: 'IT' },
  { media: asMedia(plate('singapore-tower-hero')), place: 'Singapore', country: 'SG' },
  { media: asMedia(plate('comporta-dunes-hero')), place: 'Comporta', country: 'PT' },
  { media: asMedia(plate('sao-paulo-penthouse-hero')), place: 'São Paulo', country: 'BR' },
  { media: asMedia(plate('madrid-classic-hero')), place: 'Madrid', country: 'ES' },
  { media: asMedia(plate('bela-vista-hero')), place: 'Algarve', country: 'PT' },
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
