/**
 * Panel acceptance harness.
 *
 * Renders every screen at the panel's own geometry and asserts the rules the
 * brief is unambiguous about — the ones that would otherwise be enforced by
 * somebody remembering to look at a screenshot, and that quietly rot the first
 * time anyone edits content/projects.ts or adds a project with a longer name.
 *
 *   npm run verify            # builds nothing; expects `npm run build` first
 *   BASE_URL=https://…  npm run verify   # or point it at a deployment
 *
 * What it checks, per route, per locale:
 *
 *   1. Every visible tap target sits between 28% and 72% of screen height.
 *      (§3 gives 13–55%, §15 gives 28–72%; this build uses the intersection,
 *      so the stricter bound of each applies.)
 *   2. Every tap target is at least PANEL.minTouchTarget on its shortest side.
 *   3. No rendered text below 24px.
 *   4. Nothing overflows the pinned 1080 CSS space horizontally.
 *   5. No text is painted underneath the navigation bar, which is opaque —
 *      this is what catches a narrative or a city list growing into the
 *      chrome, which a type change or a translation can do at any time.
 *   6. The viewport really is pinned to width=1080.
 *
 * PT is checked as well as EN on purpose: Portuguese runs longer than English
 * almost everywhere, and a label that fits in one language is not evidence.
 */
import { chromium, type Browser, type Page } from 'playwright';
import sharp from 'sharp';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import { PANEL, PHYSICAL } from '../config/panel';
import { CHROME, PRIME } from '../config/layout';
import { COLLECTION } from '../config/layout';
import { LOCALES, mediaPoster, type Locale, type Localized } from '../content/types';
import { PROJECTS_IN_ORDER } from '../content/projects';
import { CITIES, COLLABORATIONS, CRAFT_STAGES } from '../content/craft';
import { STUDIO } from '../content/studio';
import { CONTACT } from '../content/contact';
import { UI } from '../content/ui';
import { BRAND } from '../config/brand';

/** Chromium ships with the image; Playwright's own download is disabled. */
const EXECUTABLE = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const ENVELOPE = { top: 28, bottom: 72 } as const;
const TYPE_FLOOR = 24;

type Violation = { view: string; locale: Locale; rule: string; detail: string };

/**
 * Strings that are legitimately the same in both languages.
 *
 * Derived from the content model rather than hand-listed: any Localized field
 * whose two halves are already identical is, by definition, meant to be. Add
 * proper nouns — cities, collaborators, publication marks — and everything
 * left over that renders identically in EN and PT is a string that never went
 * through the locale layer.
 */
function identicalByDesign(): Set<string> {
  const allowed = new Set<string>();
  const consider = (value: Localized) => {
    if (value.en === value.pt) allowed.add(value.en);
  };

  Object.values(UI).forEach(consider);
  PROJECTS_IN_ORDER.forEach((project) => {
    [project.name, project.location, project.typology, project.narrative].forEach(consider);
    if (project.scope) consider(project.scope);
    if (project.area) allowed.add(project.area);
    if (project.architect) allowed.add(project.architect);
    // Photographer names are proper nouns — Francisco Nogueira is Francisco
    // Nogueira in both languages, and that is not a missing translation.
    if (project.photographer) allowed.add(project.photographer);
  });
  CRAFT_STAGES.forEach((stage) => {
    consider(stage.title);
    consider(stage.line);
  });
  consider(STUDIO.body);
  consider(STUDIO.figures);
  STUDIO.awards.forEach((award) => {
    allowed.add(award.mark);
    consider(award.note);
  });
  CITIES.forEach((city) => allowed.add(city));
  COLLABORATIONS.forEach((collaboration) => {
    allowed.add(collaboration.name);
    consider(collaboration.note);
  });
  CONTACT.address.forEach((line) => allowed.add(line));
  [CONTACT.phone, CONTACT.email, BRAND.wordmark, 'EN', 'PT'].forEach((value) =>
    allowed.add(value),
  );
  return allowed;
}

/** Text that carries no language: keys, counters, years, separators. */
function languageless(text: string): boolean {
  return text.length <= 4 || /^[\d\s/·—–-]+$/.test(text);
}

type View = {
  name: string;
  path: string;
  /** Scroll offset in viewport heights, applied to the page's scroll root. */
  section?: number;
  /** Collection cards snap on their own stride, not a whole screen. */
  cardIndex?: number;
  prepare?: (page: Page) => Promise<void>;
};

