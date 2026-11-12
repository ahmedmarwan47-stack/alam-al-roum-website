import Link from "next/link";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";

/** An event card shows the short date: no weekday and a two-digit year ("Wed 10 Feb 2027" → "10 Feb 27",
 *  "Aug 2026" → "Aug 26"); the event page keeps the full date */
export const cardDate = (d: string) => d.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+/, "").replace(/\b(?:19|20)(\d{2})$/, "$1");
/** The place / date row: one line; the place ends in "…" when the two don't fit side by side, the date never shrinks.
 *  (The card itself is min-w-0, or the unwrappable row would widen its grid column past the screen.) */
export const EVENT_PLACE = "min-w-0 truncate", EVENT_DATE = "flex-none whitespace-nowrap";
/** Event cards on phones: title 14 / 20, place and date 12 / 18 (two narrow columns; from md the desktop sizes) */
export const EVENT_META_SM = "max-md:text-[12px]! max-md:leading-[18px]!", EVENT_TITLE_SM = "max-md:text-[14px]! max-md:leading-5!";
/** ...and their spacing on phones: 12 px photo → place/date and 4 px place/date → title, so the two lines read as one
 *  caption under the photo. The card keeps the grid's 16 px row gap (a subgrid gap that differs from its parent's
 *  adds the difference back into the rows), and the lines are pulled up by 4 and 12 px instead. */
export const EVENT_META_GAP_SM = "max-md:-mt-1", EVENT_TITLE_GAP_SM = "max-md:-mt-3";

const zoom = "transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-105";

/**
 * Story card (Figma Home "Latest News", the Media Center listing): the photo, a Deep Sea bar with `tag | meta`
 * (Label/14, Limestone), then the title (Text/20, Text/28 for Home's lead story). Used on Home, the Media Center
 * and an article's Keep Reading row. `ratio` is the photo's Tailwind aspect class.
 *
 * Phones (below md), small cards only (the lead story keeps its size): title 14 / 20, bar label 12 / 16 (the bar 32 tall),
 * 12 px from the bar to the title, as the event cards.
 *
 * Both cards are three-row subgrids (photo, meta, title): side by side in a grid they share their rows, so photos,
 * meta bars and titles line up across a row even when one title wraps to more lines, as in Figma.
 */
export function StoryCard({ tag, meta, title, photo, href, big = false, delay = 0, ratio = "aspect-[405/270]" }:
  { tag: string; meta: string; title: string; photo: string; href: string; big?: boolean; delay?: number; ratio?: string }) {
  return (
    <Link href={href} className="group row-span-3 grid grid-rows-subgrid gap-y-0">
      <RevealImage src={photo} delay={delay} className={`${ratio} w-full`} imgClassName={zoom} />
      <span className={`flex items-center gap-2 bg-deepsea-500 px-3 py-2 t-label l-14 text-limestone-50 ${big ? "" : "max-md:text-[12px]! max-md:leading-4!"}`}><span>{tag}</span><i className="h-3 w-px bg-limestone-50/40" /><span>{meta}</span></span>
      <RevealText text={title} className={`self-start pt-4 t-text ${big ? "x-28" : `x-20 max-md:pt-3 ${EVENT_TITLE_SM}`}`} delay={delay + 0.1} />
    </Link>
  );
}

/**
 * Event card (Figma Home "Upcoming Events", the Events listing, More events): the photo (336 × 376), `location | date`
 * (Label/14; `tag` is the event's venue, as on its page) and the title (Text/20). `dark` is for the Deep Sea band on
 * Home; the listing page is light.
 */
export function EventCard({ tag, meta, title, photo, href, delay = 0, dark = false }:
  { tag: string; meta: string; title: string; photo: string; href: string; delay?: number; dark?: boolean }) {
  return (
    <Link href={href} className={`group row-span-3 grid min-w-0 grid-cols-1 grid-rows-subgrid gap-y-4 ${dark ? "text-limestone-50" : "text-deepsea-500"}`}>
      <RevealImage src={photo} delay={delay} className="aspect-[336/376] w-full" imgClassName={zoom} />
      <span className={`flex max-w-full items-center gap-3 self-start t-label l-14 ${EVENT_META_SM} ${EVENT_META_GAP_SM} ${dark ? "text-limestone-50/70" : "text-deepsea-500/70"}`}>
        <span className={EVENT_PLACE}>{tag}</span><i className={`h-3 w-px flex-none ${dark ? "bg-limestone-50/30" : "bg-deepsea-500/30"}`} /><span className={EVENT_DATE}>{cardDate(meta)}</span>
      </span>
      <RevealText text={title} className={`self-start t-text x-20 ${EVENT_TITLE_SM} ${EVENT_TITLE_GAP_SM}`} delay={0.1 + delay} />
    </Link>
  );
}
