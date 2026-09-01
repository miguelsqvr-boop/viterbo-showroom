'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CONTACT } from '@/content/contact';
import { QR_INSTAGRAM, QR_PRIMARY } from '@/content/generated/qr';
import { useLocale } from '@/lib/locale';
import { submit, watchForReconnect } from '@/lib/queue';
import { Keyboard } from './Keyboard';
import { TapTarget } from './TapTarget';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact (§8).
 *
 * The large QR points at a dedicated landing page rather than the homepage, so
 * the screen's contribution to enquiries is measurable rather than assumed.
 */
export function ContactView() {
  const { s, t } = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    watchForReconnect();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-x-0 px-14" style={{ top: '9%' }}>
        <h1 className="text-section">{t('visitUs')}</h1>
      </div>

      {/* The QR is display, not a target — it is read by a phone, not a finger. */}
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: '17%' }}>
        <div
          className="bg-transparent"
          style={{ width: 400, height: 400 }}
          dangerouslySetInnerHTML={{ __html: QR_PRIMARY }}
        />
        <p className="mt-6 text-caption text-ink-faint">{t('scanForMore')}</p>
      </div>

      {CONTACT.formEnabled ? (
        <div className="absolute inset-x-0 flex justify-center px-14" style={{ top: '58%' }}>
          <TapTarget
            label={t('leaveDetails')}
            onTap={() => setOpen(true)}
            className="justify-center rounded-[6px] border border-hairline px-12"
          >
            <span className="text-meta text-ink">{t('leaveDetails')}</span>
          </TapTarget>
        </div>
      ) : null}

      {/* Display only, below the reach zone: address, phone, email, hours. */}
      <div className="absolute inset-x-0 flex items-end justify-between px-14" style={{ top: '76%' }}>
        <div className="text-caption leading-[1.7] text-ink-muted">
          {CONTACT.address.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="mt-4">{CONTACT.phone}</p>
          <p>{CONTACT.email}</p>
          <p className="mt-4 text-ink-faint">{s(CONTACT.hours)}</p>
        </div>
        <div className="flex flex-col items-center">
          <div
            style={{ width: 170, height: 170 }}
            dangerouslySetInnerHTML={{ __html: QR_INSTAGRAM }}
          />
          <p className="mt-3 text-caption text-ink-faint">{t('followUs')}</p>
        </div>
      </div>

      <AnimatePresence>{open ? <ContactForm onClose={() => setOpen(false)} /> : null}</AnimatePresence>
    </div>
  );
}

/**
 * Name and email only. Anything more is a form a visitor abandons standing up.
 */
function ContactForm({ onClose }: { onClose: () => void }) {
  const { t, locale } = useLocale();
  const [field, setField] = useState<'name' | 'email'>('name');
  const [values, setValues] = useState({ name: '', email: '' });
  const [state, setState] = useState<'editing' | 'sending' | 'sent' | 'queued' | 'invalid'>(
    'editing',
  );

  const valid = values.name.trim().length >= 2 && EMAIL.test(values.email.trim());

  function type(character: string) {
    setState('editing');
    setValues((current) => ({ ...current, [field]: current[field] + character }));
  }

  async function send() {
    if (!valid) {
      setState('invalid');
      return;
    }
    setState('sending');
    const reached = await submit({
      name: values.name.trim(),
      email: values.email.trim(),
      locale,
      at: new Date().toISOString(),
    });
    setState(reached ? 'sent' : 'queued');
    setTimeout(onClose, 2600);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-ground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {state === 'sent' || state === 'queued' ? (
        <div className="absolute inset-x-0 px-14 text-center" style={{ top: '38%' }}>
          <p className="text-section">{state === 'sent' ? t('sent') : t('queued')}</p>
        </div>
      ) : (
        <>
          {/*
           * The fields are display, not targets.
           *
           * Two tappable field rows plus a 120px keyboard plus an actions row
           * is 1010px of content in the 845px the reach envelope allows, so
           * something had to give — and it should not be the key size on an IR
           * panel. Advancing with one forward button instead of letting the
           * visitor pick a field costs nothing here (there are two fields, in
           * an obvious order) and buys back 240px.
           */}
          <div className="absolute inset-x-0 px-14" style={{ top: '15%' }}>
            {(['name', 'email'] as const).map((key) => (
              <div
                key={key}
                className="flex w-full items-baseline gap-6 py-5"
                style={{
                  borderBottom:
                    field === key
                      ? '2px solid var(--color-accent)'
                      : '1px solid var(--color-hairline)',
                }}
              >
                <span className="w-[180px] text-caption text-ink-faint">{t(key)}</span>
                <span className="text-body text-ink">
                  {values[key]}
                  {field === key ? <Caret /> : null}
                </span>
              </div>
            ))}
            {state === 'invalid' ? (
              <p className="mt-4 text-caption text-accent">{t('formInvalid')}</p>
            ) : null}
          </div>

          <div className="absolute inset-x-0" style={{ top: '30%' }}>
            <Keyboard
              mode={field === 'email' ? 'email' : 'text'}
              onKey={type}
              onSpace={() => type(' ')}
              onBackspace={() =>
                setValues((current) => ({ ...current, [field]: current[field].slice(0, -1) }))
              }
            />
          </div>

          <div className="absolute inset-x-0 flex justify-between px-14" style={{ top: '65%' }}>
            <TapTarget label={t('close')} onTap={onClose} className="px-8">
              <span className="text-meta text-ink-faint">{t('close')}</span>
            </TapTarget>
            <div className="flex items-center gap-6">
              {field === 'email' ? (
                <TapTarget label={t('back')} onTap={() => setField('name')} className="px-8">
                  <span className="text-meta text-ink-faint">{t('back')}</span>
                </TapTarget>
              ) : null}
              <TapTarget
                label={field === 'name' ? t('next') : t('send')}
                onTap={() => (field === 'name' ? setField('email') : void send())}
                className="justify-center rounded-[6px] border border-hairline px-12"
              >
                <span
                  className="text-meta"
                  style={{
                    color:
                      field === 'name' || valid ? 'var(--color-ink)' : 'var(--color-ink-faint)',
                  }}
                >
                  {state === 'sending' ? t('sending') : field === 'name' ? t('next') : t('send')}
                </span>
              </TapTarget>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function Caret() {
  return (
    <motion.span
      className="ml-1 inline-block"
      style={{ width: 2, height: 34, background: 'var(--color-accent)', verticalAlign: 'middle' }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
    />
  );
}
