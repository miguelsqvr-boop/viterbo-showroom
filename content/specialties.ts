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
 * None of the eight carries a photograph. The website runs a picture over each
 * one, but those are web-sized and this panel is 2160px across; and the
 * obvious shortcut — borrowing a frame from a project that happens to show a
 * kitchen — is the exact repetition the studio objected to when the Craft card
 * reused Castilho 203's hero. So each renders as type on the ground, which is
 * a real state the screen is built for; add `media` to an entry and it becomes
 * a band or a full-bleed with nothing else to change.
 */
import type { Specialty } from './types';

export const SPECIALTIES: Specialty[] = [
  {
    id: 'historic-renovations',
    index: 1,
    title: { en: 'Historic Renovations', pt: 'Renovações Históricas' },
    line: {
      en: 'Restoring what deserves to remain, and reinventing everything else. We work with the fabric of listed and period buildings, preserving tilework, plaster and stone while bringing structure and services up to contemporary standards.',
      pt: 'Restaurar o que merece permanecer e reinventar tudo o resto. Trabalhamos sobre a matéria de edifícios classificados e de época, preservando azulejo, estuque e pedra, enquanto levamos a estrutura e as infraestruturas aos padrões contemporâneos.',
    },
  },
  {
    id: 'joinery-and-furniture',
    index: 2,
    title: { en: 'In-House Joinery and Furniture', pt: 'Marcenaria e Mobiliário Próprios' },
    line: {
      en: 'Designed in the studio, made in our own atelier, fitted to the millimetre. Our own joinery workshop lets us design furniture and cabinetry specific to each room, controlling detail, finish and timing from drawing to installation.',
      pt: 'Desenhado no estúdio, feito no nosso atelier, ajustado ao milímetro. A nossa oficina de marcenaria permite-nos desenhar mobiliário e carpintaria específicos para cada divisão, controlando detalhe, acabamento e prazos do desenho à instalação.',
    },
  },
  {
    id: 'kitchen-design',
    index: 3,
    title: { en: 'Kitchen Design', pt: 'Design de Cozinhas' },
    line: {
      en: 'Designed around how the house actually lives, not how kitchens are usually drawn. Kitchens that hold their own as architecture, balancing the demands of daily use and entertaining with the materials and calm of the rest of the home.',
      pt: 'Desenhadas a partir da forma como a casa se vive, e não da forma como as cozinhas se costumam desenhar. Cozinhas que se afirmam como arquitetura, conciliando as exigências do dia a dia e de receber com os materiais e a serenidade do resto da casa.',
    },
  },
  {
    id: 'bathroom-design',
    index: 4,
    title: { en: 'Bathroom Design', pt: 'Design de Casas de Banho' },
    line: {
      en: 'Stone, water and light, resolved down to the last joint. Bathrooms conceived as private retreats, where the choice of stone, the fall of light and the concealment of every service are considered from the outset.',
      pt: 'Pedra, água e luz, resolvidas até à última junta. Casas de banho pensadas como refúgios privados, onde a escolha da pedra, a queda da luz e a ocultação de cada infraestrutura são consideradas desde o início.',
    },
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
  },
  {
    id: 'spa-design',
    index: 6,
    title: { en: 'Spa Design', pt: 'Design de Spa' },
    line: {
      en: 'Wellness spaces built on silence, temperature and touch. Private spas designed around the sequence of the experience, integrating pool, sauna, hammam and treatment areas with the acoustics and materials they require.',
      pt: 'Espaços de bem-estar construídos sobre o silêncio, a temperatura e o toque. Spas privados desenhados em torno da sequência da experiência, integrando piscina, sauna, hammam e zonas de tratamento com a acústica e os materiais que exigem.',
    },
  },
  {
    id: 'gym-design',
    index: 7,
    title: { en: 'Gym Design', pt: 'Design de Ginásio' },
    line: {
      en: 'Performance space that belongs to the house, not to a hotel basement. Home gyms designed with the same rigour as the living spaces, resolving ventilation, acoustics, flooring and equipment without sacrificing the architecture.',
      pt: 'Um espaço de treino que pertence à casa e não à cave de um hotel. Ginásios privados desenhados com o mesmo rigor das zonas de estar, resolvendo ventilação, acústica, pavimento e equipamento sem sacrificar a arquitetura.',
    },
  },
  {
    id: 'office-design',
    index: 8,
    title: { en: 'Office Design', pt: 'Design de Escritório' },
    line: {
      en: 'Workspaces with the composure of a private residence. Private studies and workspaces designed for concentration and for being seen, from the ergonomics of the desk to the discipline of the lighting.',
      pt: 'Espaços de trabalho com a compostura de uma residência privada. Escritórios e salas de trabalho desenhados para a concentração e para serem vistos, da ergonomia da secretária à disciplina da iluminação.',
    },
  },
];
