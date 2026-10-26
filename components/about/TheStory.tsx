"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { story as S } from "@/lib/about/b-content";

const FW = 1512, FH = 1024;                 // the motion-study frame
const fy = (y: number) => `${(y / FH) * 100}%`;
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
// continuous scroll: each move overlaps the next a little (STEP < MOVE) and runs linear with the scroll — no holds
const STEP = 1.0, MOVE = 1.2;

/** Offset of `el` inside `stop`, ignoring transforms (offsetLeft/Top chain). */
const off = (el: HTMLElement, stop: HTMLElement) => {
  let x = 0, y = 0, n: HTMLElement | null = el;
  while (n && n !== stop) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y };
};

/**
 * The Story, after the Figma component set "Motion Study · The Story (dome + scattered words)" (10673:8318):
 * one pinned stage, one scroll-scrubbed timeline through its six states.
 *  1 History — the shoreline photo with "This Shoreline Guided Sailors Home".
 *  2 Culture Rises — a Limestone dome rises from below carrying the word "Culture"; the history copy dims.
 *  3 Culture Covers — the dome swells over the frame; six words float in, scattered, at 35 %.
 *  4 Culture — the words gather into the headline, the paragraph and three culture photos rise in.
 *  5 Greatness Rises — a second dome, cut from the Greatness photo, rises with the word "Greatness".
 *  6 Greatness — it covers the frame, the word settles above "Greatness Is What Remains" and the body.
 * Replaces the static About frames "The Story · Culture" and "The Story · About greatness".
 */
export default function TheStory() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = stage.current!;
    const $ = <T extends Element = HTMLElement>(s: string) => st.querySelector<T & HTMLElement>(s)!;
    const $$ = (s: string) => gsap.utils.toArray<HTMLElement>(s, st);
    const words = $$("[data-word]"), photos = $$("[data-photo]");
    const rm = reducedMotion(), D = rm ? 0.001 : MOVE, ease = "none";
    const W = () => st.clientWidth, H = () => st.clientHeight;
    // where each headline word floats in state 3, relative to its resting place in the headline
    const dx = (el?: HTMLElement) => (el?.dataset?.x ? (+el.dataset.x / FW) * W() - off(el, st).x : 0);
    const dy = (el?: HTMLElement) => (el?.dataset?.y ? (+el.dataset.y / FH) * H() - off(el, st).y : 0);
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
        .set(words, { x: (_, el) => dx(el), y: (_, el) => dy(el) + (1100 / FH) * H(), autoAlpha: 0 }, 0)
        .set(photos, { y: 120, autoAlpha: 0 }, 0)
        .set($("[data-c-body]"), { y: 60, autoAlpha: 0 }, 0)
        .set(gw, { top: fy(1180), xPercent: -50, x: 0, y: 0 }, 0)
        .set($$("[data-g-text]"), { y: () => H() * 0.4, autoAlpha: 0 }, 0)
        .set($("[data-g-dim]"), { autoAlpha: 0 }, 0);
      let t = 0;
      // 1 → 2 · Culture rises
      tl.to($("[data-dome=culture]"), DOME.risen, t)
        .to($("[data-c-word]"), { top: fy(640) }, t)
        .fromTo($("[data-c-word]"), WORD_FROM, { ...WORD_TO, duration: D * 0.5 }, t + D * 0.3)
        .to($("[data-h-text]"), { y: -60, autoAlpha: 0.4 }, t);
      // 2 → 3 · Culture covers, the words float in
      t += STEP;
      tl.to($("[data-dome=culture]"), DOME.cover, t)
        .to($("[data-c-word]"), { top: fy(210) }, t)
        .to($("[data-h-text]"), { y: -80, autoAlpha: 0 }, t)
        .to(words, { y: (_, el) => dy(el), autoAlpha: 0.35, stagger: rm ? 0 : 0.04 }, t);
      // 3 → 4 · the words gather into the headline; paragraph and photos rise
      t += STEP;
      tl.to(words, { x: 0, y: 0, autoAlpha: 1 }, t)
        .to($("[data-c-body]"), { y: 0, autoAlpha: 1 }, t + (rm ? 0 : 0.15))
        .to(photos, { y: 0, autoAlpha: 1, stagger: rm ? 0 : 0.08 }, t);
      // 4 → 5 · Greatness rises
      t += STEP;
      tl.to($("[data-dome=greatness]"), DOME.risen, t)
        .to(gw, { top: fy(640) }, t)
        .fromTo(gw, WORD_FROM, { ...WORD_TO, duration: D * 0.5 }, t + D * 0.3);
      // 5 → 6 · Greatness covers; the word settles over the headline
      t += STEP;
      tl.to($("[data-dome=greatness]"), DOME.cover, t)
        .to($("[data-g-dim]"), { autoAlpha: 1 }, t)
        .to(gw, { x: () => off(slot, st).x - off(gw, st).x + gw.offsetWidth / 2, y: () => off(slot, st).y - off(gw, st).y }, t)
        .to($$("[data-g-text]"), { y: 0, autoAlpha: 1, stagger: rm ? 0 : 0.08 }, t + (rm ? 0 : 0.1))
        .to({}, { duration: 0.15 }, t + D);     // a breath before the pin releases

      ScrollTrigger.create({ trigger: st, start: "top top", end: () => `+=${H() * 5.5}`, pin: true, scrub: rm ? true : 1,
        animation: tl, invalidateOnRefresh: true });
    }, st);
    return () => ctx.revert();
  }, []);

  const C = S.culture, G = S.greatness;
  return (
    <section aria-label="The Story" className="bg-limestone-500">
      <div ref={stage} className="relative h-screen w-full overflow-hidden bg-limestone-500">
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
          <div key={p.src} data-photo className="absolute hidden overflow-hidden md:block"
            style={{ left: `${(p.x / FW) * 100}%`, top: fy(p.y), width: `${(p.w / FW) * 100}%`, aspectRatio: `${p.w} / ${p.h}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
          </div>))}
        <div className="absolute inset-x-0 flex flex-col items-center gap-14 px-[var(--gutter)] text-center text-deepsea-500" style={{ top: fy(360) }}>
          <h3 className="t-heading hd-56 normal-case! leading-[1.25]!">
            {C.lines.map((line, k) => (
              <span key={k} className="flex flex-wrap justify-center gap-x-[0.28em]">
                {line.map((w) => <span key={w.t} data-word data-x={w.x} data-y={w.y} className="relative inline-block">{w.t}</span>)}
              </span>))}
          </h3>
          <p data-c-body className="max-w-[560px] t-body b-18">{C.body}</p>
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
