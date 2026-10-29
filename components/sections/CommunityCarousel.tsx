"use client";
import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { reducedMotion } from "@/lib/gsap";
import type { communities } from "@/lib/communities";

type Community = (typeof communities)[number];

/**
 * More communities (single community page, 29 Oct review): one row of equal 4:5 cards on a native scroll track in
 * place of the staggered grid, so a phone swipes it and each card snaps to the left gutter. The title sits left with
 * prev / next (44 px round controls, as on the gallery carousel) on the right; "View All Communities" closes it.
 */
export default function CommunityCarousel({ items }: { items: Community[] }) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId(), n = items.length;
  const [i, setI] = useState(0), [end, setEnd] = useState(false);
  const slides = () => [...(track.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? [])];
  const pad = () => parseFloat(getComputedStyle(track.current!).scrollPaddingLeft) || 0;
  // the card nearest the gutter is the current one; at the end of the track "next" has nowhere to go
  const sync = useCallback(() => {
    const t = track.current; if (!t) return;
    const p = pad(), x = t.scrollLeft;
    let best = 0, d = Infinity;
    slides().forEach((s, k) => { const e = Math.abs(s.offsetLeft - p - x); if (e < d) { d = e; best = k; } });
    setI(best); setEnd(x + t.clientWidth >= t.scrollWidth - 2);
  }, []);
  const go = (k: number) => {
    const t = track.current, s = slides()[Math.max(0, Math.min(n - 1, k))]; if (!t || !s) return;
    t.scrollTo({ left: s.offsetLeft - pad(), behavior: reducedMotion() ? "auto" : "smooth" });
  };
  const btn = "grid h-11 w-11 place-items-center rounded-full border border-deepsea-500/30 text-deepsea-500 transition-[background-color,color,opacity] duration-300 hover:bg-deepsea-500 hover:text-limestone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deepsea-500 disabled:pointer-events-none disabled:opacity-30";
  return (
    <section className="flex flex-col gap-10 overflow-hidden bg-white py-20 lg:gap-12">
      <div className="flex items-end justify-between gap-6 container-x">
        <div className="flex flex-col gap-4">
          <RevealText text="Communities" className="t-label l-16" />
          <RevealText as="h2" text="More communities" className="t-heading hd-48" delay={0.05} />
          <RevealText text="Each district has its own character. All share the sea." className="t-body b-18 text-limestone-800" delay={0.1} />
        </div>
        <div className="flex flex-none gap-[14px] max-sm:hidden">
          <button type="button" aria-label="Previous community" aria-controls={id} onClick={() => go(i - 1)} disabled={i === 0} className={btn}><Icon name="arrow-left-01-sharp" /></button>
          <button type="button" aria-label="Next community" aria-controls={id} onClick={() => go(i + 1)} disabled={end} className={btn}><Icon name="arrow-right-01-sharp" /></button>
        </div>
      </div>
      <div id={id} ref={track} role="region" aria-roledescription="carousel" aria-label={`More communities, ${n} cards`} onScroll={sync}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-[var(--gutter)] px-[var(--gutter)] [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden">
        {items.map((c, k) => (
          <Link key={c.slug} href={`/communities/${c.slug}`} data-slide
            className="group flex w-[72vw] flex-none snap-start flex-col gap-3 sm:w-[42vw] lg:w-[calc((min(100vw,1512px)-2*60px-2*24px)/3.25)]">
            <div className="aspect-[4/5] overflow-hidden">
              <RevealImage src={c.photo} alt={c.name} delay={Math.min(k, 3) * 0.08} className="h-full w-full"
                imgClassName="transition-transform duration-[1.2s] [transition-timing-function:var(--ease-site)] group-hover:scale-[1.05]" />
            </div>
            <span className="t-heading hd-24 pt-1 text-deepsea-500">{c.name}</span>
            <span className="t-body b-14 text-limestone-800">{c.body}</span>
          </Link>))}
        {/* lets the track end on the right gutter, not the screen edge */}
        <div aria-hidden className="w-px flex-none" />
      </div>
      <div className="flex justify-center container-x"><Button label="View All Communities" href="/communities" variant="outline" /></div>
    </section>
  );
}
