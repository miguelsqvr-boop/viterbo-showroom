/**
 * Services (§8) — what the studio actually sells, in its own words.
 *
 * The copy is the studio's, taken from viterbo-id.com and not rewritten: this
 * is the one screen where a visitor is deciding whether to start a
 * conversation, and the words they will hear in the showroom should be the
 * words on the panel.
 *
 * The order is the order of a project — the room is drawn, then designed, then
 * documented, then made in the studio's own workshops, then installed. It is
 * the same argument Craft makes in photographs, made here in a sentence each:
 * plenty of studios do the first two, almost none own the last three.
 *
 * Four of the five carry a photograph, chosen by the studio and sent on
 * 7 September. All four are landscape, so none of them can take a portrait
 * frame — see canFullBleed in content/types.ts — and ServicesView shows them
 * as a band with the type below, which is what a print spread does with the
 * same problem.
 *
 * In-house Upholstery & Carpentry has none. The studio's file for it is 11.8MB
 * and cannot come down the connector, which tops out around 6MB, and unlike
 * the others there is no smaller copy anywhere in the Drive. It renders as
 * type on the ground until a copy under 6MB appears, which is a real state the
 * screen is built for and not a placeholder; see Service in content/types.ts.
 */
import type { Service } from './types';
import { asMedia } from './types';
import { media } from './generated/media';

export const SERVICES: Service[] = [
  {
    id: 'interior-architecture',
    index: 1,
    title: { en: 'Interior Architecture', pt: 'Arquitetura de Interiores' },
    line: {
      en: 'Timeless interiors shaped through intelligent planning, refined materials, and meticulous architectural detail.',
      pt: 'Interiores intemporais, moldados por um planeamento inteligente, materiais requintados e um detalhe arquitetónico meticuloso.',
    },
    media: asMedia({
      ...media('services/interior-architecture'),
      alt: {
        en: 'A kitchen built into a dark panelled room, with a stone island under linear pendants',
        pt: 'Uma cozinha integrada numa sala revestida a escuro, com ilha em pedra sob candeeiros lineares',
      },
    }),
  },
  {
    id: 'interior-design',
    index: 2,
    title: { en: 'Interior Design', pt: 'Design de Interiores' },
    line: {
      en: 'Bespoke interiors that blend architecture, furnishings, and materials to create timeless, personal spaces.',
      pt: 'Interiores feitos à medida, onde arquitetura, mobiliário e materiais se combinam em espaços intemporais e pessoais.',
    },
    media: asMedia({
      ...media('services/interior-design'),
      alt: {
        en: 'A powder room lined in hand-painted blue foliage, with a marble basin block',
        pt: 'Um lavabo revestido a folhagem azul pintada à mão, com bloco de lavatório em mármore',
      },
    }),
  },
  {
    id: 'construction-drawings',
    index: 3,
    title: { en: 'Construction Drawings', pt: 'Desenho de Execução' },
    line: {
      en: 'Comprehensive construction drawings that translate design intent into precise, buildable solutions with exceptional clarity and accuracy.',
      pt: 'Desenhos de execução completos, que traduzem a intenção de projeto em soluções precisas e construíveis, com clareza e rigor excecionais.',
    },
    media: asMedia({
      ...media('services/construction-drawings'),
      alt: {
        en: 'A dimensioned elevation of a fitted kitchen, annotated cabinet by cabinet',
        pt: 'Um alçado cotado de uma cozinha à medida, anotado armário a armário',
      },
    }),
  },
  {
    id: 'upholstery-carpentry',
    index: 4,
    title: { en: 'In-house Upholstery & Carpentry', pt: 'Estofo e Carpintaria Próprios' },
    line: {
      en: 'A dedicated team for managing and producing bespoke upholstery and cabinetry to the studio’s exacting standards.',
      pt: 'Uma equipa dedicada à gestão e produção de estofo e marcenaria à medida, segundo os padrões exigentes do estúdio.',
    },
  },
  {
    id: 'turnkey',
    index: 5,
    title: { en: 'Turnkey Implementation', pt: 'Implementação Chave na Mão' },
    line: {
      en: 'We oversee every aspect of project delivery, coordinating artisans, suppliers, logistics, and installation to ensure the design is realised exactly as envisioned, with complete peace of mind for our clients.',
      pt: 'Acompanhamos todos os aspetos da entrega do projeto, coordenando artesãos, fornecedores, logística e instalação, para que o desenho se concretize exatamente como foi pensado, com total tranquilidade para os nossos clientes.',
    },
    media: asMedia({
      ...media('services/turnkey'),
      alt: {
        en: 'A finished living room, furnished and lit, ready to be lived in',
        pt: 'Uma sala de estar terminada, mobilada e iluminada, pronta a habitar',
      },
    }),
  },
];
