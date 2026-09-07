'use client';

import { STUDIO } from '@/content/studio';
import { useLocale } from '@/lib/locale';

/**
 * Recognition (§8) — the studio's awards and press, in full.
 *
 * The Studio screen shows the marks alone, because a mark reads in a second
 * from three metres and that screen has ninety words to spend. This one is for
 * the visitor who has stopped, tapped, and wants to know what each mark was
 * actually for. So here the note is the point, and the mark is the label on it.
 *
 * Two pages, snap-scrolled, the same mechanism Craft uses: twenty-four entries
 * do not fit on one panel at a size anyone would read, and a free-scrolling
 * list on a kiosk has no resting state. Twelve to a page, six above the
 * navigation bar and six below it — the bar becomes the divider rather than
 * something the list has to dodge.
 */
const PER_BLOCK = 6;
const PER_PAGE = PER_BLOCK * 2;

type Award = (typeof STUDIO.awards)[number];
type Group = { mark: string; entries: Award[] };

/**
 * CNN recognised two hotels and Conde Nast recognised two more, so those marks
 * appear twice in the data. Printed straight down the page that reads as a
 * duplication bug rather than as two separate credits, so a mark is written
 * once and carries its notes under it.
 *
 * Consecutive only, deliberately: the order of this list is curated, and
 * gathering every occurrence of a mark globally would drag entries out of it.
 */
function group(awards: readonly Award[]): Group[] {
  const groups: Group[] = [];
  for (const award of awards) {
    const last = groups[groups.length - 1];
    if (last && last.mark === award.mark) last.entries.push(award);
    else groups.push({ mark: award.mark, entries: [award] });
  }
  return groups;
}

export function RecognitionView() {
  const { s, t } = useLocale();

  const groups = group(STUDIO.awards);
  const pages: Group[][] = [];
  for (let i = 0; i < groups.length; i += PER_PAGE) {
    pages.push(groups.slice(i, i + PER_PAGE));
  }

  return (
    <div
      data-scroll-root
      data-scroll-reset
      className="snap-y-page no-scrollbar h-full w-full overflow-y-auto"
    >
      {pages.map((page, index) => (
        <section key={index} className="snap-start-page relative h-full w-full">
          {/*
           * 5.5%, matching the Cities list in Craft: the highest a block can
           * start and still leave the top of the panel breathing, and the only
           * way six entries clear the bar at 45%.
           *
           * The gap below is 24px rather than 28px for the same reason. The
           * first page carries the CNN pair, which is a mark with two notes
           * under it and the tallest block in the set; at 28px it ran four
           * pixels into the bar. Measured, not guessed — see the fit check in
           * the commit that added this screen.
           */}
          <div className="absolute inset-x-0 px-14" style={{ top: '5.5%' }}>
            {index === 0 ? (
              <p className="mb-8 text-caption uppercase tracking-[0.2em] text-ink-faint">
                {t('awards')}
              </p>
            ) : (
              /*
               * The counter only appears from the second page. On the first it
               * would announce that there is more to read before the visitor
               * has read anything.
               */
              <p className="mb-8 text-caption tracking-[0.3em] text-ink-faint">
                {String(index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
              </p>
            )}
            <Entries items={page.slice(0, PER_BLOCK)} s={s} />
          </div>

          <div className="absolute inset-x-0 px-14" style={{ top: '57%' }}>
            <Entries items={page.slice(PER_BLOCK)} s={s} />
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Mark then note, not "mark — note" on one line: the longer notes run to a
 * second line at this measure, and a wrapped hanging indent under a dash is
 * harder to scan than a plain two-line entry.
 */
function Entries({
  items,
  s,
}: {
  items: Group[];
  s: (value: { en: string; pt: string }) => string;
}) {
  return (
    <ul className="flex flex-col gap-6">
      {items.map((entry) => (
        <li key={entry.entries[0].id}>
          <p className="text-body leading-[1.2] text-ink">{entry.mark}</p>
          {entry.entries.map((award) => (
            <p
              key={award.id}
              className="mt-1 max-w-[900px] text-meta leading-[1.3] text-ink-muted"
            >
              {s(award.note)}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
}
