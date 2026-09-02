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
   *   - `primaryUrl` points at /showroom, a dedicated landing page that has to
   *     exist before the QR is worth printing. It does not yet. Either create
   *     it or point the QR at the live contacts page.
   *   - the panel stands beside the Cabinet of Curiosities, which is the
   *     Estoril shop (Av. de Nice 68) rather than the Cascais studio. Decide
   *     which address a visitor standing in front of the screen should see.
   *
   * `npm run verify` fails while this is false.
   */
  verified: false,

  /** NOT the homepage — a dedicated page, so showroom traffic is attributable. */
  primaryUrl: 'https://viterbointeriordesign.com/showroom',
  instagramUrl: 'https://instagram.com/viterbo_interior_design',
  address: ['Rua das Papoilas 422, armazém B', '2750-757 Cascais', 'Portugal'],
  phone: '+351 21 464 6240',
  email: 'info@viterbo-id.com',
  hours: { en: 'Monday to Friday, 9h30 – 18h30', pt: 'Segunda a sexta, 9h30 – 18h30' },
  /** Set false to ship the screen without a form (§8 makes it optional). */
  formEnabled: true,
} as const;
