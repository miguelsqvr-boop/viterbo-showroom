'use client';

import { SPECIALTIES } from '@/content/specialties';
import { SequenceView } from './Sequence';

/**
 * Specialties (§8) — what the studio is expert at, one to a screen.
 *
 * Same renderer as Services, and that is the point: a visitor who has already
 * scrolled one numbered sequence knows how to read this one. See Sequence.
 */
export function SpecialtiesView() {
  return <SequenceView items={SPECIALTIES} label="specialties" />;
}
