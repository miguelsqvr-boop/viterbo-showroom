/**
 * Contact sheets of a project AS THE PANEL RENDERS IT.
 *
 * The verification suite measures geometry; it cannot see a photograph. Every
 * fault that has actually shipped on this panel was found by rendering and
 * looking: five Porto Villa frames stored sideways, a Studio crop cutting the
 * principals' heads off, a gallery frame that never mounted. A contact sheet of
 * the source files catches some of that, but not a crop — a frame is chosen as
 * a whole photograph and shown as a band, and the two are not the same picture.
 *
 * So this walks a project's frame stack at true panel size and tiles what the
 * screen shows, one sheet per project.
 *
 *   npm run media:shoot -- cabana-sass hotel-albatroz
 *
 * Needs a build being served. Start one first (`npm run start`) and pass the
 * port with PORT= if it is not 3410.
 *
 * Two things it has to do that are easy to miss:
 *
 * 1. Poke the panel awake. It shows the attract loop until it is touched and
 *    returns to it after PANEL.idleTimeoutMs. Programmatic scrolling is not a
 *    poke — the idle detector listens for pointerdown, touchstart, wheel and
 *    keydown — so an unpoked run screenshots the attract carousel eleven times
 *    and looks, at a glance, like a project with the wrong photographs in it.
 * 2. Click on the RIGHT of the panel. The only tap target on a project screen
 *    is the "All projects" control, which is fixed to the left edge.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';
import { PHYSICAL } from '../config/panel';

async function main() {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error('usage: npm run media:shoot -- <slug> [slug…]');
    process.exit(1);
  }
  const port = Number(process.env.PORT ?? 3410);
  const out = process.env.OUT_DIR ?? '/tmp/panel';
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const context = await browser.newContext({
    viewport: { width: PHYSICAL.cssWidth, height: PHYSICAL.cssHeight },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const slug of slugs) {
    await page.goto(`http://localhost:${port}/projects/${slug}`, {
      waitUntil: 'load',
      timeout: 120_000,
    });
    await page.waitForTimeout(1500);
    await page.mouse.click(PHYSICAL.cssWidth - 260, PHYSICAL.cssHeight * 0.62);
    await page.waitForTimeout(1200);
    if (!page.url().includes(slug)) {
      throw new Error(`the wake-up click navigated away from ${slug}: ${page.url()}`);
    }

    const sections = page.locator('[data-scroll-root] > section');
    const count = await sections.count();
    const shots: Buffer[] = [];
    for (let i = 0; i < count; i++) {
      await sections.nth(i).evaluate((el) => el.scrollIntoView({ block: 'start' }));
      await page.keyboard.press('Shift'); // keeps the attract loop from returning
      await page.waitForTimeout(1400);
      shots.push(await page.screenshot());
    }

    const CELL = 300;
    const LABEL = 22;
    const COLS = 6;
    const cells = await Promise.all(
      shots.map(async (buf) => {
        const img = await sharp(buf).resize(CELL - 8).jpeg({ quality: 78 }).toBuffer();
        const { height = 0 } = await sharp(img).metadata();
        return { img, height };
      }),
    );
    const rowHeight = Math.max(...cells.map((c) => c.height)) + LABEL;
    const rows = Math.ceil(cells.length / COLS);
    const composite = cells.flatMap((cell, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const caption = i === 0 ? 'hero' : String(i).padStart(2, '0');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CELL}" height="${LABEL}">
        <rect width="${CELL}" height="${LABEL}" fill="#ffffff"/>
        <text x="6" y="16" font-family="monospace" font-size="14" fill="#111">${caption}</text>
      </svg>`;
      return [
        { input: cell.img, left: col * CELL + 4, top: row * rowHeight },
        { input: Buffer.from(svg), left: col * CELL, top: row * rowHeight + cell.height },
      ];
    });
    await sharp({
      create: { width: COLS * CELL, height: rows * rowHeight, channels: 3, background: '#ffffff' },
    })
      .composite(composite)
      .jpeg({ quality: 80 })
      .toFile(`${out}/${slug}.jpg`);
    process.stdout.write(`  ${slug}: ${count} screens -> ${out}/${slug}.jpg\n`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
