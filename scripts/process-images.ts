/**
 * The image pipeline (§13). Viterbo will add projects for years — this must
 * never be a manual job.
 *
 * Put full-resolution originals (3840px on the long edge or better) in:
 *
 *   media-src/<group>/<name>.{jpg,jpeg,png,tif,tiff,webp}
 *
 * where <group> is a project slug, `craft`, or `attract`. Then:
 *
 *   npm run media:process              # masters + metadata
 *   npm run media:process -- --variants  # also emit the three sizes in both
 *                                        # formats, for the on-panel A/B
 *
 * Masters land in public/media/<group>/ and are served through next/image,
 * which is configured to emit exactly 1080 / 1620 / 2160 and nothing else — so
 * a collection thumbnail can never be handed a 2160px file.
 *
 * `--variants` exists for one reason: §13 says not to assume AVIF beats WebP.
 * AVIF is smaller on the wire and more expensive to decode, and on a weak SoC
 * a larger WebP can render faster. Build both, run panel-diagnostics.html on
 * the panel, and ship whichever holds 60fps.
 */
import sharp from 'sharp';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'media-src');
const OUT = path.join(process.cwd(), 'public', 'media');
const MANIFEST = path.join(process.cwd(), 'content', 'generated', 'media.ts');

/** §13 — the widths the app budgets for, and what each is allowed to weigh. */
const SIZES = [
  { width: 1080, budgetKB: 150, use: 'collection band' },
  { width: 1620, budgetKB: 300, use: 'gallery rail' },
  { width: 2160, budgetKB: 700, use: 'hero and full view' },
] as const;

const MASTER_LONG_EDGE = 2160;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']);

type Entry = { key: string; src: string; width: number; height: number; aspect: string; blur: string };

function aspectOf(width: number, height: number): 'landscape' | 'portrait' | 'square' {
  const ratio = width / height;
  if (ratio > 1.05) return 'landscape';
  if (ratio < 0.95) return 'portrait';
  return 'square';
}

async function blurDataURL(input: sharp.Sharp): Promise<string> {
  const tiny = await input.clone().resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}

async function listGroups(): Promise<string[]> {
  try {
    const found = await readdir(SRC, { withFileTypes: true });
    return found.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function main() {
  const emitVariants = process.argv.includes('--variants');
  const groups = await listGroups();

  if (groups.length === 0) {
    process.stdout.write(
      `No originals found.\n\n` +
        `  Create media-src/<project-slug>/ and drop the full-resolution files in.\n` +
        `  Example: media-src/casa-do-restelo/hero.jpg\n`,
    );
    return;
  }

  const entries: Entry[] = [];
  const warnings: string[] = [];

  for (const group of groups) {
    const files = (await readdir(path.join(SRC, group))).filter((file) =>
      EXTENSIONS.has(path.extname(file).toLowerCase()),
    );
    await mkdir(path.join(OUT, group), { recursive: true });

    for (const file of files.sort()) {
      const name = path.basename(file, path.extname(file));
      const absolute = path.join(SRC, group, file);
      const original = sharp(absolute, { failOn: 'none' }).rotate(); // honour EXIF, then drop it
      const meta = await original.metadata();
      const sourceWidth = meta.width ?? 0;
      const sourceHeight = meta.height ?? 0;
      if (sourceWidth === 0 || sourceHeight === 0) {
        warnings.push(`${group}/${file}: unreadable dimensions, skipped`);
        continue;
      }
      if (Math.max(sourceWidth, sourceHeight) < 3840) {
        warnings.push(
          `${group}/${file}: ${sourceWidth}×${sourceHeight} — source originals should be 3840px on the long edge or better`,
        );
      }

      const portrait = sourceHeight > sourceWidth;
      const master = original
        .clone()
        .resize(
          portrait
            ? { height: Math.round(MASTER_LONG_EDGE * (16 / 9)), withoutEnlargement: true }
            : { width: MASTER_LONG_EDGE, withoutEnlargement: true },
        );

      const buffer = await master.clone().webp({ quality: 78, effort: 5 }).toBuffer();
      const masterMeta = await sharp(buffer).metadata();
      const relative = `/media/${group}/${name}.webp`;
      await writeFile(path.join(OUT, group, `${name}.webp`), buffer);

      entries.push({
        key: `${group}/${name}`,
        src: relative,
        width: masterMeta.width ?? sourceWidth,
        height: masterMeta.height ?? sourceHeight,
        aspect: aspectOf(masterMeta.width ?? sourceWidth, masterMeta.height ?? sourceHeight),
        blur: await blurDataURL(sharp(buffer)),
      });

      if (emitVariants) {
        const variantDir = path.join(OUT, group, 'variants');
        await mkdir(variantDir, { recursive: true });
        for (const size of SIZES) {
          const resized = original.clone().resize({ width: size.width, withoutEnlargement: true });
          const avif = await resized.clone().avif({ quality: 52, effort: 4 }).toBuffer();
          const webp = await resized.clone().webp({ quality: 76, effort: 5 }).toBuffer();
          await writeFile(path.join(variantDir, `${name}-${size.width}.avif`), avif);
          await writeFile(path.join(variantDir, `${name}-${size.width}.webp`), webp);
          const worst = Math.max(avif.byteLength, webp.byteLength) / 1024;
          if (worst > size.budgetKB) {
            warnings.push(
              `${group}/${name} @${size.width} (${size.use}): ${worst.toFixed(0)}KB over the ${size.budgetKB}KB budget`,
            );
          }
        }
      }

      process.stdout.write(`  ${group}/${name} ${(buffer.byteLength / 1024).toFixed(0)}KB\n`);
    }
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(
    MANIFEST,
    `// GENERATED by scripts/process-images.ts — do not edit by hand.\n` +
      `import type { Image } from '../types';\n\n` +
      `export const MEDIA: Record<string, Image> = {\n` +
      entries
        .map(
          (entry) =>
            `  '${entry.key}': { src: '${entry.src}', width: ${entry.width}, height: ${entry.height}, ` +
            `aspect: '${entry.aspect}', blurDataURL: '${entry.blur}', ` +
            `alt: { en: '', pt: '' } },`,
        )
        .join('\n') +
      `\n};\n\n` +
      `export function media(key: string): Image {\n` +
      `  const found = MEDIA[key];\n` +
      `  if (!found) throw new Error(\`Unknown media: \${key}\`);\n` +
      `  return found;\n}\n`,
    'utf8',
  );

  process.stdout.write(`\n${entries.length} images → ${path.relative(process.cwd(), MANIFEST)}\n`);
  if (warnings.length) {
    process.stdout.write(`\n${warnings.length} warning(s):\n`);
    warnings.forEach((warning) => process.stdout.write(`  ! ${warning}\n`));
  }
  process.stdout.write(
    `\nAlt text is emitted empty on purpose — it is copy, not metadata. Fill it in\n` +
      `content/*.ts where the image is used, in both languages.\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
