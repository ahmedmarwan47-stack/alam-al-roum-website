"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { BLOCK_FROM, BLOCK_TO } from "@/components/reveal/letters";
import { story as S } from "@/lib/about/b-content";

const FW = 1512, FH = 1024;                 // the motion-study frame
const fy = (y: number) => `${(y / FH) * 100}%`;
/** The three Culture photos: % of the frame up to 1512 × 1024; on a larger screen, Figma's pixels in a 1512 × 1024
 * box centred on the screen, so they keep to the content edges (60 px in from that box) and to their Figma spacing
 * instead of drifting out towards the screen's edges and apart. */
const fx = (x: number) => `calc(max(0px, (100% - ${FW}px) / 2) + min(${(x / FW) * 100}%, ${x}px))`;
const fyBox = (y: number) => `calc(max(0px, (100% - ${FH}px) / 2) + min(${(y / FH) * 100}%, ${y}px))`;
const fw = (w: number) => `min(${(w / FW) * 100}%, ${w}px)`;
/**
 * The two domes are clip-path circles driven by two CSS variables: --t is the dome's top edge (% of the
 * stage height), --r its radius. Figma: a 2400 circle rises from y 1100 to 560, then grows to 4400 at
 * y −1700 and covers the frame. Radii are in vmax so a portrait phone is still fully covered.
 * As in the ERA Residence reference, the dome is born as a small arc at the bottom centre and widens as it rises
 * (its radius grows from 14 to 79 vmax on the way up), rather than a full-size circle sliding in.
 */
const DOME = { below: { "--t": fy(1060), "--r": "14vmax" }, risen: { "--t": fy(560), "--r": "79.37vmax" }, cover: { "--t": fy(-1700), "--r": "145.5vmax" } };
const domeStyle = { ...DOME.below, clipPath: "circle(var(--r) at 50% calc(var(--t) + var(--r)))" } as React.CSSProperties;
/** Each state change in the Figma prototype: Smart Animate 1.2 s on the slideWipe curve. */
// each move overlaps the next a little (STEP < MOVE) and runs linear with the scroll; HOLD is a reading rest
// (timeline seconds ≈ viewports of scroll) on the two states that carry copy
const STEP = 1.0, MOVE = 1.2, HOLD = 0.6;

/** Offset of `el` inside `stop`, ignoring transforms (offsetLeft/Top chain). */
const off = (el: HTMLElement, stop: HTMLElement) => {
  let x = 0, y = 0, n: HTMLElement | null = el;
  while (n && n !== stop) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y };
};

/**
 * The Story, after the Figma component set "Motion Study · The Story (dome + scattered words)" (10673:8318):
 * one pinned stage, one scroll-scrubbed timeline.
 *  1 History — the shoreline photo with "This Shoreline Guided Sailors Home".
 *  2 Culture Rises — a Limestone dome rises from below carrying the word "Architecture"; the history copy dims.
 *  3 Culture — the dome swells over the frame; as it settles, the headline and then the paragraph blur in, each as
 *    one block (the site's text entrance), and the three photos rise a little into place. The Figma study's scattered
 *    words, flying in from every side before gathering, were dropped (28 Oct review: too much movement), and with
 *    them one viewport of the pin.
 *  4 Greatness Rises — a second dome, cut from the Greatness photo, rises with the word "The Sea".
 *  5 Greatness — it covers the frame, the word settles above "Greatness Is What Remains" and the body.
 * Replaces the static About frames "The Story · Culture" and "The Story · About greatness".
 */
