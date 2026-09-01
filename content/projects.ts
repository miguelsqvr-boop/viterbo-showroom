/**
 * The collection.
 *
 * Names, locations, years, typologies and photographer credits are REAL — read
 * from the studio's own archive. Narratives are DRAFT: written from the
 * photography where I have seen it, deliberately unspecific where I have not,
 * and making no claim about area, budget or scope that the archive does not
 * support. They are placeholders for the studio's own words, not a substitute
 * for them.
 *
 * Deliberately absent: `area` and `scope` on most projects. Inventing a square
 * metre figure for a screen that stands in front of clients would be worse
 * than leaving the line out, and the facts strip renders only what is present.
 *
 * Sequencing (§7): contemporary → contemporary with a twist → classic → beach
 * and countryside, interleaving homes and hotels, so the range is felt by
 * scrolling rather than filtered by tapping. `style` is never rendered as a
 * control. Geography is left to emerge: Lisboa, Lisboa, Cascais, London,
 * Singapore, Rio, Porto, Bangkok, Lisboa, Cascais, Estoril, Tuscany, Algarve.
 */
import type { Project } from './types';
import { asMedia } from './types';
import { plate } from './generated/placeholder-media';

const gallery = (slug: string) => [1, 2, 3].map((n) => asMedia(plate(`${slug}-${n}`)));
const hero = (slug: string) => asMedia(plate(`${slug}-hero`));