/**
 * The palest gallery frame in the archive, and which slide it is.
 *
 * The full view lays white type straight onto a photograph, so whether that
 * type is legible depends entirely on which photograph. Testing one arbitrary
 * slide proves nothing — the first landscape project's first slide happens to
 * be dark, and passes whether or not the scrim behind the controls exists.
 * Sampling the actual files instead means the worst case is always the one
 * under test, and stays that way as the photography is replaced.
 */
async function palestSlide(): Promise<{ slug: string; index: number }> {
  let worst = { slug: PROJECTS_IN_ORDER[1].slug, index: 1, mean: -1 };
  for (const project of PROJECTS_IN_ORDER) {
    for (const [i, item] of project.gallery.entries()) {
      const file = path.join(process.cwd(), 'public', mediaPoster(item).src);
      const { data, info } = await sharp(file)
        .resize({ width: 64 })
        .raw()
        .toBuffer({ resolveWithObject: true });
      let sum = 0;
      let count = 0;
      for (let px = 0; px < data.length; px += info.channels) {
        sum += 0.2126 * data[px] + 0.7152 * data[px + 1] + 0.0722 * data[px + 2];
        count += 1;
      }
      const mean = sum / count;
      if (mean > worst.mean) worst = { slug: project.slug, index: i + 1, mean };
    }
  }
  return { slug: worst.slug, index: worst.index };
}

async function views(): Promise<View[]> {
  const portrait = PROJECTS_IN_ORDER[0].slug;
  const landscape = PROJECTS_IN_ORDER[1].slug;
  const list: View[] = [
    { name: 'collection · first card', path: '/', cardIndex: 0 },
    { name: 'collection · mid list', path: '/', cardIndex: 5 },
    { name: 'collection · craft card', path: '/', cardIndex: PROJECTS_IN_ORDER.length },
  ];
  for (const [label, slug] of [
    ['project · portrait hero', portrait],
    ['project · landscape hero', landscape],
  ] as const) {
    ['hero', 'narrative', 'gallery', 'facts'].forEach((beat, i) =>
      list.push({ name: `${label} · ${beat}`, path: `/projects/${slug}`, section: i }),
    );
  }
  CRAFT_STAGES.forEach((stage, i) =>
    list.push({ name: `craft · ${stage.id}`, path: '/craft', section: i }),
  );
  list.push({ name: 'craft · cities', path: '/craft', section: CRAFT_STAGES.length });
  list.push({ name: 'craft · collaborations', path: '/craft', section: CRAFT_STAGES.length + 1 });
  list.push({ name: 'studio', path: '/studio' });
  list.push({ name: 'contact', path: '/contact' });
  list.push({
    name: 'contact · form, text keys',
    path: '/contact',
    prepare: (page) => tap(page, /details|dados/i),
  });
  list.push({
    name: 'contact · form, email keys',
    path: '/contact',
    prepare: async (page) => {
      await tap(page, /details|dados/i);
      await tap(page, /^(Next|Seguinte)$/);
    },
  });
  list.push({
    name: 'full view',
    path: `/projects/${landscape}`,
    section: 2,
    // The first gallery slide, by its counter label — not the first tap target
    // on the page, which is the navigation bar.
    prepare: (page) => tap(page, undefined, '[data-tap-target][aria-label="1"]'),
  });
  const pale = await palestSlide();
  list.push({
    name: `full view · palest frame (${pale.slug} ${pale.index})`,
    path: `/projects/${pale.slug}`,
    section: 2,
    prepare: (page) => tap(page, undefined, `[data-tap-target][aria-label="${pale.index}"]`),
  });
  return list;
}

/**
 * Force the press rather than waiting for Playwright's actionability checks.
 * We are auditing where things land, not whether Playwright thinks a floating
 * bar is stable, and an unforced click times out against the attract loop's
 * dismissal blocker for no useful reason.
 */
async function tap(page: Page, text?: RegExp, selector = '[data-tap-target]') {
  const base = page.locator(selector);
  const target = text ? base.filter({ hasText: text }) : base;
  await target.first().click({ force: true, timeout: 8000 });
  await page.waitForTimeout(350);
}

type AuditResult = {
  violations: Array<{ rule: string; detail: string }>;
  /** Every string rendered on this view, for the cross-locale comparison. */
  texts: string[];
};

