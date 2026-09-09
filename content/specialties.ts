/**
 * Specialties (§8) — the eight things the studio says it is expert at.
 *
 * The studio asked for this section on 9 September and pointed at the page it
 * comes from: viterbointeriordesign.com/our-studio. The English is theirs,
 * transcribed from that page and not rewritten.
 *
 * THE PORTUGUESE IS NOT THEIRS. The site has a Portuguese edition, but this
 * container cannot reach viterbointeriordesign.com — the network policy blocks
 * it — so these translations are mine, written to match the English rather
 * than copied from their own PT copy. Every other Portuguese string on the
 * panel came from the studio. These eight should be read by Gracinha and
 * corrected, and this note removed when they have been.
 *
 * THE PHOTOGRAPHS ARE THE PANEL'S OWN. The website runs its own picture over
 * each of these and the studio asked for those, but the site is unreachable
 * from here and the images are not in the Drive either, so Miguel's answer was
 * to use what is already on the panel. Each of the eight is one frame from a
 * different project — eight projects, so no project speaks twice — and every
 * one was chosen by rendering the crop the screen will actually show rather
 * than by reading a filename.
 *
 * Three rules held while choosing, and each of them threw a candidate out:
 *
 * - Never a hero or an attract frame. Those are the pictures a visitor meets
 *   on the collection and in the idle loop, and reusing one is the repetition
 *   the studio objected to when the Craft card borrowed Castilho 203's hero.
 *   All eight are gallery frames, seen only by someone who opened that project
 *   and scrolled.
 * - Never a photograph already used elsewhere. The obvious bathroom was
 *   cascais-estate/08, a blue-foliage powder room — and it is byte-identical
 *   to the picture on Interior Design one section away. An md5 pass over all
 *   205 frames caught it; nothing else would have. estoril-estate/10 took the
 *   slot instead.
 * - Landscape, because none of these reaches 2160px and so none full-bleeds.
 *   Every one renders as the same 30% band the Services take, and a band is
 *   nearly two to one: a portrait frame cropped into it keeps a horizontal
 *   slice and loses the room. The carved door at birre-house/09 and the pink
 *   dressing room at estoril-estate/04 are both better photographs than what
 *   replaced them and both survive the crop poorly.
 *
 * The one place the rule bent is Closets: birre-villa/01 is portrait, but it
 * is the only frame on the panel that shows a wardrobe as joinery rather than
 * as a corner of a bedroom, and its band crop holds the shelving and the
 * island. It was checked at band size before it was wired.
 */
import { media } from './generated/media';
import { asMedia, type Specialty } from './types';

