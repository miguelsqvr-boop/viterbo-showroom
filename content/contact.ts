/** Contact (§8). QR targets are dedicated landing pages so the screen’s contribution is measurable. */
export const CONTACT = {
  /** NOT the homepage — a dedicated page, so showroom traffic is attributable. */
  primaryUrl: 'https://viterbointeriordesign.com/showroom',
  instagramUrl: 'https://instagram.com/viterbointeriordesign',
  address: ['Rua da Bela Vista 12', '2750 Cascais', 'Portugal'],
  phone: '+351 214 000 000',
  email: 'studio@viterbointeriordesign.com',
  hours: { en: 'Monday to Friday, 9h30 – 18h30', pt: 'Segunda a sexta, 9h30 – 18h30' },
  /** Set false to ship the screen without a form (§8 makes it optional). */
  formEnabled: true,
} as const;