async function audit(page: Page): Promise<AuditResult> {
  return page.evaluate(
    ({ envelope, typeFloor, minTarget, cssWidth, chrome }) => {
      const found: Array<{ rule: string; detail: string }> = [];
      const texts: string[] = [];
      const height = window.innerHeight;
      const visible = (box: DOMRect) =>
        box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < height;

      document.querySelectorAll<HTMLElement>('[data-tap-target]').forEach((el) => {
        const box = el.getBoundingClientRect();
        if (!visible(box)) return;
        const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 40) || el.tagName;
        const top = (box.top / height) * 100;
        const bottom = (box.bottom / height) * 100;
        if (top < envelope.top - 0.5 || bottom > envelope.bottom + 0.5) {
          found.push({
            rule: 'reach envelope',
            detail: `"${label}" at ${top.toFixed(1)}%–${bottom.toFixed(1)}% (allowed ${envelope.top}–${envelope.bottom}%)`,
          });
        }
        if (Math.min(box.width, box.height) < minTarget - 0.5) {
          found.push({
            rule: 'touch target',
            detail: `"${label}" is ${Math.round(box.width)}×${Math.round(box.height)}, floor is ${minTarget}px`,
          });
        }
      });

      // Text: font size floor, and nothing painted under the opaque nav bar.
      const navTop = (chrome.barTop / 100) * height;
      const navBottom = ((chrome.barTop + chrome.barHeight) / 100) * height;
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const ownText = Array.from(el.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent?.trim() ?? '')
          .join('')
          .trim();
        if (!ownText) return;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return;
        const box = el.getBoundingClientRect();
        if (!visible(box)) return;

        texts.push(ownText);

        const size = parseFloat(style.fontSize);
        if (size < typeFloor - 0.01) {
          found.push({ rule: 'type floor', detail: `${size}px on "${ownText.slice(0, 40)}"` });
        }

        const insideChrome = el.closest('[data-chrome]') !== null;
        const overlay = el.closest('.fixed, [data-full-view]') !== null;
        if (!insideChrome && !overlay) {
          const overlap = Math.min(box.bottom, navBottom) - Math.max(box.top, navTop);
          if (overlap > 4) {
            found.push({
              rule: 'occluded by nav',
              detail: `"${ownText.slice(0, 40)}" overlaps the bar by ${Math.round(overlap)}px`,
            });
          }
        }
      });

      if (document.documentElement.scrollWidth > cssWidth + 1) {
        found.push({
          rule: 'horizontal overflow',
          detail: `${document.documentElement.scrollWidth}px in a ${cssWidth}px space`,
        });
      }

      const meta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? '';
      if (!meta.includes(`width=${cssWidth}`)) {
        found.push({ rule: 'viewport', detail: `expected width=${cssWidth}, got "${meta}"` });
      }

      return { violations: found, texts };
    },
    {
      envelope: ENVELOPE,
      typeFloor: TYPE_FLOOR,
      minTarget: PANEL.minTouchTarget,
      cssWidth: PHYSICAL.cssWidth,
      chrome: CHROME,
    },
  );
}

/**
 * A slide that is on screen but has nothing in it.
 *
 * The gallery rail unmounts distant slides to stay inside the decoded-bitmap
 * ceiling, which is right — but the mounted window and the number of slides
 * actually visible are two different quantities, and when the window is the
 * smaller of the two the visitor gets an empty box where a photograph should
 * be. It renders perfectly and passes every geometry check, so only a test
 * that opens the rail and looks inside each visible slot will catch it.
 */
async function blankSlides(page: Page): Promise<{ rule: string; detail: string }[]> {
  const empty = await page.evaluate(() => {
    /*
     * Gallery slides only. The collection's cards carry the same tap-target
     * attribute, and one of them — Craft — is imageless on purpose, so a
     * broader selector reports a design decision as a defect.
     *
     * And nothing at all while the full view is up. That overlay is opaque
     * and covers the rail completely, so a slide behind it is invisible
     * rather than empty — reporting it describes a viewport, not a visitor.
     */
    if (document.querySelector('[data-overlay="full-view"]')) return [];
    const slots = Array.from(document.querySelectorAll('[data-slide]'));
    return slots
      .filter((element) => {
        const box = element.getBoundingClientRect();
        const onScreen =
          box.x < window.innerWidth && box.x + box.width > 0 &&
          box.y < window.innerHeight && box.y + box.height > 0;
        if (!onScreen) return false;
        const image = element.querySelector('img');
        return !image || image.naturalWidth === 0;
      })
      .map((element) => element.getAttribute('data-slide') ?? '?');
  });
  return empty.length
    ? [
        {
          rule: 'blank slide',
          detail: `slide ${empty.join(', ')} is on screen with no image — the mounted window is narrower than what fits`,
        },
      ]
    : [];
}

/**
 * Light type laid on a photograph that happens to be pale.
 *
 * A caption at 45% white over a cream sofa measures about 1.3:1 — not a dim
 * label but an invisible one, and when it is the close button the visitor is
 * stuck until the idle timeout. It cannot be caught by reading the CSS,
 * because whether it fails depends on the photograph behind it, so this
 * samples what was actually painted underneath.
 */
