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
import type { Media, Project } from './types';
import { asMedia } from './types';
import { plate } from './generated/placeholder-media';
import { media } from './generated/media';

/**
 * A real photograph, with its alt text.
 *
 * The pipeline emits dimensions, aspect and a blur placeholder but leaves alt
 * empty on purpose — alt text is copy, not metadata, and belongs next to the
 * project it describes.
 */
const img = (key: string, en: string, pt: string): Media =>
  asMedia({ ...media(key), alt: { en, pt } });

/** Placeholder plates, still standing in for the projects not yet selected. */
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
    hero: img('castilho-203/hero', 'The indoor pool, lined in travertine', 'A piscina interior, revestida a travertino'),
    gallery: [
      img('castilho-203/01', 'A dried-flower installation over a brass console', 'Uma instalação de flores secas sobre uma consola de latão'),
      img('castilho-203/02', 'A curved sofa against ribbed timber, under copper pendants', 'Um sofá curvo contra madeira ripada, sob suspensões de cobre'),
      img('castilho-203/03', 'The pool seen through full-height curtains', 'A piscina vista através de cortinados de pé-direito'),
      img('castilho-203/04', 'A treatment room in the spa', 'Uma sala de tratamentos no spa'),
    ],
    featuredInAttract: true,
  },
  {
    slug: 'av-republica',
    order: 4,
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
    order: 5,
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
    hero: img('chelsea/hero', 'Hand-painted chinoiserie above a green banquette in the dining room', 'Chinoiserie pintada à mão sobre um banco verde na sala de jantar'),
    gallery: [
      img('chelsea/01', 'The dining room reading through glass to the walled garden', 'A sala de jantar vista, através do vidro, para o jardim murado'),
      img('chelsea/02', 'Teal velvet seating beneath a large painting', 'Assentos em veludo azul-petróleo sob uma pintura de grandes dimensões'),
      img('chelsea/03', 'The library, with armchairs drawn up to the fireplace', 'A biblioteca, com poltronas junto à lareira'),
      img('chelsea/04', 'The principal bedroom, in dark green', 'O quarto principal, em verde escuro'),
    ],
    featuredInAttract: true,
  },
  {
    slug: 'singapore-penthouse',
    order: 6,
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
    hero: img('singapore-penthouse/hero', 'Warhol’s Endangered Species prints on the gallery wall', 'As gravuras Endangered Species de Warhol na parede-galeria'),
    gallery: [
      img('singapore-penthouse/01', 'The long wall of prints above a patterned rug', 'A longa parede de gravuras sobre um tapete padronizado'),
      img('singapore-penthouse/02', 'A mirrored screen above the curved banquette', 'Um biombo espelhado sobre o banco curvo'),
      img('singapore-penthouse/03', 'The living room against the city', 'A sala de estar contra a cidade'),
      img('singapore-penthouse/04', 'More of the collection, beside a folding screen', 'Mais da coleção, junto a um biombo'),
    ],
    featuredInAttract: true,
  },
  {
    slug: 'rio-de-janeiro',
    order: 7,
    style: 'contemporary-twist',
    name: { en: 'Seafront Apartment', pt: 'Apartamento à Beira-Mar' },
    location: { en: 'Rio de Janeiro', pt: 'Rio de Janeiro' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2014,
    narrative: {
      en: 'An apartment facing the Atlantic from the other side.',
      pt: 'Um apartamento virado ao Atlântico, do outro lado.',
    },
    hero: img('rio-de-janeiro/hero', 'The living room, with the beach through full-height glass', 'A sala de estar, com a praia através do vidro de pé-direito'),
    gallery: [
      img('rio-de-janeiro/01', 'The long living room, in grey and pale wood', 'A sala de estar comprida, em cinza e madeira clara'),
      img('rio-de-janeiro/02', 'The dining table beneath paper pendants', 'A mesa de jantar sob suspensões de papel'),
      img('rio-de-janeiro/03', 'A games room facing the sea', 'Uma sala de jogos virada ao mar'),
      img('rio-de-janeiro/04', 'The dining table laid, in oak and cane', 'A mesa de jantar posta, em carvalho e palhinha'),
    ],
    featuredInAttract: true,
  },
  {
    slug: 'porto-villa',
    order: 2,
    style: 'contemporary',
    name: { en: 'Porto Villa', pt: 'Villa no Porto' },
    location: { en: 'Porto', pt: 'Porto' },
    typology: { en: 'Private house', pt: 'Casa privada' },
    year: 2023,
    photographer: 'José Manuel Ferrão',
    narrative: {
      en: 'Pale throughout — cream, oak, white marble — with a spiral stair cut through the middle of it. The light in the north is different, and the rooms were drawn to hold it longer.',
      pt: 'Clara em toda a parte — creme, carvalho, mármore branco — com uma escada em espiral a atravessá-la ao meio. A luz no norte é outra, e as divisões foram desenhadas para a reter mais tempo.',
    },
    hero: img('porto-villa/hero', 'The living room in cream and oak, with gold pouffes', 'A sala de estar em creme e carvalho, com pufes dourados'),
    gallery: [
      img('porto-villa/01', 'A pale sectional under a run of built-in shelving', 'Um sofá modular claro sob uma estante embutida'),
      img('porto-villa/02', 'The spiral stair seen from above, in timber and white', 'A escada em espiral vista de cima, em madeira e branco'),
      img('porto-villa/03', 'An abstract panel above a dark console', 'Um painel abstrato sobre uma consola escura'),
      img('porto-villa/04', 'The marble bathroom', 'A casa de banho em mármore'),
    ],
  },
  {
    slug: 'bangkok-estate',
    order: 9,
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
    hero: img('bangkok-estate/hero', 'The double-height public room, in gold leaf and brass', 'A sala comum de pé-direito duplo, em folha de ouro e latão'),
    gallery: [
      img('bangkok-estate/01', 'A corridor lined in brass and onyx', 'Um corredor revestido a latão e ónix'),
      img('bangkok-estate/02', 'A red lacquer cabinet against a blossom mural', 'Um armário em laca vermelha contra um mural de flores'),
      img('bangkok-estate/03', 'A wall of curiosities in brass frames', 'Uma parede de curiosidades em molduras de latão'),
      img('bangkok-estate/04', 'A long room with leather chesterfields', 'Uma sala comprida com chesterfields de couro'),
    ],
    featuredInAttract: true,
  },
  {
    slug: 'lisbon-palace',
    order: 10,
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
    hero: img('lisbon-palace/hero', 'Lit arched niches lined with hand-painted chinoiserie', 'Nichos em arco, iluminados e forrados a chinoiserie pintada à mão'),
    gallery: [
      img('lisbon-palace/01', 'A curved velvet sofa in front of the painted panels', 'Um sofá curvo de veludo diante dos painéis pintados'),
      img('lisbon-palace/02', 'A bathroom framed in azulejo', 'Uma casa de banho emoldurada a azulejo'),
      img('lisbon-palace/03', 'Striped curtains at the window', 'Cortinados às riscas na janela'),
      img('lisbon-palace/04', 'A bedroom in floral paper', 'Um quarto em papel floral'),
    ],
  },
  {
    slug: 'hotel-albatroz',
    order: 11,
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
    hero: img('hotel-albatroz/hero', 'The striped stair hall above an azulejo dado', 'A escadaria às riscas sobre um lambril de azulejo'),
    gallery: [
      img('hotel-albatroz/01', 'The bar, framed by its doorway over a chequerboard floor', 'O bar, emoldurado pela porta sobre um chão em xadrez'),
      img('hotel-albatroz/02', 'The restaurant, in rattan and blue', 'O restaurante, em rattan e azul'),
      img('hotel-albatroz/03', 'A gilded screen of cranes above a blue banquette', 'Um biombo dourado de grous sobre um banco azul'),
      img('hotel-albatroz/04', 'A bedroom, in teal with a gilded headboard', 'Um quarto, em azul-petróleo com cabeceira dourada'),
    ],
    featuredInAttract: true,
  },
  {
    slug: 'estoril-estate',
    order: 8,
    style: 'contemporary-twist',
    name: { en: 'Estoril Estate', pt: 'Propriedade no Estoril' },
    location: { en: 'Estoril', pt: 'Estoril' },
    typology: { en: 'Private house', pt: 'Casa privada' },
    year: 2022,
    photographer: 'Francisco Nogueira',
    narrative: {
      en: 'Colour used without apology: hot pink against teal, cobalt against yellow, a different decision in every room. The bones of the house are calm, which is the only reason it holds.',
      pt: 'Cor usada sem pedir desculpa: rosa vivo contra azul-petróleo, cobalto contra amarelo, uma decisão diferente em cada divisão. A estrutura da casa é serena — é a única razão por que aguenta.',
    },
    hero: img('estoril-estate/hero', 'A hot pink dressing room under a brass birdcage mobile', 'Um closet em rosa vivo sob um móbile em gaiola de latão'),
    gallery: [
      img('estoril-estate/01', 'A pink sitting room with a round mirror over the fireplace', 'Uma sala em rosa com um espelho redondo sobre a lareira'),
      img('estoril-estate/02', 'A teal bathroom behind heavy curtains', 'Uma casa de banho azul-petróleo atrás de cortinados pesados'),
      img('estoril-estate/03', 'Coloured lanterns above a red sofa', 'Lanternas coloridas sobre um sofá vermelho'),
      img('estoril-estate/04', 'The lacquered island in the dressing room', 'A ilha lacada no closet'),
    ],
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
    hero: img('tuscany-estate/hero', 'The arched stone entry, its iron gate open onto cypresses', 'A entrada de pedra em arco, com o portão de ferro aberto sobre os ciprestes'),
    gallery: [
      img('tuscany-estate/01', 'The living room under its stone arch', 'A sala de estar sob o seu arco de pedra'),
      img('tuscany-estate/02', 'The dining room beneath a brick vault', 'A sala de jantar sob uma abóbada de tijolo'),
      img('tuscany-estate/03', 'The hand-painted kitchen, in green', 'A cozinha pintada à mão, em verde'),
      img('tuscany-estate/04', 'A four-poster bed under beamed ceilings', 'Uma cama de dossel sob tetos de vigas'),
    ],
    featuredInAttract: true,
  },
  {
    slug: 'cabana-sass',
    order: 13,
    style: 'beach-countryside',
    name: { en: 'Cabana Sass', pt: 'Cabana Sass' },
    location: { en: 'Algarve', pt: 'Algarve' },
    typology: { en: 'Restaurant', pt: 'Restaurante' },
    year: 2026,
    photographer: 'Francisco Almeida Dias',
    narrative: {
      en: 'A beach restaurant built almost entirely of timber, rattan and dried palm, with the Atlantic along one whole side. Sand comes in and is allowed to.',
      pt: 'Um restaurante de praia feito quase inteiramente de madeira, rattan e palma seca, com o Atlântico ao longo de todo um lado. A areia entra e é bem-vinda.',
    },
    hero: img('cabana-sass/hero', 'A dried-palm installation filling a timber doorway', 'Uma instalação de palmas secas a preencher um vão de madeira'),
    gallery: [
      img('cabana-sass/01', 'The dining room under rattan pendants, open to the sea', 'A sala de jantar sob suspensões de rattan, aberta ao mar'),
      img('cabana-sass/02', 'The open kitchen counter, in earthenware and timber', 'O balcão da cozinha aberta, em barro e madeira'),
      img('cabana-sass/03', 'Pampas and dried palm on a table', 'Palha-de-pampas e palma seca sobre uma mesa'),
      img('cabana-sass/04', 'The long room running to the water', 'A sala comprida a correr para a água'),
    ],
    featuredInAttract: true,
  },
];

export const PROJECTS_IN_ORDER = [...PROJECTS].sort((a, b) => a.order - b.order);

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
