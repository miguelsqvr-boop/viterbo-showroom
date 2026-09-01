/**
 * DRAFT CONTENT. Structure is final; words and images are not.
 *
 * Every narrative is under 60 words and every string is bilingual, so the
 * shape is right — but this copy has not been through the studio and the
 * imagery is placeholder scaffolding. Replace before the panel goes live.
 *
 * Sequencing (§7): the list moves contemporary → contemporary with a twist →
 * classic → beach & countryside, interleaving homes and hotels, so the range
 * is felt by scrolling rather than filtered by tapping. `style` is never
 * rendered as a control.
 */
import type { Project } from './types';
import { asMedia } from './types';
import { plate } from './generated/placeholder-media';

const gallery = (slug: string) => [1, 2, 3].map((n) => asMedia(plate(`${slug}-${n}`)));
const hero = (slug: string) => asMedia(plate(`${slug}-hero`));

export const PROJECTS: Project[] = [
  {
    slug: 'casa-do-restelo',
    order: 1,
    style: 'contemporary',
    name: { en: 'Casa do Restelo', pt: 'Casa do Restelo' },
    location: { en: 'Lisboa', pt: 'Lisboa' },
    typology: { en: 'Private house', pt: 'Casa privada' },
    year: 2024,
    area: '640 m²',
    scope: { en: 'Interior architecture and interior design', pt: 'Arquitetura de interiores e design de interiores' },
    narrative: {
      en: 'A family house rebuilt around its light. The plan was opened toward the river, the stair rethought as a single quiet gesture, and the palette held to lime plaster, oak and travertine so the rooms change with the hour rather than with the furniture.',
      pt: 'Uma casa de família reconstruída em torno da sua luz. A planta abriu-se ao rio, a escada foi repensada como um gesto único e discreto, e a paleta manteve-se no estuque, no carvalho e no travertino, para que os quartos mudem com a hora e não com o mobiliário.',
    },
    hero: hero('restelo'),
    gallery: gallery('restelo'),
    featuredInAttract: true,
  },
  {
    slug: 'marina-residence',
    order: 2,
    style: 'contemporary',
    name: { en: 'Marina Residence', pt: 'Marina Residence' },
    location: { en: 'Singapore', pt: 'Singapura' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2023,
    area: '410 m²',
    narrative: {
      en: 'Thirty-eight floors above the bay, with a horizon on three sides. Everything vertical was kept pale and everything horizontal dark, so the room reads as a shelf held out into the light rather than as a set of walls.',
      pt: 'Trinta e oito andares acima da baía, com horizonte em três lados. Tudo o que é vertical manteve-se claro e tudo o que é horizontal escuro, para que a sala se leia como uma plataforma suspensa na luz e não como um conjunto de paredes.',
    },
    hero: hero('singapore-tower'),
    gallery: gallery('singapore-tower'),
    featuredInAttract: true,
  },
  {
    slug: 'london-mews',
    order: 3,
    style: 'contemporary',
    name: { en: 'Mews House', pt: 'Mews House' },
    location: { en: 'London', pt: 'Londres' },
    typology: { en: 'Townhouse', pt: 'Casa urbana' },
    year: 2022,
    area: '210 m²',
    architect: 'In collaboration with the client’s architect',
    narrative: {
      en: 'A narrow brick mews with one good window. The staircase was moved to the flank wall to give the living floor its full width, and joinery was built in our own carpentry workshop to the millimetre the house allowed.',
      pt: 'Um mews estreito de tijolo com uma boa janela. A escada foi deslocada para a parede lateral para dar ao piso de estar toda a sua largura, e a marcenaria foi construída na nossa oficina, ao milímetro que a casa permitia.',
    },
    hero: hero('london-mews'),
    gallery: gallery('london-mews'),
  },
  {
    slug: 'principe-real',
    order: 4,
    style: 'contemporary-twist',
    name: { en: 'Príncipe Real', pt: 'Príncipe Real' },
    location: { en: 'Lisboa', pt: 'Lisboa' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2023,
    area: '280 m²',
    narrative: {
      en: 'A nineteenth-century apartment kept in its original proportions, then furnished against type. The stucco ceilings and the pine floors stayed; everything placed beneath them is contemporary, and the friction between the two is the whole idea.',
      pt: 'Um apartamento oitocentista mantido nas suas proporções originais e depois mobilado contra a corrente. Os tetos de estuque e os soalhos de pinho ficaram; tudo o que se colocou por baixo é contemporâneo, e o atrito entre os dois é a ideia toda.',
    },
    hero: hero('principe-real'),
    gallery: gallery('principe-real'),
    featuredInAttract: true,
  },
  {
    slug: 'monaco-terrace',
    order: 5,
    style: 'contemporary-twist',
    name: { en: 'Terrace Apartment', pt: 'Apartamento com Terraço' },
    location: { en: 'Monaco', pt: 'Mónaco' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2024,
    area: '320 m²',
    scope: { en: 'Interior design, furniture, installation', pt: 'Design de interiores, mobiliário, instalação' },
    narrative: {
      en: 'The terrace was the client’s reason for the apartment, so the interior was treated as its antechamber: low, quiet, and dark enough that stepping outside registers as a change in temperature. Upholstery and curtains were made in Lisbon and installed by our own team.',
      pt: 'O terraço foi a razão do cliente para o apartamento, pelo que o interior foi tratado como a sua antecâmara: baixo, silencioso e suficientemente escuro para que sair seja uma mudança de temperatura. O estofo e as cortinas foram feitos em Lisboa e instalados pela nossa equipa.',
    },
    hero: hero('monaco-terrace'),
    gallery: gallery('monaco-terrace'),
    featuredInAttract: true,
  },
  {
    slug: 'sao-paulo-penthouse',
    order: 6,
    style: 'contemporary-twist',
    name: { en: 'Jardins Penthouse', pt: 'Cobertura Jardins' },
    location: { en: 'São Paulo', pt: 'São Paulo' },
    typology: { en: 'Penthouse', pt: 'Cobertura' },
    year: 2022,
    area: '520 m²',
    narrative: {
      en: 'Brazilian modernism read through a Portuguese eye. Rosewood, cane and raw concrete were left to do the talking, and the art collection set the only colour in the apartment.',
      pt: 'O modernismo brasileiro lido por um olhar português. O jacarandá, a palhinha e o betão bruto ficaram a falar por si, e a coleção de arte definiu a única cor do apartamento.',
    },
    hero: hero('sao-paulo-penthouse'),
    gallery: gallery('sao-paulo-penthouse'),
  },
  {
    slug: 'bangkok-house',
    order: 7,
    style: 'classic',
    name: { en: 'Sukhumvit House', pt: 'Casa Sukhumvit' },
    location: { en: 'Bangkok', pt: 'Banguecoque' },
    typology: { en: 'Private house', pt: 'Casa privada' },
    year: 2023,
    area: '10 000 m²',
    scope: { en: 'Interior architecture and interior design, in full', pt: 'Arquitetura e design de interiores, na totalidade' },
    narrative: {
      en: 'Ten thousand square metres, six and a half of ceiling height, and the entire interior architecture ours. A house at this scale only holds together if every threshold is drawn — so every threshold was drawn, then made in our workshops and shipped from the Port of Lisbon.',
      pt: 'Dez mil metros quadrados, seis metros e meio de pé-direito, e toda a arquitetura de interiores nossa. Uma casa desta escala só se aguenta se cada limiar for desenhado — por isso todos foram desenhados, feitos nas nossas oficinas e enviados do Porto de Lisboa.',
    },
    hero: hero('bangkok-house'),
    gallery: gallery('bangkok-house'),
    featuredInAttract: true,
  },
  {
    slug: 'madrid-salamanca',
    order: 8,
    style: 'classic',
    name: { en: 'Salamanca Apartment', pt: 'Apartamento Salamanca' },
    location: { en: 'Madrid', pt: 'Madrid' },
    typology: { en: 'Apartment', pt: 'Apartamento' },
    year: 2021,
    area: '300 m²',
    narrative: {
      en: 'A classical envelope restored rather than reinterpreted. Mouldings were re-run from the surviving fragments, the boiserie repainted in a single warm off-white, and the furniture chosen so that nothing in the room is younger than it pretends to be.',
      pt: 'Um invólucro clássico restaurado e não reinterpretado. As molduras foram refeitas a partir dos fragmentos sobreviventes, a boiserie repintada num único branco-quente, e o mobiliário escolhido para que nada na sala seja mais novo do que aparenta.',
    },
    hero: hero('madrid-classic'),
    gallery: gallery('madrid-classic'),
  },
  {
    slug: 'hotel-bela-vista',
    order: 9,
    style: 'classic',
    name: { en: 'Hotel Bela Vista', pt: 'Hotel Bela Vista' },
    location: { en: 'Algarve', pt: 'Algarve' },
    typology: { en: 'Hotel', pt: 'Hotel' },
    year: 2020,
    scope: { en: 'Public areas, suites, furniture', pt: 'Áreas públicas, suites, mobiliário' },
    narrative: {
      en: 'A 1918 seaside villa that had been a hotel for a century. The work was archaeological before it was decorative: azulejo panels uncovered, the stair returned to its original run, and thirty-eight rooms furnished so no two repeat.',
      pt: 'Uma vila balnear de 1918 que foi hotel durante um século. O trabalho foi arqueológico antes de ser decorativo: painéis de azulejo revelados, a escada devolvida ao seu traçado original, e trinta e oito quartos mobilados para que nenhum se repita.',
    },
    hero: hero('bela-vista'),
    gallery: gallery('bela-vista'),
    featuredInAttract: true,
  },
  {
    slug: 'tuscan-farmhouse',
    order: 10,
    style: 'beach-countryside',
    name: { en: 'Podere', pt: 'Podere' },
    location: { en: 'Tuscany', pt: 'Toscana' },
    typology: { en: 'Country house', pt: 'Casa de campo' },
    year: 2024,
    area: '480 m²',
    narrative: {
      en: 'A working farmhouse kept working. Stone walls were left unlined, the kitchen given the largest room in the house, and every soft surface made in our upholstery workshop in linen that is expected to fade.',
      pt: 'Uma casa de lavoura que continua a sê-lo. As paredes de pedra ficaram sem revestimento, a cozinha ganhou a maior divisão da casa, e todas as superfícies têxteis foram feitas na nossa oficina de estofos, em linho que se espera que desbote.',
    },
    hero: hero('tuscan-farmhouse'),
    gallery: gallery('tuscan-farmhouse'),
  },
  {
    slug: 'comporta-dunes',
    order: 11,
    style: 'beach-countryside',
    name: { en: 'Dunas', pt: 'Dunas' },
    location: { en: 'Comporta', pt: 'Comporta' },
    typology: { en: 'Beach house', pt: 'Casa de praia' },
    year: 2023,
    area: '260 m²',
    narrative: {
      en: 'Sand comes into this house and is allowed to. Thatch, lime and untreated pine, one long room facing the dune, and furniture low enough that the horizon stays the tallest thing in the frame.',
      pt: 'A areia entra nesta casa e é bem-vinda. Colmo, cal e pinho ao natural, uma única sala longa virada à duna, e mobiliário suficientemente baixo para que o horizonte continue a ser o mais alto no enquadramento.',
    },
    hero: hero('comporta-dunes'),
    gallery: gallery('comporta-dunes'),
    featuredInAttract: true,
  },
  {
    slug: 'algarve-cliff',
    order: 12,
    style: 'beach-countryside',
    name: { en: 'Cliff House', pt: 'Casa da Arriba' },
    location: { en: 'Algarve', pt: 'Algarve' },
    typology: { en: 'Private house', pt: 'Casa privada' },
    year: 2025,
    area: '390 m²',
    narrative: {
      en: 'Built into the rock rather than onto it. The house is entered from above and opens downward to the water, so the sea arrives all at once — which is the only reason anyone builds on a cliff.',
      pt: 'Construída dentro da rocha e não sobre ela. Entra-se por cima e abre-se para baixo, para a água, de modo que o mar chega de uma só vez — que é a única razão para se construir numa arriba.',
    },
    hero: hero('algarve-cliff'),
    gallery: gallery('algarve-cliff'),
  },
];

export const PROJECTS_IN_ORDER = [...PROJECTS].sort((a, b) => a.order - b.order);

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