async function lowContrastOnMedia(page: Page): Promise<{ rule: string; detail: string }[]> {
  const shot = await page.screenshot();
  const suspects = await page.evaluate(() => {
    const out: { text: string; x: number; y: number; w: number; h: number; alpha: number }[] = [];
    for (const element of Array.from(document.querySelectorAll('span, p, button'))) {
      const text = (element.textContent ?? '').trim();
      if (!text || text.length > 40) continue;
      const style = getComputedStyle(element);
      /*
       * Resolve the colour by painting it, rather than parsing it. Tailwind v4
       * emits `oklab(0.99 … / 0.7)`, and every generation of CSS adds another
       * colour syntax — a canvas converts whatever it is given to sRGB, so this
       * keeps working when the next one arrives.
       */
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext('2d');
      if (!context) continue;
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = style.color;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      const light = r > 180 && g > 180 && b > 180 && a > 60;
      if (!light) continue;
      const box = element.getBoundingClientRect();
      if (box.width < 20 || box.height < 10) continue;
      if (box.y < 0 || box.y > window.innerHeight) continue;
      out.push({ text, x: box.x, y: box.y, w: box.width, h: box.height, alpha: a / 255 });
    }
    return out;
  });
  if (suspects.length === 0) return [];

  const scale = PHYSICAL.nativeWidth / PHYSICAL.cssWidth;
  const image = sharp(shot);
  const meta = await image.metadata();
  const found: { rule: string; detail: string }[] = [];
  for (const s of suspects) {
    const left = Math.max(0, Math.round(s.x * scale));
    const top = Math.max(0, Math.round(s.y * scale));
    const width = Math.min(Math.round(s.w * scale), (meta.width ?? 0) - left);
    const height = Math.min(Math.round(s.h * scale), (meta.height ?? 0) - top);
    if (width < 4 || height < 4) continue;
    const raw = await sharp(shot).extract({ left, top, width, height }).raw().toBuffer();
    let sum = 0;
    let count = 0;
    for (let i = 0; i < raw.length; i += 3) {
      sum += 0.2126 * raw[i] + 0.7152 * raw[i + 1] + 0.0722 * raw[i + 2];
      count += 1;
    }
    const mean = sum / count;
    // The painted mean already includes the type itself, which is light and
    // lifts the average — so a region that still reads dark is safe, and only
    // a bright one is worth reporting.
    if (mean < 150) continue;
    found.push({
      rule: 'contrast on media',
      detail: `"${s.text}" sits on a background painting at luminance ${mean.toFixed(0)}/255 — light type there is close to invisible`,
    });
  }
  return found;
}

async function run(
  browser: Browser,
  base: string,
  view: View,
  locale: Locale,
): Promise<{ violations: Violation[]; texts: string[] }> {
  const context = await browser.newContext({
    viewport: { width: PHYSICAL.cssWidth, height: PHYSICAL.cssHeight },
    deviceScaleFactor: PHYSICAL.nativeWidth / PHYSICAL.cssWidth,
    hasTouch: true,
    isMobile: true,
  });
  /*
   * tsx compiles this file with esbuild's `keepNames`, which rewrites local
   * functions to call a `__name` helper. That helper does not exist inside the
   * page, so any function serialised into evaluate() throws on arrival. Define
   * it as raw source (a string init script is not compiled) and the audit runs
   * as written.
   */
  await context.addInitScript({ content: 'globalThis.__name = globalThis.__name || ((fn) => fn);' });
  await context.addInitScript((value) => {
    window.localStorage.setItem('viterbo.locale', value);
  }, locale);

  const page = await context.newPage();
  try {
    await page.goto(base + view.path, { waitUntil: 'networkidle' });
    // The attract loop owns the first touch; take it the way a visitor does.
    await page.mouse.click(PHYSICAL.cssWidth / 2, PHYSICAL.cssHeight * 0.2);
    await page.waitForTimeout(500);

    if (view.section !== undefined || view.cardIndex !== undefined) {
      await page.evaluate(
        ({ section, cardIndex, stride, pad }) => {
          const root = document.querySelector('[data-scroll-root]');
          if (!root) return;
          const top =
            cardIndex !== undefined
              ? (cardIndex * stride * window.innerHeight) / 100
              : (section ?? 0) * window.innerHeight;
          root.scrollTo({ top: top + (cardIndex !== undefined ? 0 : 0) * pad, behavior: 'instant' as ScrollBehavior });
        },
        {
          section: view.section,
          cardIndex: view.cardIndex,
          stride: COLLECTION.cardStride,
          pad: COLLECTION.cardTop,
        },
      );
      await page.waitForTimeout(500);
    }

    if (view.prepare) await view.prepare(page);
    await page.waitForTimeout(300);

    const result = await audit(page);
    const blanks = await blankSlides(page);
    const faint = await lowContrastOnMedia(page);
    return {
      violations: [...result.violations, ...blanks, ...faint].map((item) => ({
        view: view.name,
        locale,
        ...item,
      })),
      texts: result.texts,
    };
  } catch (error) {
    return {
      violations: [
        { view: view.name, locale, rule: 'crashed', detail: String(error).slice(0, 200) },
      ],
      texts: [],
    };
  } finally {
    await context.close();
  }
}

