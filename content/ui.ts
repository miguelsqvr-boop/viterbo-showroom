/**
 * Every user-facing string that is not project content (§9).
 *
 * No hardcoded copy in components — the PT toggle must flip everything,
 * including button labels and the attract-loop invitation.
 */
import type { Locale, Localized } from './types';

export const UI = {
  touchToExplore: { en: 'Touch to explore', pt: 'Toque para explorar' },
  projects: { en: 'Projects', pt: 'Projetos' },
  studio: { en: 'Studio', pt: 'Estúdio' },
  services: { en: 'Services', pt: 'Serviços' },
  /*
   * The studio's own spelling, from viterbointeriordesign.com/our-studio: the
   * page is headed "Specialties", not "Specialities".
   */
  specialties: { en: 'Specialties', pt: 'Especialidades' },
  contact: { en: 'Contact', pt: 'Contacto' },
  /*
   * Staff-facing, and the only string in here that a visitor is not meant to
   * read. It is still localized: whoever opens the showroom in the morning
   * reads Portuguese.
   */
  fullScreen: { en: 'Full screen', pt: 'Ecrã inteiro' },
  viewProject: { en: 'View project', pt: 'Ver projeto' },
  back: { en: 'Back', pt: 'Voltar' },
  backToProjects: { en: 'All projects', pt: 'Todos os projetos' },
  close: { en: 'Close', pt: 'Fechar' },
  gallery: { en: 'Gallery', pt: 'Galeria' },
  facts: { en: 'Project', pt: 'Projeto' },
  year: { en: 'Year', pt: 'Ano' },
  area: { en: 'Area', pt: 'Área' },
  scopeLabel: { en: 'Scope', pt: 'Âmbito' },
  architect: { en: 'Architect', pt: 'Arquitetura' },
  locationLabel: { en: 'Location', pt: 'Localização' },
  where: { en: 'Where we have worked', pt: 'Onde trabalhámos' },
  /*
   * The collection's scroll cue. "Deslize" rather than a literal translation of
   * scroll: on a touch panel the gesture is a swipe, and that is the word for
   * it. Written early, then left unused until the collection grew a cue.
   */
  scrollHint: { en: 'Scroll', pt: 'Deslize' },
  awards: { en: 'Recognition', pt: 'Reconhecimento' },
  /*
   * The nav label, short. "Reconhecimento" is 239px set in the bar, and with
   * five items that puts Portuguese 56px over the 984px the bar has to give.
   * The screen keeps the full word as its heading; only the bar abbreviates,
   * the same way Craft does. PROVISIONAL — "Premios" reads as prizes and this
   * list also carries press, so the studio should pick the word.
   */
  awardsShort: { en: 'Recognition', pt: 'Prémios' },
  visitUs: { en: 'Talk to the studio', pt: 'Fale com o estúdio' },
  leaveDetails: { en: 'Leave your details', pt: 'Deixe os seus dados' },
  followUs: { en: 'Instagram', pt: 'Instagram' },
  scanForMore: { en: 'Scan to continue on your phone', pt: 'Digitalize para continuar no seu telemóvel' },
  name: { en: 'Name', pt: 'Nome' },
  email: { en: 'Email', pt: 'Email' },
  send: { en: 'Send', pt: 'Enviar' },
  next: { en: 'Next', pt: 'Seguinte' },
  spaceKey: { en: 'space', pt: 'espaço' },
  sending: { en: 'Sending', pt: 'A enviar' },
  /*
   * Said out loud rather than implied by a moving line. The studio watched a
   * visitor wait through a cold cache and could not tell the screen was
   * working, which is the whole argument for a word.
   */
  loading: { en: 'Loading', pt: 'A carregar' },
  sent: { en: 'Thank you. The studio will be in touch.', pt: 'Obrigado. O estúdio entrará em contacto.' },
  queued: { en: 'Saved. It will send when the screen is back online.', pt: 'Guardado. Será enviado quando o ecrã voltar a estar online.' },
  formInvalid: { en: 'A name and a valid email, please.', pt: 'Um nome e um email válidos, por favor.' },
  zoomHint: { en: 'Double tap to zoom', pt: 'Toque duas vezes para ampliar' },
  offline: { en: 'Showing the last saved version', pt: 'A mostrar a última versão guardada' },
  updating: { en: 'Updating', pt: 'A atualizar' },
  updated: { en: 'Updated', pt: 'Atualizado' },
} satisfies Record<string, Localized>;

export type UIKey = keyof typeof UI;

export function t(key: UIKey, locale: Locale): string {
  return UI[key][locale];
}

export const LOCALE_LABEL: Record<Locale, string> = { en: 'EN', pt: 'PT' };
