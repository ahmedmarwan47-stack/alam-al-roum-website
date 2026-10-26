import Link from "next/link";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";

const zoom = "transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-105";

/**
 * Story card (Figma Home "Latest News", the Media Center listing): the photo, a Deep Sea bar with `tag | meta`
 * (Label/14, Limestone), then the title (Text/20, Text/28 for Home's lead story). Used on Home, the Media Center
 * and an article's Keep Reading row. `ratio` is the photo's Tailwind aspect class.
 */
export function StoryCard({ tag, meta, title, photo, href, big = false, delay = 0, ratio = "aspect-[405/270]" }:
  { tag: string; meta: string; title: string; photo: string; href: string; big?: boolean; delay?: number; ratio?: string }) {
  return (
    <Link href={href} className="group flex flex-col">
      <RevealImage src={photo} delay={delay} className={`${ratio} w-full`} imgClassName={zoom} />
      <span className="flex items-center gap-2 bg-deepsea-500 px-3 py-2 t-label l-14 text-limestone-50"><span>{tag}</span><i className="h-3 w-px bg-limestone-50/40" /><span>{meta}</span></span>
      <RevealText text={title} className={`pt-4 t-text ${big ? "x-28" : "x-20"}`} delay={delay + 0.1} />
    </Link>
  );
}

/**
 * Event card (Figma Home "Upcoming Events", the Events listing): the photo (336 × 376), `category | date`
 * (Label/14) and the title (Text/20). `dark` is for the Deep Sea band on Home; the listing page is light.
 */
export function EventCard({ tag, meta, title, photo, href, delay = 0, dark = false }:
  { tag: string; meta: string; title: string; photo: string; href: string; delay?: number; dark?: boolean }) {
  return (
    <Link href={href} className={`group flex flex-col gap-4 ${dark ? "text-limestone-50" : "text-deepsea-500"}`}>
      <RevealImage src={photo} delay={delay} className="aspect-[336/376] w-full" imgClassName={zoom} />
      <span className={`flex items-center gap-3 t-label l-14 ${dark ? "text-limestone-50/70" : "text-deepsea-500/70"}`}>
        <span>{tag}</span><i className={`h-3 w-px ${dark ? "bg-limestone-50/30" : "bg-deepsea-500/30"}`} /><span>{meta}</span>
      </span>
      <RevealText text={title} className="t-text x-20" delay={0.1 + delay} />
    </Link>
  );
}
