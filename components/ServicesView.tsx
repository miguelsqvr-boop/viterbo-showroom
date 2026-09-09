'use client';

import { SERVICES } from '@/content/services';
import { SequenceView } from './Sequence';

/** Services (§8) — what the studio sells, one to a screen. See Sequence. */
export function ServicesView() {
  return <SequenceView items={SERVICES} label="services" />;
}
