"use client";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Icon from "@/components/ui/Icon";
import RevealImage from "@/components/reveal/RevealImage";
import RevealText from "@/components/reveal/RevealText";
import { reducedMotion } from "@/lib/gsap";
import type { Seg } from "@/components/reveal/RevealText";

/**
 * Gallery · Carousel, for the inside pages (single community, single experience); Home keeps the marquee wall.
 * One row of large photos on a native scroll track, so a phone swipes it (with momentum) and each photo snaps into
 * place at the left gutter. Prev / next step one photo (44 px round controls, as on the Experiences slider), the
 * arrow keys do the same while the track has focus (Home / End jump to the ends), and the counter reads the position
 * ("03 / 12", announced politely to screen readers). A spacer after the last photo lets every photo reach the gutter,
 * so the counter and the controls always agree with what is shown.
 */
export default function GalleryCarousel({ tag, title, photos }: { tag: string; title: Seg[]; photos: string[] }) {
  const track = useRef<HTMLDivElement>(null), spacer = useRef<HTMLDivElement>(null);
  const id = useId(), n = photos.length;
  const [i, setI] = useState(0);
  const cur = useRef(0);
  const slides = () => [...(track.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? [])];
  const pad = () => parseFloat(getComputedStyle(track.current!).scrollPaddingLeft) || 0;
  const gap = () => parseFloat(getComputedStyle(track.current!).columnGap) || 0;
  // the photo nearest the gutter is the current one
  const sync = useCallback(() => {
    const t = track.current; if (!t) return;
    const p = pad(), x = t.scrollLeft;
    let best = 0, d = Infinity;
    slides().forEach((s, k) => { const e = Math.abs(s.offsetLeft - p - x); if (e < d) { d = e; best = k; } });
    cur.current = best; setI(best);
  }, []);
  // the spacer: wide enough for the last photo to scroll to the gutter. The photos are sized from the screen height,
  // so a resize moves them: the current photo is put back at the gutter at once, and the counter keeps its place.
  const size = useCallback(() => {
    const t = track.current, sp = spacer.current, s = slides(); if (!t || !sp || !s.length) return;
    sp.style.width = `${Math.max(0, t.clientWidth - s[s.length - 1].offsetWidth - gap() - pad() * 2)}px`;
    t.scrollTo({ left: s[cur.current].offsetLeft - pad(), behavior: "instant" });
  }, []);
  useEffect(() => {
    size();
    const ro = new ResizeObserver(size); if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [size]);
  const go = (k: number) => {
    const t = track.current, s = slides()[Math.max(0, Math.min(n - 1, k))]; if (!t || !s) return;
    t.scrollTo({ left: s.offsetLeft - pad(), behavior: reducedMotion() ? "auto" : "smooth" });
  };
  const key = (e: KeyboardEvent) => {
    const to = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault(); go(to);
  };
  const btn = "grid h-11 w-11 place-items-center rounded-full border border-limestone-50/40 text-limestone-50 transition-[background-color,color,opacity] duration-300 hover:bg-limestone-50 hover:text-deepsea-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-limestone-50 disabled:pointer-events-none disabled:opacity-30";
  const pos = (k: number) => String(k).padStart(2, "0");
  return (
    <section className="flex flex-col gap-10 overflow-hidden bg-deepsea-600 py-20 text-limestone-50 lg:gap-12 lg:py-[120px]">
      <div className="flex flex-col gap-4 container-x">
        <RevealText text={tag} className="t-label l-16" />
        <RevealText as="h2" segs={title} className="t-heading hd-48" delay={0.1} />
      </div>
      <div id={id} ref={track} role="region" aria-roledescription="carousel" aria-label={`${title.map((s) => s.t).join(" ")}, ${n} photos`} tabIndex={0}
        onScroll={sync} onKeyDown={key}
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-[var(--gutter)] px-[var(--gutter)] outline-none [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-limestone-50 lg:gap-4 [&::-webkit-scrollbar]:hidden">
        {photos.map((src, k) => (
          <div key={src + k} data-slide role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`}
            className="aspect-[4/5] w-[84vw] flex-none snap-start snap-always overflow-hidden rounded sm:aspect-[3/2] sm:w-auto sm:h-[min(56svh,560px)] lg:h-[min(64svh,640px)]">
            <RevealImage src={src} delay={Math.min(k, 2) * 0.08} className="h-full w-full" />
          </div>))}
        <div ref={spacer} aria-hidden className="flex-none" />
      </div>
      <div className="flex items-center gap-6 container-x lg:gap-10">
        <p className="t-label l-14 tabular-nums" aria-live="polite" aria-atomic="true">
          <span className="sr-only">Photo </span>{pos(i + 1)}<span className="text-limestone-50/50"> / {pos(n)}</span></p>
        <div className="relative h-[2px] flex-1 overflow-hidden bg-limestone-50/20" aria-hidden>
          <span className="absolute inset-y-0 left-0 bg-limestone-50 transition-[width] duration-500 [transition-timing-function:var(--ease-site)]" style={{ width: `${((i + 1) / n) * 100}%` }} />
        </div>
        <div className="flex gap-[14px]">
          <button type="button" aria-label="Previous photo" aria-controls={id} onClick={() => go(i - 1)} disabled={i === 0} className={btn}><Icon name="arrow-left-01-sharp" /></button>
          <button type="button" aria-label="Next photo" aria-controls={id} onClick={() => go(i + 1)} disabled={i === n - 1} className={btn}><Icon name="arrow-right-01-sharp" /></button>
        </div>
      </div>
    </section>
  );
}
