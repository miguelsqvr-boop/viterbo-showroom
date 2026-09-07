import { MAP } from '@/content/generated/map';

/**
 * Where the studio has worked, as a drawing.
 *
 * Nineteen dots and a land outline, no labels. Labels are impossible here and
 * would be wrong anyway: Cascais, Lisboa and Comporta fall within eleven pixels
 * of each other at this scale, and the four European clusters would collapse
 * into a smear of leader lines. The screen that follows names every one of them
 * at 56px, which is the size they can actually be read at from three metres.
 *
 * So the map's job is the shape of the reach — home dense, then a scatter that
 * runs to Luanda, Macau, Bangkok, Singapore and across to Brazil — and the list
 * does the naming. Between them they say more than either does alone, which is
 * why both are here rather than one.
 *
 * The outline is baked at build time; see scripts/generate-map.ts.
 */
export function WorldMap({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MAP.width} ${MAP.height}`}
      className={className}
      role="img"
      aria-label={MAP.points.map((point) => point.name).join(', ')}
    >
      <path d={MAP.land} fill="var(--color-hairline)" />
      {MAP.points.map((point) => (
        <circle key={point.name} cx={point.x} cy={point.y} r={10} fill="var(--color-accent)" />
      ))}
    </svg>
  );
}
