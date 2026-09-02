/**
 * The art of craft (§8) — a journey, not a gallery.
 *
 * Five stages, each one screenful, one line of text, and — when the studio has
 * it — one image. None of the five has photography in the archive yet, so each
 * stage currently renders as type on the ground. That is an honest empty state,
 * not a broken one: the section still reads, and it stops the screen showing a
 * placeholder plate where a workshop bench should be.
 *
 * The sequence is the argument: designed in Cascais, made in our own workshops, inspected at the
 * Port of Lisbon, installed by our own people anywhere in the world.
 */
import type { CraftStage, Collaboration } from './types';

export const CRAFT_STAGES: CraftStage[] = [
  {
    id: 'cascais',
    index: 1,
    title: { en: 'Cascais', pt: 'Cascais' },
    line: { en: 'The atelier. Where it is drawn.', pt: 'O atelier. Onde se desenha.' },
  },
  {
    id: 'workshops',
    index: 2,
    title: { en: 'The workshops', pt: 'As oficinas' },
    line: {
      en: 'Upholstery, curtains, carpentry, and an artistic team. Where it is made.',
      pt: 'Estofos, cortinados, carpintaria e uma equipa artística. Onde se faz.',
    },
  },
  {
    id: 'port-of-lisbon',
    index: 3,
    title: { en: 'Port of Lisbon', pt: 'Porto de Lisboa' },
    line: {
      en: '2,000 m². Where every piece is inspected before it leaves.',
      pt: '2000 m². Onde cada peça é inspecionada antes de partir.',
    },
  },
  {
    id: 'in-transit',
    index: 4,
    title: { en: 'In transit', pt: 'Em trânsito' },
    line: { en: 'Crates, travertine, four continents.', pt: 'Grades, travertino, quatro continentes.' },
  },
  {
    id: 'on-site',
    index: 5,
    title: { en: 'On site', pt: 'Em obra' },
    line: {
      en: 'Monaco, Bangkok, London. Our own people, installing.',
      pt: 'Mónaco, Banguecoque, Londres. A nossa equipa, a instalar.',
    },
  },
];

/**
 * The closing frame of the journey. Ordered as a geographic sweep outward from
 * home — never alphabetically, never grouped by country — so the European
 * corridor, the Asia practice and the lusophone world emerge unlabelled.
 * Non-interactive, so it may span the full height of the panel.
 */
export const CITIES: string[] = [
  'Cascais',
  'Lisboa',
  'Comporta',
  'Algarve',
  'Porto',
  'Málaga',
  'Madrid',
  'Paris',
  'London',
  'Monaco',
  'Tuscany',
  'Lugano',
  'Geneva',
  'Luanda',
  'Macau',
  'Bangkok',
  'Singapore',
  'Rio de Janeiro',
  'São Paulo',
];

export const COLLABORATIONS: Collaboration[] = [
  { name: 'de Gournay', note: { en: 'Hand-painted wallpapers', pt: 'Papéis pintados à mão' } },
  { name: 'Nespresso', note: { en: 'Retail concept', pt: 'Conceito de retalho' } },
  { name: 'Star Alliance', note: { en: 'Lounge interiors', pt: 'Interiores de lounge' } },
  { name: 'Pastéis de Belém', note: { en: 'Rooms and counters', pt: 'Salas e balcões' } },
];
