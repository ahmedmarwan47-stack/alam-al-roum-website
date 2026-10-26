"use client";
import { useState } from "react";
import Link from "next/link";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { SegmentedToggle } from "./CommunitiesExplorer";
import type { ListCard } from "@/lib/listings";

/** One listing card: image (hover zoom), `tag | meta`, title. Shared by the listings and the article's Related Articles. */
export function ListCardItem({ c, k, aspect }: { c: ListCard; k: number; aspect: string }) {
  return (
    <Link href={c.href} className="group flex flex-col gap-4">
      <div className="overflow-hidden" style={{ aspectRatio: aspect }}>
        <RevealImage src={c.photo} alt={c.title} delay={(k % 3) * 0.08} className="h-full w-full"
          imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-105" />
      </div>
      <span className="flex flex-wrap items-center gap-3 t-label l-14 text-black/60"><span>{c.tag}</span><i className="h-[14px] w-px bg-black/30" /><span>{c.meta}</span></span>
      <RevealText text={c.title} className="t-text x-20 text-black" delay={0.08} />
    </Link>
  );
}

/**
 * Listing body (Events: Upcoming / Past, Media Center: Blog / News): the Segmented Toggle above a
 * three-column card grid; each card shows its image, `tag | meta` and the title.
 */
export default function TabbedGrid({ tabs, lists, aspect }: { tabs: readonly string[]; lists: ListCard[][]; aspect: string }) {
  const [t, setT] = useState(0);
  return (
    <section className="flex flex-col items-center gap-10 bg-white px-[var(--gutter)] py-[60px]">
      <SegmentedToggle options={tabs} value={t} onChange={setT} />
      <div className="grid w-full gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {lists[t].map((c, k) => (
          <ListCardItem key={`${t}-${c.title}`} c={c} k={k} aspect={aspect} />))}
      </div>
    </section>
  );
}
