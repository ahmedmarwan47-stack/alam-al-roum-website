"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import SectionTitle from "@/components/sections/SectionTitle";
import { milestones as M } from "@/lib/about/b-content";

/** Figma "UI / Milestone" (10979:18571…): 400 wide, 15 ticks 24 apart from x 24, ticks 56 at rest → 136 at the focus. */
const CARD = 400, TICKS = 15, TICK_X0 = 24, TICK_GAP = 25, LOW = 56, HIGH = 136;
/** Half-width of the tick wave (px) and the section's natural height in Figma (1076, minus nothing: it is scaled to fit). */
const SPREAD = 190, NATURAL_H = 1076, GUTTER = 60;

/** One milestone: the year, the tick rhythm, then (when it is the one in focus) its long line, description and photo. */
function Milestone({ i }: { i: number }) {
  const m = M.items[i];
  return (
    <div data-ms className="relative flex w-[400px] flex-none flex-col gap-10">
      {/* the line: 268 tall at rest, 632 when in focus (Figma) — drawn at 632 and scaled */}
      <span data-ms-line className="absolute left-0 top-0 h-[632px] w-px origin-top bg-deepsea-500" style={{ transform: `scaleY(${268 / 632})` }} />
      <div className="flex flex-col gap-2 pl-4">
        <span className="t-text d-56 leading-[1.07] text-deepsea-500">{m.year}</span>
        <span className="t-text x-16 text-limestone-800">{m.title}</span>
      </div>
      <div className="flex h-[136px] items-center gap-6 pl-6" aria-hidden>
        {Array.from({ length: TICKS }, (_, k) => <i key={k} data-ms-tick className="block h-[136px] w-px flex-none origin-center bg-deepsea-500" />)}
      </div>
      <div data-ms-detail className="flex flex-col gap-6 px-6 opacity-0">
        <p className="t-body b-16 text-limestone-800">{m.body}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.photo} alt={m.title} loading="lazy" className="aspect-[352/200] w-full rounded-lg object-cover" />
      </div>
    </div>);
}

/**
 * Milestones · phase one (Figma 10921:8293). The section is exactly one viewport: it pins, and its Figma layout
 * is scaled to fit the screen's height. It opens as in Figma, with 2025 at the left gutter, and the scroll moves
 * the rail left until 2030 sits in the centre; the milestones take the focus one at a time (snapping to each) —
 * the one in focus is fully shown with its long line, description and photo, and the others fade away. The ticks form one wave centred on the focus, computed from the scroll position itself
 * (not from per-frame layout reads), so it glides with the smoothed scroll.
 */
export default function Milestones() {
  const root = useRef<HTMLElement>(null), rail = useRef<HTMLDivElement>(null), frame = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fit = () => setZoom(Math.min(1, window.innerHeight / NATURAL_H));
    fit(); window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const el = root.current!, r = rail.current!, n = M.items.length;
    const cards = gsap.utils.toArray<HTMLElement>("[data-ms]", el);
    const ticks = cards.map((c) => gsap.utils.toArray<HTMLElement>("[data-ms-tick]", c));
    const state = { f: 0 };   // the milestone in focus, as a float 0 … n-1
    const paint = () => {
      const f = state.f, fx = f * CARD + CARD / 2;
      // the rail starts as in Figma (2025 at the 60 px gutter) and travels left until 2030 sits in the centre
      const W = frame.current!.clientWidth, x0 = GUTTER, x1 = W / 2 - ((n - 1) * CARD + CARD / 2);
      r.style.transform = `translate3d(${x0 + (x1 - x0) * (f / (n - 1))}px,0,0)`;
      cards.forEach((c, i) => {
        const near = Math.max(0, 1 - Math.abs(i - f));                 // 1 in focus → 0 one step away
        c.style.opacity = String(0.08 + 0.92 * near);
        const det = c.querySelector<HTMLElement>("[data-ms-detail]")!, line = c.querySelector<HTMLElement>("[data-ms-line]")!;
        const d = Math.max(0, 1 - Math.abs(i - f) * 2);                 // the detail only for the one in focus
        det.style.opacity = String(d); det.style.transform = `translateY(${(1 - d) * 24}px)`;
        line.style.transform = `scaleY(${(268 + (632 - 268) * d) / 632})`;
        ticks[i].forEach((t, k) => {
          const x = i * CARD + TICK_X0 + k * TICK_GAP, q = (x - fx) / SPREAD;
          t.style.transform = `scaleY(${(LOW + (HIGH - LOW) * Math.exp(-q * q)) / HIGH})`;
        });
      });
    };
    if (reducedMotion()) { paint(); return; }
    // each milestone rests in focus for a stretch of scroll (a reading plateau) before the rail moves on to the next,
    // so its detail can be read without stopping at one exact point; no snap, which would pull the page by itself
    const tl = gsap.timeline({ paused: true, onUpdate: paint }).to({}, { duration: 0.4 });
    for (let i = 1; i < n; i++) tl.to(state, { f: i, duration: 1, ease: "power1.inOut" }).to({}, { duration: 0.6 });
    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: () => `+=${window.innerHeight * tl.duration() * 0.6}`, pin: true, scrub: 1,
      animation: tl, invalidateOnRefresh: true, onRefresh: paint });
    paint();
    return () => { st.kill(); tl.kill(); };
  }, []);

  return (
    <section ref={root} className="relative h-svh overflow-hidden bg-limestone-50">
      {/* the Figma frame (1076 tall) scaled to the viewport's height */}
      <div ref={frame} className="flex h-full flex-col gap-20 pt-20" style={{ zoom, height: `${100 / zoom}%` }}>
        <SectionTitle tag={M.tag} title={M.title} body={M.body} className="mx-auto max-w-[920px] container-x" />
        <div ref={rail} className="flex w-max items-start will-change-transform">
          {M.items.map((m, i) => <Milestone key={m.year} i={i} />)}
        </div>
      </div>
    </section>
  );
}
