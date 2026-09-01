'use client';

import { PANEL } from '@/config/panel';
import { useLocale } from '@/lib/locale';
import { useTap } from '@/lib/tap';

/**
 * The app's own keyboard.
 *
 * Android's IME cannot be trusted on a kiosk: it resizes the viewport, brings
 * its own chrome and its own settings shortcut, and lands at the bottom of a
 * 181cm totem where nobody can reach it. So the app draws its own, inside the
 * reach zone.
 *
 * Rows wrap at eight rather than ten. In the pinned 1080 space ten keys across
 * gives 105px and nine gives 107px — both under the 120px floor an IR panel
 * needs (§6). Eight gives 122px with room for the gutters, and the letter
 * sequence a visitor scans for is unchanged.
 */
const KEY = 122;
const GAP = 8;
const ROWS = ['qwertyui', 'opasdfgh', 'jklzxcvb'];

export function Keyboard({
  onKey,
  onBackspace,
  onSpace,
  mode,
}: {
  onKey: (character: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  mode: 'text' | 'email';
}) {
  const { t } = useLocale();
  return (
    <div className="select-none" style={{ paddingInline: 24 }}>
      {ROWS.map((row) => (
        <div key={row} className="flex justify-center" style={{ gap: GAP, marginBottom: GAP }}>
          {row.split('').map((character) => (
            <Key key={character} label={character} onPress={() => onKey(character)} />
          ))}
        </div>
      ))}

      <div className="flex justify-center" style={{ gap: GAP, marginBottom: GAP }}>
        <Key label="n" onPress={() => onKey('n')} />
        <Key label="m" onPress={() => onKey('m')} />
        <Key label={t('spaceKey')} onPress={onSpace} span={2} />
        <Key label="⌫" onPress={onBackspace} span={2} />
      </div>

      {mode === 'email' ? (
        <div className="flex justify-center" style={{ gap: GAP }}>
          <Key label="@" onPress={() => onKey('@')} />
          <Key label="." onPress={() => onKey('.')} />
          <Key label="-" onPress={() => onKey('-')} />
          <Key label="_" onPress={() => onKey('_')} />
          <Key label=".com" onPress={() => onKey('.com')} span={2} />
        </div>
      ) : null}
    </div>
  );
}

function Key({
  label,
  onPress,
  span = 1,
}: {
  label: string;
  onPress: () => void;
  span?: 1 | 2;
}) {
  const press = useTap(onPress);
  return (
    <button
      type="button"
      data-tap-target
      aria-label={label}
      onPointerUp={press}
      className="press flex items-center justify-center rounded-[6px] border border-hairline bg-ground-raised text-meta text-ink"
      style={{ width: KEY * span + GAP * (span - 1), height: Math.max(KEY, PANEL.minTouchTarget) }}
    >
      {label}
    </button>
  );
}
