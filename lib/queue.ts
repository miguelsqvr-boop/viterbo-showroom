'use client';

import type { Locale } from '@/content/types';

/**
 * A submission queue that survives a Wi-Fi outage and a browser restart (§8).
 *
 * The showroom's network is the one thing nobody in the room controls, so a
 * lead is written to storage before the request is attempted and only removed
 * once the server has actually accepted it.
 */
const KEY = 'viterbo.contact.queue';

export type Lead = { name: string; email: string; locale: Locale; at: string };

function read(): Lead[] {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '[]') as Lead[];
  } catch {
    return [];
  }
}

function write(leads: Lead[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(leads));
  } catch {
    /* Storage full or blocked — the in-flight POST is still the primary path. */
  }
}

export function enqueue(lead: Lead) {
  write([...read(), lead]);
}

async function post(lead: Lead): Promise<boolean> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
    });
    // 4xx means this lead will never be accepted; drop it rather than retry forever.
    return response.ok || (response.status >= 400 && response.status < 500);
  } catch {
    return false;
  }
}

/** Returns true if the lead reached the server on this attempt. */
export async function submit(lead: Lead): Promise<boolean> {
  enqueue(lead);
  const sent = await post(lead);
  if (sent) remove(lead);
  return sent;
}

function remove(lead: Lead) {
  write(read().filter((entry) => entry.at !== lead.at || entry.email !== lead.email));
}

export async function flush() {
  const pending = read();
  if (pending.length === 0) return;
  for (const lead of pending) {
    if (await post(lead)) remove(lead);
  }
}

export function watchForReconnect() {
  window.addEventListener('online', () => void flush());
  void flush();
}