export default function TheStory() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = stage.current!;
    const $ = <T extends Element = HTMLElement>(s: string) => st.querySelector<T & HTMLElement>(s)!;
    const $$ = (s: string) => gsap.utils.toArray<HTMLElement>(s, st);
    const photos = $$("[data-photo]");
    const rm = reducedMotion(), D = rm ? 0.001 : MOVE, ease = "none";
    const H = () => st.clientHeight;
    // the Greatness word flies from the dome to its place above the headline (a measured FLIP)
    const gw = $("[data-g-word]"), slot = $("[data-g-slot]");
    // each dome's word blurs in as one block while its dome rises (opacity and blur only: its position is the dome's)
    const WORD_FROM = { opacity: 0, filter: "blur(12px)" }, WORD_TO = { opacity: 1, filter: "blur(0px)" };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: D, ease } });
      // state 1, set inside the timeline so a resize (invalidateOnRefresh) re-measures from a clean start
      tl.set([$("[data-dome=culture]"), $("[data-dome=greatness]")], DOME.below, 0)
        .set($("[data-c-word]"), { top: fy(1180) }, 0)
        .set($("[data-h-text]"), { y: 0, autoAlpha: 1 }, 0)
        .set([$("[data-c-head]"), $("[data-c-body]")], BLOCK_FROM, 0)
        .set(photos, { y: 60, autoAlpha: 0 }, 0)
        .set(gw, { top: fy(1180), xPercent: -50, x: 0, y: 0 }, 0)
        .set($$("[data-g-text]"), { y: () => H() * 0.4, autoAlpha: 0 }, 0)
        .set($("[data-g-dim]"), { autoAlpha: 0 }, 0);
      let t = 0;
      // 1 → 2 · Culture rises
      tl.to($("[data-dome=culture]"), DOME.risen, t)
        .to($("[data-c-word]"), { top: fy(640) }, t)
        .fromTo($("[data-c-word]"), WORD_FROM, { ...WORD_TO, duration: D * 0.5 }, t + D * 0.3)
        .to($("[data-h-text]"), { y: -60, autoAlpha: 0.4 }, t);
      // 2 → 3 · Culture covers and its word rises to the top; once the word has cleared the middle of the frame, the
      // headline and then the paragraph blur in (one block each, the site's text entrance) and the photos rise into place
      t += STEP;
      const IN = rm ? 0 : 0.55, BLOCK = rm ? 0.001 : 0.8;
      tl.to($("[data-dome=culture]"), DOME.cover, t)
        .to($("[data-c-word]"), { top: fy(210), duration: D * 0.7 }, t)
        .to($("[data-h-text]"), { y: -80, autoAlpha: 0 }, t)
        .to($("[data-c-head]"), { ...BLOCK_TO, duration: BLOCK }, t + IN)
        .to($("[data-c-body]"), { ...BLOCK_TO, duration: BLOCK }, t + IN + (rm ? 0 : 0.15))
        // (spread over 0.16 s in all: the tablet row repeats the three photos, so a per-photo stagger would lengthen the pin)
        .to(photos, { y: 0, autoAlpha: 1, duration: BLOCK, stagger: { amount: rm ? 0 : 0.16 } }, t + IN);
      // reading hold: the headline, paragraph and photos rest, fully in place, before Greatness rises
      t = tl.duration() + (rm ? 0 : HOLD);
      // 3 → 4 · Greatness rises
      tl.to($("[data-dome=greatness]"), DOME.risen, t)
        .to(gw, { top: fy(640) }, t)
        .fromTo(gw, WORD_FROM, { ...WORD_TO, duration: D * 0.5 }, t + D * 0.3);
      // 4 → 5 · Greatness covers; the word settles over the headline
      t += STEP;
      tl.to($("[data-dome=greatness]"), DOME.cover, t)
        .to($("[data-g-dim]"), { autoAlpha: 1 }, t)
        .to(gw, { x: () => off(slot, st).x - off(gw, st).x + gw.offsetWidth / 2, y: () => off(slot, st).y - off(gw, st).y }, t)
        .to($$("[data-g-text]"), { y: 0, autoAlpha: 1, stagger: rm ? 0 : 0.08 }, t + (rm ? 0 : 0.1))
        .to({}, { duration: rm ? 0.15 : HOLD }, t + D);     // reading hold on the closing copy before the pin releases

      // about one viewport of scroll per timeline second; below lg 60 % of that (~3.5 screens rather than 5.9), so a phone
      // is not held long on one section
      const per = () => (window.matchMedia("(min-width: 1024px)").matches ? 1 : 0.6);
      ScrollTrigger.create({ trigger: st, start: "top top", end: () => `+=${H() * tl.duration() * per()}`, pin: true, scrub: rm ? true : 1,
        animation: tl, invalidateOnRefresh: true });
    }, st);
    return () => ctx.revert();
  }, []);

  const C = S.culture, G = S.greatness;
  return (
    <section aria-label="The Story" className="bg-limestone-500">
      <div ref={stage} className="relative h-svh w-full overflow-hidden bg-limestone-500 lg:h-screen">
        {/* 1 · History */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={S.history.photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deepsea-950/60" />
        <div data-h-text className="absolute bottom-20 left-[var(--gutter)] right-[var(--gutter)] flex flex-col gap-4 text-limestone-50">
          <span className="t-label l-14">{S.history.label}</span>
          <h2 className="flex flex-col">
            <span className="t-heading hd-56 normal-case!">{S.history.line}</span>
            <span className="t-accent hd-56 leading-[1.071]!">{S.history.accent}</span>
          </h2>
        </div>

        {/* 2–4 · Culture: the Limestone dome, its word, the three photos and the gathered headline */}
        <div data-dome="culture" className="absolute inset-0 bg-limestone-500" style={domeStyle} />
        <span data-c-word data-no-blur className="absolute left-1/2 -translate-x-1/2 t-accent hd-56 text-deepsea-500" style={{ top: fy(1180) }}>{C.word}</span>
        {C.photos.map((p) => (
          <div key={p.src} data-photo className="absolute hidden overflow-hidden lg:block"
            style={{ left: fx(p.x), top: fyBox(p.y), width: fw(p.w), aspectRatio: `${p.w} / ${p.h}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
          </div>))}
        <div className="absolute inset-x-0 flex flex-col items-center gap-14 px-[var(--gutter)] text-center text-deepsea-500" style={{ top: fy(360) }}>
          <h3 data-c-head className="t-heading hd-56 normal-case! leading-[1.25]!">
            {C.lines.map((line) => <span key={line} className="block">{line}</span>)}
          </h3>
          <p data-c-body className="max-w-[560px] t-body b-18">{C.body}</p>
          {/* tablets: the three photos as a row under the paragraph (at Figma's scattered spots they crowd the headline
              on a portrait screen); phones and short screens leave them out */}
          <div className="hidden w-full max-w-[560px] grid-cols-3 gap-4 [@media(min-width:768px)_and_(max-width:1023.98px)_and_(min-height:800px)]:grid">
            {C.photos.map((p) => (
              <div key={p.src} data-photo className="aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>))}
          </div>
        </div>

        {/* 5–6 · Greatness: a dome cut from the photo, the word, then the headline and body */}
        <div data-dome="greatness" className="absolute inset-0" style={domeStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={G.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div data-g-dim className="absolute inset-0 bg-gradient-to-b from-deepsea-950/15 to-deepsea-950/70" />
        </div>
        <span data-g-word data-no-blur className="absolute left-1/2 t-accent hd-56 text-limestone-50" style={{ top: fy(1180) }}>{G.word}</span>
        <div className="absolute left-[var(--gutter)] right-[var(--gutter)] flex flex-col text-limestone-50" style={{ top: fy(430) }}>
          <span data-g-slot aria-hidden className="invisible self-start t-accent hd-56">{G.word}</span>
          <h2 className="mt-[30px] flex flex-col">
            <span data-g-text className="t-heading hd-80 normal-case!">{G.line}</span>
            {G.accent && <span data-g-text className="t-accent hd-56">{G.accent}</span>}
          </h2>
          <p data-g-text className="mt-8 max-w-[520px] t-body b-18">{G.body}</p>
        </div>
      </div>
    </section>
  );
}
