/** Contact (§8). QR targets are dedicated landing pages so the screen’s contribution is measurable. */
export const CONTACT = {
  /**
   * The details below were taken from the studio's own published contact
   * information, not invented — but they still want Miguel's eye, because
   * three things did not match what this app originally assumed:
   *
   *   - the email is on viterbo-id.com, not viterbointeriordesign.com
   *   - the Instagram handle has underscores (@viterbo_interior_design)
   *   - the studio is at Rua das Papoilas 422 in Birre, not Rua da Bela Vista
   *
   * Still open, and the reason this stays false:
   *
   *   - `primaryUrl` pointed at /showroom, a dedicated landing page that was
   *     never created: Miguel scanned the panel on 30 Sept and the phone got
   *     the site's 404 ("Nada encontrado"). It now points at the homepage,
   *     which exists, and carries ?utm_source=showroom so the visits are
   *     still attributable to the panel. If the studio ever builds a real
   *     /showroom page, move the URL back and re-run `npm run qr`.
   *   - the panel stands beside the Cabinet of Curiosities, which is the
   *     Estoril shop (Av. de Nice 68) rather than the Cascais studio. Decide
   *     which address a visitor standing in front of the screen should see.
   *
   * `npm run verify` fails while this is false.
   */
  verified: false,

  /** The homepage, tagged: a dead landing page costs more than a lost segment. */
  primaryUrl: 'https://viterbointeriordesign.com/?utm_source=showroom',
  instagramUrl: 'https://instagram.com/viterbo_interior_design',
  address: ['Rua das Papoilas 422, armazém B', '2750-757 Cascais', 'Portugal'],
  phone: '+351 21 464 6240',
  email: 'info@viterbo-id.com',
  hours: { en: 'Monday to Friday, 9h30 – 18h30', pt: 'Segunda a sexta, 9h30 – 18h30' },
  /** Set false to ship the screen without a form (§8 makes it optional). */
  formEnabled: true,
} as const;
