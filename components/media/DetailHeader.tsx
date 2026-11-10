import RevealText from "@/components/reveal/RevealText";
import ShareRow from "./ShareRow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Icon from "@/components/ui/Icon";

/**
 * Story and event header (Figma "Article Detail" header 10921:10139), one structure for every article and event:
 * `back` (the way back to the list, "← Media Center / title"), the title, a two-line standfirst, then the tag row
 * and Share via. The tags sit under the copy since the breadcrumb took the top line (10 Nov review). No byline or
 * date block.
 * The tag row holds two of the three kinds of tag, each led by its icon from the Figma icon library (Huge icons,
 * 10261:675): a story's category (tag-01) or an event's venue (location-01), then the date (calendar-03). `kind`
 * says which the first one is.
 */
export default function DetailHeader({ tag, date, title, sub, back, kind = "story" }:
  { tag: string; date: string; title: string; sub: string; back?: { label: string; href: string }; kind?: "story" | "event" }) {
  return (
    <header className="mx-auto mt-[76px] flex max-w-[768px] flex-col items-center gap-6 px-[var(--gutter)] pt-[60px] pb-10 text-center lg:px-0">
      {back && <Breadcrumb parent={back.label} href={back.href} current={title} />}
      <RevealText as="h1" text={title} onLoad delay={0.15} className="t-heading hd-48 text-deepsea-500" />
      {sub && <RevealText text={sub} onLoad delay={0.3} className="t-body b-18 text-limestone-800" />}
      <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 t-label l-14 text-black/70">
        <span className="flex items-center gap-2"><Icon name={kind === "event" ? "location-01" : "tag-01"} size={16} />{tag}</span>
        <i className="h-[14px] w-px bg-black/30" />
        <span className="flex items-center gap-2"><Icon name="calendar-03" size={16} />{date}</span>
      </span>
      <div className="pt-2"><ShareRow title={title} /></div>
    </header>
  );
}
