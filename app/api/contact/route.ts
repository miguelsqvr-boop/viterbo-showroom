import { NextResponse } from 'next/server';

/**
 * Contact form endpoint (§8).
 *
 * "Do not ship a form that fails silently" is taken literally: with no
 * destination configured this returns 503 so the client queues the submission
 * and retries, rather than showing a success state for a lead that went
 * nowhere. Set CONTACT_WEBHOOK_URL in the Vercel project before the screen
 * goes live, or set CONTACT.formEnabled to false and ship QR codes only.
 */
export const runtime = 'edge';

type Payload = { name?: unknown; email?: unknown; locale?: unknown; at?: unknown };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (name.length < 2 || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 422 });
  }

  const destination = process.env.CONTACT_WEBHOOK_URL;
  if (!destination) {
    console.error('[contact] CONTACT_WEBHOOK_URL is not set — refusing to accept a lead silently.');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const response = await fetch(destination, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      source: 'showroom-totem',
      name,
      email,
      locale: typeof body.locale === 'string' ? body.locale : 'en',
      at: typeof body.at === 'string' ? body.at : new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
