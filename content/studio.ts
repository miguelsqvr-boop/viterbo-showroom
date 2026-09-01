/** Studio (§8) — one screen, no scroll, 90 words maximum. */
import type { Localized } from './types';
import { asMedia } from './types';
import { media } from './generated/media';

export const STUDIO = {
  body: {
    en: 'Viterbo has worked from Cascais since 1979, and is now in its second generation: Miguel Vieira da Rocha on strategy and management, Gracinha Viterbo on creative direction. The studio takes a project from master planning through interior architecture to interior design, and does not hand it over in between.',
    pt: 'A Viterbo trabalha a partir de Cascais desde 1979 e está na sua segunda geração: Miguel Vieira da Rocha na estratégia e gestão, Gracinha Viterbo na direção criativa. O estúdio acompanha um projeto do plano geral à arquitetura de interiores e ao design de interiores, sem o entregar a meio.',
  } satisfies Localized,

  /**
   * The reassurance a developer is actually looking for. Body weight, sentence
   * case, no oversized numerals, no accent colour — the restraint is what makes
   * it credible. No city count: the list in Craft does that work better.
   */
  figures: {
    en: 'Since 1979 · 25 professionals · three in-house workshops · 2,000 m² warehouse · four continents',
    pt: 'Desde 1979 · 25 profissionais · três oficinas próprias · armazém de 2000 m² · quatro continentes',
  } satisfies Localized,

  /** Publication marks only, no captions — a mark reads in a second. */
  awards: [
    { id: 'homes-gardens', mark: 'Homes & Gardens', note: { en: '21 world’s best interior designers', pt: '21 melhores designers de interiores do mundo' } },
    { id: 'architizer', mark: 'Architizer', note: { en: 'Top 10', pt: 'Top 10' } },
    { id: 'casa-vogue', mark: 'Casa Vogue Italia', note: { en: 'Cover', pt: 'Capa' } },
    { id: 'cnn', mark: 'CNN', note: { en: 'Hotel Bela Vista', pt: 'Hotel Bela Vista' } },
    { id: 'andrew-martin', mark: 'Andrew Martin', note: { en: 'International Design Award', pt: 'International Design Award' } },
    { id: 'singapore', mark: 'SIDA Singapore', note: { en: 'Award-winning', pt: 'Premiado' } },
  ],

  /**
   * Gracinha and Miguel photographed inside their own work rather than against
   * a backdrop — the brief asks for one image and not a team grid, and a
   * portrait taken on site says more about the studio than a studio portrait.
   */
  image: asMedia({
    ...media('studio/gracinha-miguel'),
    alt: {
      en: 'Gracinha Viterbo and Miguel Vieira da Rocha at the Tuscan estate',
      pt: 'Gracinha Viterbo e Miguel Vieira da Rocha na propriedade na Toscana',
    },
  }),
} as const;
