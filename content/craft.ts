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
/**
 * Where the studio has worked, swept outward from home — never alphabetically,
 * never grouped by country.
 *
 * Each carries its coordinates because the same array feeds two screens: the
 * map plots these points and the list names them, in this order. Keeping the
 * places and their positions in one array is what stops a city being added to
 * the list and quietly missing from the map.
 *
 * Some of these are regions rather than cities — Algarve, Tuscany. The point
 * plotted is the middle of the region; the studio's own page calls them all
 * places it has worked, and so does this.
 */
export type City = { name: string; lon: number; lat: number };

export const CITIES: City[] = [
  { name: 'Cascais', lon: -9.42, lat: 38.7 },
  { name: 'Lisboa', lon: -9.14, lat: 38.72 },
  { name: 'Comporta', lon: -8.79, lat: 38.38 },
  { name: 'Algarve', lon: -8.0, lat: 37.1 },
  { name: 'Porto', lon: -8.61, lat: 41.15 },
  { name: 'Málaga', lon: -4.42, lat: 36.72 },
  { name: 'Madrid', lon: -3.7, lat: 40.42 },
  { name: 'Paris', lon: 2.35, lat: 48.86 },
  { name: 'London', lon: -0.13, lat: 51.51 },
  { name: 'Monaco', lon: 7.42, lat: 43.74 },
  { name: 'Tuscany', lon: 11.25, lat: 43.77 },
  { name: 'Lugano', lon: 8.95, lat: 46.01 },
  { name: 'Geneva', lon: 6.14, lat: 46.2 },
  { name: 'Luanda', lon: 13.23, lat: -8.84 },
  { name: 'Macau', lon: 113.54, lat: 22.2 },
  { name: 'Bangkok', lon: 100.5, lat: 13.76 },
  { name: 'Singapore', lon: 103.82, lat: 1.35 },
  { name: 'Rio de Janeiro', lon: -43.17, lat: -22.91 },
  { name: 'São Paulo', lon: -46.63, lat: -23.55 },
];
export const COLLABORATIONS: Collaboration[] = [
  { name: 'de Gournay', note: { en: 'Hand-painted wallpapers', pt: 'Papéis pintados à mão' } },
  { name: 'Nespresso', note: { en: 'Retail concept', pt: 'Conceito de retalho' } },
  { name: 'Star Alliance', note: { en: 'Lounge interiors', pt: 'Interiores de lounge' } },
  { name: 'Pastéis de Belém', note: { en: 'Rooms and counters', pt: 'Salas e balcões' } },
];