export const PROJECTS: Project[] = [
  {
    slug: 'castilho-203',
    order: 1,
    style: 'contemporary',
    name: { en: 'Castilho 203', pt: 'Castilho 203' },
    location: { en: 'Lisboa', pt: 'Lisboa' },
    typology: { en: 'Residents’ floors', pt: 'Pisos comuns' },
    year: 2021,
    photographer: 'Francisco Nogueira',
    narrative: {
      en: 'The shared floors of a Lisbon building, treated with the care usually reserved for a private apartment. Ribbed timber, travertine and a still indoor pool; the lobby seats you rather than moves you through.',
      pt: 'Os pisos comuns de um edifício em Lisboa, tratados com o cuidado normalmente reservado a um apartamento privado. Madeira ripada, travertino e uma piscina interior serena; o átrio convida a ficar em vez de atravessar.',
    },
    hero: hero('castilho-203'),
    gallery: gallery('castilho-203'),
    featuredInAttract: true,
  },
  {
    slug: 'av-republica',
    order: 2,
    style: 'contemporary',
    name: { en: 'Avenida da República', pt: 'Avenida da República' },
    location: { en: 'Lisboa', pt: 'Lisboa' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2022,
    photographer: 'Francisco Nogueira',
    narrative: {
      en: 'An apartment on one of Lisbon’s long avenues, opened up to the light it already had.',
      pt: 'Um apartamento numa das grandes avenidas de Lisboa, aberto à luz que já tinha.',
    },
    hero: hero('av-republica'),
    gallery: gallery('av-republica'),
  },
  {
    slug: 'cascais-seafront',
    order: 3,
    style: 'contemporary',
    name: { en: 'Seafront Pied-à-Terre', pt: 'Pied-à-Terre à Beira-Mar' },
    location: { en: 'Cascais', pt: 'Cascais' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2021,
    photographer: 'Francisco Nogueira',
    narrative: {
      en: 'A small apartment above the water, kept deliberately quiet so the sea is the only thing asking for attention.',
      pt: 'Um apartamento pequeno sobre a água, mantido deliberadamente sereno para que o mar seja a única coisa a pedir atenção.',
    },
    hero: hero('cascais-seafront'),
    gallery: gallery('cascais-seafront'),
  },
  {
    slug: 'chelsea',
    order: 4,
    style: 'contemporary-twist',
    name: { en: 'Chelsea', pt: 'Chelsea' },
    location: { en: 'London', pt: 'Londres' },
    typology: { en: 'Townhouse', pt: 'Casa urbana' },
    year: 2025,
    photographer: 'Simon Upton',
    narrative: {
      en: 'A London townhouse layered rather than decorated. Hand-painted chinoiserie in the dining room, contemporary art in the halls, a walled garden read through glass from the table — each room holding a different century without any of them arguing.',
      pt: 'Uma casa londrina em camadas, não decorada. Chinoiserie pintada à mão na sala de jantar, arte contemporânea nos corredores, um jardim murado visto da mesa através do vidro — cada divisão com um século diferente, sem que nenhum discuta com o outro.',
    },
    hero: hero('chelsea'),
    gallery: gallery('chelsea'),
    featuredInAttract: true,
  },
  {
    slug: 'singapore-penthouse',
    order: 5,
    style: 'contemporary-twist',
    name: { en: 'Singapore Penthouse', pt: 'Cobertura em Singapura' },
    location: { en: 'Singapore', pt: 'Singapura' },
    typology: { en: 'Penthouse', pt: 'Cobertura' },
    year: 2013,
    photographer: 'Massimo Listri',
    narrative: {
      en: 'Built around a collection of Warhol’s Endangered Species prints. The rooms were kept pale and the furniture low, because a wall of Warhols does not need help.',
      pt: 'Construída em torno de uma coleção das gravuras Endangered Species de Warhol. As divisões mantiveram-se claras e o mobiliário baixo, porque uma parede de Warhols não precisa de ajuda.',
    },
    hero: hero('singapore-penthouse'),
    gallery: gallery('singapore-penthouse'),
    featuredInAttract: true,
  },
  {
    slug: 'rio-de-janeiro',
    order: 6,
    style: 'contemporary-twist',
    name: { en: 'Seafront Apartment', pt: 'Apartamento à Beira-Mar' },
    location: { en: 'Rio de Janeiro', pt: 'Rio de Janeiro' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2014,
    narrative: {
      en: 'An apartment facing the Atlantic from the other side.',
      pt: 'Um apartamento virado ao Atlântico, do outro lado.',
    },
    hero: hero('rio-de-janeiro'),
    gallery: gallery('rio-de-janeiro'),
    featuredInAttract: true,
  },
  {
    slug: 'porto-villa',
    order: 7,
    style: 'contemporary-twist',
    name: { en: 'Porto Villa', pt: 'Villa no Porto' },
    location: { en: 'Porto', pt: 'Porto' },
    typology: { en: 'Private house', pt: 'Casa privada' },
    year: 2023,
    photographer: 'José Manuel Ferrão',
    narrative: {
      en: 'A house in the north, where the light is different and the rooms were drawn to hold it longer.',
      pt: 'Uma casa no norte, onde a luz é outra e as divisões foram desenhadas para a reter mais tempo.',
    },
    hero: hero('porto-villa'),
    gallery: gallery('porto-villa'),
  },
  {
    slug: 'bangkok-estate',
    order: 8,
    style: 'classic',
    name: { en: 'Bangkok Estate', pt: 'Propriedade em Banguecoque' },
    location: { en: 'Bangkok', pt: 'Banguecoque' },
    typology: { en: 'Private estate', pt: 'Propriedade privada' },
    year: 2016,
    photographer: 'Sean Myers',
    scope: {
      en: 'Interior architecture and interior design, public areas and penthouses',
      pt: 'Arquitetura e design de interiores, áreas comuns e coberturas',
    },
    narrative: {
      en: 'An estate rather than a house: public rooms, two penthouses, and the interior architecture ours throughout. At this scale nothing holds together unless every threshold is drawn — so every threshold was drawn, made in our workshops, and shipped from the Port of Lisbon.',
      pt: 'Uma propriedade e não uma casa: áreas comuns, duas coberturas e toda a arquitetura de interiores nossa. Nesta escala nada se aguenta sem que cada limiar seja desenhado — por isso todos o foram, feitos nas nossas oficinas e enviados do Porto de Lisboa.',
    },
    hero: hero('bangkok-estate'),
    gallery: gallery('bangkok-estate'),
    featuredInAttract: true,
  },
  {
    slug: 'lisbon-palace',
    order: 9,
    style: 'classic',
    name: { en: 'Lisbon Palace', pt: 'Palácio de Lisboa' },
    location: { en: 'Lisboa', pt: 'Lisboa' },
    typology: { en: 'Palace', pt: 'Palácio' },
    year: 2020,
    photographer: 'Francisco Nogueira',
    narrative: {
      en: 'A palace restored rather than reinterpreted, and then lived in.',
      pt: 'Um palácio restaurado e não reinterpretado — e depois habitado.',
    },
    hero: hero('lisbon-palace'),
    gallery: gallery('lisbon-palace'),
  },
  {
    slug: 'hotel-albatroz',
    order: 10,
    style: 'classic',
    name: { en: 'Hotel Albatroz', pt: 'Hotel Albatroz' },
    location: { en: 'Cascais', pt: 'Cascais' },
    typology: { en: 'Hotel', pt: 'Hotel' },
    year: 2019,
    photographer: 'Francisco Almeida Dias',
    narrative: {
      en: 'A clifftop hotel in Cascais, worked room by room so that no two repeat and none of them forgets the sea below.',
      pt: 'Um hotel sobre a arriba em Cascais, trabalhado quarto a quarto para que nenhum se repita e nenhum esqueça o mar por baixo.',
    },
    hero: hero('hotel-albatroz'),
    gallery: gallery('hotel-albatroz'),
    featuredInAttract: true,
  },
  {
    slug: 'estoril-estate',
    order: 11,
    style: 'classic',
    name: { en: 'Estoril Estate', pt: 'Propriedade no Estoril' },
    location: { en: 'Estoril', pt: 'Estoril' },
    typology: { en: 'Private house', pt: 'Casa privada' },
    year: 2022,
    photographer: 'Francisco Nogueira',
    narrative: {
      en: 'A house of the kind Estoril has always had, brought forward without being modernised.',
      pt: 'Uma casa como o Estoril sempre teve, trazida para o presente sem ser modernizada.',
    },
    hero: hero('estoril-estate'),
    gallery: gallery('estoril-estate'),
  },
  {
    slug: 'tuscany-estate',
    order: 12,
    style: 'beach-countryside',
    name: { en: 'Tuscany Estate', pt: 'Propriedade na Toscana' },
    location: { en: 'Tuscany', pt: 'Toscana' },
    typology: { en: 'Country estate', pt: 'Propriedade rural' },
    year: 2022,
    photographer: 'José Manuel Ferrão',
    narrative: {
      en: 'A working estate kept working. Stone left unlined, the kitchen given the largest room, and the soft surfaces made in linen that is expected to fade.',
      pt: 'Uma propriedade agrícola que continua a sê-lo. A pedra sem revestimento, a cozinha na maior divisão, e os têxteis em linho que se espera que desbote.',
    },
    hero: hero('tuscany-estate'),
    gallery: gallery('tuscany-estate'),
    featuredInAttract: true,
  },
  {
    slug: 'cabana-sass',
    order: 13,
    style: 'beach-countryside',
    name: { en: 'Cabana Sass', pt: 'Cabana Sass' },
    location: { en: 'Algarve', pt: 'Algarve' },
    typology: { en: 'Beach house', pt: 'Casa de praia' },
    year: 2026,
    photographer: 'Francisco Almeida Dias',
    narrative: {
      en: 'Sand comes into this house and is allowed to.',
      pt: 'A areia entra nesta casa e é bem-vinda.',
    },
    hero: hero('cabana-sass'),
    gallery: gallery('cabana-sass'),
    featuredInAttract: true,
  },
];

export const PROJECTS_IN_ORDER = [...PROJECTS].sort((a, b) => a.order - b.order);

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