async function waitForServer(base: string, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(base, { method: 'HEAD' });
      if (response.ok || response.status === 405) return;
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Server never came up at ${base}`);
}

async function main() {
  const external = process.env.BASE_URL;
  const port = Number(process.env.PORT ?? 3400);
  const base = external ?? `http://localhost:${port}`;

  let server: ChildProcess | undefined;
  if (!external) {
    server = spawn('npx', ['next', 'start', '-p', String(port)], { stdio: 'ignore' });
  }

  const browser = await chromium.launch({ executablePath: EXECUTABLE });
  const violations: Violation[] = [];

  /*
   * Geometry is not the only way to ship a broken kiosk. Contact is the one
   * screen a visitor acts on, and placeholder details there fail silently —
   * the layout is perfect and the number does not ring. So the run fails while
   * the studio has not confirmed them.
   */
  if (!CONTACT.verified) {
    violations.push({
      view: 'contact',
      locale: 'en',
      rule: 'unverified content',
      detail:
        'CONTACT.verified is false. Address, phone, email and the Instagram handle now ' +
        'carry the studio\'s published details, but two things are still open: primaryUrl ' +
        'points at a /showroom landing page that does not exist yet, and the screen shows ' +
        'the Cascais studio address while the panel stands in the Estoril shop. Settle both, ' +
        'confirm the fields, then set it true.',
    });
  }

  try {
    await waitForServer(base);
    process.stdout.write(
      `Verifying against ${base} at ${PHYSICAL.cssWidth}×${PHYSICAL.cssHeight} CSS ` +
        `(${PHYSICAL.nativeWidth}×${PHYSICAL.nativeHeight} physical, ${PANEL.touchType}, ` +
        `${PANEL.minTouchTarget}px targets, prime ${PRIME.top}–${PRIME.bottom}%)\n\n`,
    );
    const allowed = identicalByDesign();
    for (const view of await views()) {
      const rendered = new Map<Locale, string[]>();
      let breaches = 0;
      for (const locale of LOCALES) {
        const result = await run(browser, base, view, locale);
        violations.push(...result.violations);
        breaches += result.violations.length;
        rendered.set(locale, result.texts);
      }

      /*
       * Anything rendered identically in both languages that the content model
       * does not say is meant to be identical is a string that never went
       * through the locale layer. This is what catches a hardcoded English
       * label — the one failure mode a screenshot in a single language can
       * never show you.
       */
      const pt = new Set(rendered.get('pt') ?? []);
      const untranslated = new Set<string>();
      (rendered.get('en') ?? []).forEach((text) => {
        if (!pt.has(text)) return;
        const parts = text.split('·').map((part) => part.trim()).filter(Boolean);
        parts.forEach((part) => {
          if (!languageless(part) && !allowed.has(part)) untranslated.add(part);
        });
      });
      untranslated.forEach((text) => {
        violations.push({
          view: view.name,
          locale: 'pt',
          rule: 'untranslated',
          detail: `"${text}" renders identically in both languages`,
        });
        breaches += 1;
      });

      process.stdout.write(
        `  ${breaches === 0 ? '·' : '✗'} ${view.name}${breaches ? ` — ${breaches}` : ''}\n`,
      );
    }
  } finally {
    await browser.close();
    server?.kill();
  }

  if (violations.length === 0) {
    process.stdout.write('\nAll screens inside the panel geometry.\n');
    process.exit(0);
  }

  process.stdout.write(`\n${violations.length} violation(s):\n\n`);
  const byRule = new Map<string, Violation[]>();
  violations.forEach((v) => byRule.set(v.rule, [...(byRule.get(v.rule) ?? []), v]));
  for (const [rule, items] of byRule) {
    process.stdout.write(`${rule} (${items.length})\n`);
    items.forEach((item) => process.stdout.write(`  ${item.view} [${item.locale}]: ${item.detail}\n`));
    process.stdout.write('\n');
  }
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