export const SPECIALTIES: Specialty[] = [
  {
    id: 'historic-renovations',
    index: 1,
    title: { en: 'Historic Renovations', pt: 'Renovações Históricas' },
    line: {
      en: 'Restoring what deserves to remain, and reinventing everything else. We work with the fabric of listed and period buildings, preserving tilework, plaster and stone while bringing structure and services up to contemporary standards.',
      pt: 'Restaurar o que merece permanecer e reinventar tudo o resto. Trabalhamos sobre a matéria de edifícios classificados e de época, preservando azulejo, estuque e pedra, enquanto levamos a estrutura e as infraestruturas aos padrões contemporâneos.',
    },
    media: asMedia({
      ...media('pasteis-de-belem/02'),
      alt: {
        en: 'A vaulted arcade of oak and blue azulejo over a black and white checkerboard floor',
        pt: 'Uma arcada abobadada em carvalho e azulejo azul sobre um pavimento em xadrez preto e branco',
      },
    }),
  },
  {
    id: 'joinery-and-furniture',
    index: 2,
    title: { en: 'In-House Joinery and Furniture', pt: 'Marcenaria e Mobiliário Próprios' },
    line: {
      en: 'Designed in the studio, made in our own atelier, fitted to the millimetre. Our own joinery workshop lets us design furniture and cabinetry specific to each room, controlling detail, finish and timing from drawing to installation.',
      pt: 'Desenhado no estúdio, feito no nosso atelier, ajustado ao milímetro. A nossa oficina de marcenaria permite-nos desenhar mobiliário e carpintaria específicos para cada divisão, controlando detalhe, acabamento e prazos do desenho à instalação.',
    },
    media: asMedia({
      ...media('bangkok-estate/02'),
      alt: {
        en: 'A red lacquer cabinet standing open against a hand-painted blossom wall',
        pt: 'Um armário em laca vermelha aberto contra uma parede de flores pintada à mão',
      },
    }),
  },
  {
    id: 'kitchen-design',
    index: 3,
    title: { en: 'Kitchen Design', pt: 'Design de Cozinhas' },
    line: {
      en: 'Designed around how the house actually lives, not how kitchens are usually drawn. Kitchens that hold their own as architecture, balancing the demands of daily use and entertaining with the materials and calm of the rest of the home.',
      pt: 'Desenhadas a partir da forma como a casa se vive, e não da forma como as cozinhas se costumam desenhar. Cozinhas que se afirmam como arquitetura, conciliando as exigências do dia a dia e de receber com os materiais e a serenidade do resto da casa.',
    },
    media: asMedia({
      ...media('tuscany-estate/08'),
      alt: {
        en: 'A hand-painted kitchen under a brick vault, with stools drawn up to a long island',
        pt: 'Uma cozinha pintada à mão sob uma abóbada de tijolo, com bancos encostados a uma ilha comprida',
      },
    }),
  },
  {
    id: 'bathroom-design',
    index: 4,
    title: { en: 'Bathroom Design', pt: 'Design de Casas de Banho' },
    line: {
      en: 'Stone, water and light, resolved down to the last joint. Bathrooms conceived as private retreats, where the choice of stone, the fall of light and the concealment of every service are considered from the outset.',
      pt: 'Pedra, água e luz, resolvidas até à última junta. Casas de banho pensadas como refúgios privados, onde a escolha da pedra, a queda da luz e a ocultação de cada infraestrutura são consideradas desde o início.',
    },
    media: asMedia({
      ...media('estoril-estate/10'),
      alt: {
        en: 'A powder room lacquered deep blue, with a convex mirror over a dark marble basin',
        pt: 'Um lavabo lacado a azul profundo, com espelho convexo sobre um lavatório em mármore escuro',
      },
    }),
  },
  {
    id: 'closets',
    /* The studio's own word in both languages, and the same in both. */
    index: 5,
    title: { en: 'Closets', pt: 'Closets' },
    line: {
      en: 'Wardrobes designed around the collection they are built to hold. Dressing rooms conceived as rooms in their own right, where lighting, materials and the organisation of each garment are resolved before a single door is drawn.',
      pt: 'Roupeiros desenhados em função da coleção que vão guardar. Closets pensados como divisões de pleno direito, onde a iluminação, os materiais e a arrumação de cada peça são resolvidos antes de se desenhar uma única porta.',
    },
    media: asMedia({
      ...media('birre-villa/01'),
      alt: {
        en: 'An open dressing room in oak, its shelving wrapped around a glass-topped island',
        pt: 'Um closet aberto em carvalho, com prateleiras em torno de uma ilha com tampo de vidro',
      },
    }),
  },
  {
    id: 'spa-design',
    index: 6,
    title: { en: 'Spa Design', pt: 'Design de Spa' },
    line: {
      en: 'Wellness spaces built on silence, temperature and touch. Private spas designed around the sequence of the experience, integrating pool, sauna, hammam and treatment areas with the acoustics and materials they require.',
      pt: 'Espaços de bem-estar construídos sobre o silêncio, a temperatura e o toque. Spas privados desenhados em torno da sequência da experiência, integrando piscina, sauna, hammam e zonas de tratamento com a acústica e os materiais que exigem.',
    },
    media: asMedia({
      ...media('castilho-203/03'),
      alt: {
        en: 'An indoor pool lined in travertine, lit through three curtained bays',
        pt: 'Uma piscina interior revestida a travertino, iluminada por três vãos com cortinas',
      },
    }),
  },
  {
    id: 'gym-design',
    index: 7,
    title: { en: 'Gym Design', pt: 'Design de Ginásio' },
    line: {
      en: 'Performance space that belongs to the house, not to a hotel basement. Home gyms designed with the same rigour as the living spaces, resolving ventilation, acoustics, flooring and equipment without sacrificing the architecture.',
      pt: 'Um espaço de treino que pertence à casa e não à cave de um hotel. Ginásios privados desenhados com o mesmo rigor das zonas de estar, resolvendo ventilação, acústica, pavimento e equipamento sem sacrificar a arquitetura.',
    },
    media: asMedia({
      ...media('cascais-estate/01'),
      alt: {
        en: 'A home gym in black lacquer, with wall bars and a bench under a mirrored wall',
        pt: 'Um ginásio privado em laca negra, com espaldar e banco sob uma parede espelhada',
      },
    }),
  },
  {
    id: 'office-design',
    index: 8,
    title: { en: 'Office Design', pt: 'Design de Escritório' },
    line: {
      en: 'Workspaces with the composure of a private residence. Private studies and workspaces designed for concentration and for being seen, from the ergonomics of the desk to the discipline of the lighting.',
      pt: 'Espaços de trabalho com a compostura de uma residência privada. Escritórios e salas de trabalho desenhados para a concentração e para serem vistos, da ergonomia da secretária à disciplina da iluminação.',
    },
    media: asMedia({
      ...media('porto-villa/08'),
      alt: {
        en: 'A study behind a steel-framed glass wall, with a dark desk and lit shelving',
        pt: 'Um escritório atrás de uma parede de vidro com caixilho de aço, com secretária escura e prateleiras iluminadas',
      },
    }),
  },
];
