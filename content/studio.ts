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

  /**
   * The studio's recognitions, as published on viterbo-id.com.
   *
   * `mark` is what the screen shows — the publication or awarding body, which
   * reads in a second from three metres. `note` is the recognition itself and
   * is held as data rather than rendered: a mark carries authority, a caption
   * under every mark reads as a case being argued. The notes are here so the
   * studio has them in one place, and so a future screen with room for them
   * does not have to go back to the website.
   *
   * Several bodies appear twice — CNN and Condé Nast each recognised two
   * different hotels. Both are kept, and StudioView renders each mark once.
   */
  awards: [
    { id: 'homes-gardens', mark: 'Homes & Gardens', note: { en: 'Listed among the 21 world’s best interior designers', pt: 'Entre os 21 melhores designers de interiores do mundo' } },
    { id: 'architizer', mark: 'Architizer', note: { en: 'Top 10 established designers you should know', pt: 'Top 10 dos designers consagrados a conhecer' } },
    { id: 'casa-vogue', mark: 'Casa Vogue Italia', note: { en: 'A Viterbo project on the cover', pt: 'Um projeto Viterbo na capa' } },
    { id: 'nyt', mark: 'New York Times', note: { en: 'Hotel Bela Vista — one of the hotels to see in a lifetime', pt: 'Hotel Bela Vista — um dos hotéis a ver numa vida' } },
    { id: 'cnn-beach', mark: 'CNN', note: { en: 'Hotel Bela Vista — one of the 20 most beautiful beach hotels in the world', pt: 'Hotel Bela Vista — um dos 20 hotéis de praia mais bonitos do mundo' } },
    { id: 'cnn-europe', mark: 'CNN', note: { en: 'Hotel Bela Vista — one of the 20 most beautiful hotels in Europe', pt: 'Hotel Bela Vista — um dos 20 hotéis mais bonitos da Europa' } },
    { id: 'conde-nast-spa', mark: 'Condé Nast', note: { en: 'SPA Real Marine — 12 hottest spas in the world', pt: 'SPA Real Marine — os 12 spas mais em voga do mundo' } },
    { id: 'conde-nast-castelo', mark: 'Condé Nast', note: { en: 'Hotel Solar do Castelo — hot list, most romantic hotels in the world', pt: 'Hotel Solar do Castelo — hot list dos hotéis mais românticos do mundo' } },
    { id: 'de-gournay', mark: 'de Gournay', note: { en: 'Gracinha Viterbo launches an exclusive hand-painted wall collection', pt: 'Gracinha Viterbo lança uma coleção exclusiva de painéis pintados à mão' } },
    { id: 'nespresso', mark: 'Nespresso', note: { en: 'Gracinha Viterbo invited to collaborate on a new machine launch', pt: 'Gracinha Viterbo convidada a colaborar no lançamento de uma nova máquina' } },
    { id: 'star-alliance', mark: 'Star Alliance', note: { en: 'Gracinha Viterbo featured in the worldwide campaign', pt: 'Gracinha Viterbo na campanha mundial' } },
    { id: 'robb-report', mark: 'Robb Report', note: { en: 'Best of the Best, Singapore edition', pt: 'Best of the Best, edição de Singapura' } },
    { id: 'andrew-martin', mark: 'Andrew Martin', note: { en: 'Nominated three times for the Interior Design Review', pt: 'Nomeada três vezes para a Interior Design Review' } },
    { id: 'coveted', mark: 'Coveted', note: { en: 'Top 100 interior designers around the world', pt: 'Top 100 dos designers de interiores do mundo' } },
    { id: 'bloomberg', mark: 'Bloomberg', note: { en: 'International Property Awards — Best Interior Designer, Portugal', pt: 'International Property Awards — Melhor Designer de Interiores, Portugal' } },
    { id: 'tatler-world', mark: 'Tatler', note: { en: 'Hotel das Janelas Verdes — 101 best hotels in the world', pt: 'Hotel das Janelas Verdes — 101 melhores hotéis do mundo' } },
    { id: 'tatler-homes-sg', mark: 'Tatler Homes Singapore', note: { en: 'Best residential interior design project', pt: 'Melhor projeto residencial de design de interiores' } },
    { id: 'sunday-times', mark: 'Sunday Times', note: { en: 'Hotel das Janelas Verdes — Hot 100 best hotels in Europe', pt: 'Hotel das Janelas Verdes — Hot 100 melhores hotéis da Europa' } },
    { id: 'iai', mark: 'IAI Asia Pacific', note: { en: 'Luxury Interior Design Project Excellence Award — best interior design, Singapore', pt: 'Luxury Interior Design Project Excellence Award — melhor design de interiores, Singapura' } },
    { id: 'ipa-singapore', mark: 'International Property Awards', note: { en: 'Best Interior Designer — Singapore project', pt: 'Melhor Designer de Interiores — projeto em Singapura' } },
    { id: 'luxury-lifestyle-sg', mark: 'Luxury Lifestyle Awards', note: { en: 'Best interior designer, Singapore', pt: 'Melhor designer de interiores, Singapura' } },
    { id: 'world-luxury-hotel', mark: 'World Luxury Hotel Awards', note: { en: 'Winner — Hotel Bela Vista, Relais & Châteaux', pt: 'Vencedor — Hotel Bela Vista, Relais & Châteaux' } },
    { id: 'tripadvisor', mark: 'Tripadvisor', note: { en: 'Hotel Real Palácio — best Portuguese luxury hotel, 31st worldwide', pt: 'Hotel Real Palácio — melhor hotel de luxo português, 31.º do mundo' } },
    { id: 'marbella', mark: 'Marbella Meeting Point', note: { en: 'Hotel Real Santa Eulália & SPA — best international luxury resort', pt: 'Hotel Real Santa Eulália & SPA — melhor resort de luxo internacional' } },
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
