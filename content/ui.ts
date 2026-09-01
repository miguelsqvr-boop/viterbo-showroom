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
  craft: { en: 'The art of craft', pt: 'A arte do ofício' },
  studio: { en: 'Studio', pt: 'Estúdio' },
  contact: { en: 'Contact', pt: 'Contacto' },
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
  collaborations: { en: 'Collaborations', pt: 'Colaborações' },
  scrollHint: { en: 'Scroll', pt: 'Deslize' },
  awards: { en: 'Recognition', pt: 'Reconhecimento' },
  visitUs: { en: 'Talk to the studio', pt: 'Fale com o estúdio' },
  leaveDetails: { en: 'Leave your details', pt: 'Deixe os seus dados' },
  followUs: { en: 'Instagram', pt: 'Instagram' },
  scanForMore: { en: 'Scan to continue on your phone', pt: 'Digitalize para continuar no seu telemóvel' },
  name: { en: 'Name', pt: 'Nome' },
  email: { en: 'Email', pt: 'Email' },
  send: { en: 'Send', pt: 'Enviar' },
  sending: { en: 'Sending', pt: 'A enviar' },
  sent: { en: 'Thank you. The studio will be in touch.', pt: 'Obrigado. O estúdio entrará em contacto.' },
  queued: { en: 'Saved. It will send when the screen is back online.', pt: 'Guardado. Será enviado quando o ecrã voltar a estar online.' },
  formInvalid: { en: 'A name and a valid email, please.', pt: 'Um nome e um email válido, por favor.' },
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
