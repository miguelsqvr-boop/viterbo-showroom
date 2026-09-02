/** Contact (§8). QR targets are dedicated landing pages so the screen’s contribution is measurable. */
export const CONTACT = {
  /**
   * NOT YET CHECKED BY THE STUDIO.
   *
   * Everything below is a working assumption written to lay the screen out —
   * the phone number is a literal placeholder, and the address, email and both
   * QR targets are unconfirmed. This is the one screen a visitor acts on, so
   * shipping it unverified means handing someone a number that does not ring.
   *
   * `npm run verify` fails while this is false. Check every field against what
   * the studio actually uses, confirm the two URLs resolve, then set it true.
   */
  verified: false,

  /** NOT the homepage — a dedicated page, so showroom traffic is attributable. */
  primaryUrl: 'https://viterbointeriordesign.com/showroom',
  instagramUrl: 'https://instagram.com/viterbointeriordesign',
  address: ['Rua da Bela Vista 12', '2750 Cascais', 'Portugal'],
  phone: '+351 214 000 000', // placeholder — see `verified` above
  email: 'studio@viterbointeriordesign.com',
  hours: { en: 'Monday to Friday, 9h30 – 18h30', pt: 'Segunda a sexta, 9h30 – 18h30' },
  /** Set false to ship the screen without a form (§8 makes it optional). */
  formEnabled: true,
} as const;
