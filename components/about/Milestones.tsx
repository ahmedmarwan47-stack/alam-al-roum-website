"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import SectionTitle from "@/components/sections/SectionTitle";
import Icon from "@/components/ui/Icon";
import { milestones as M } from "@/lib/about/b-content";

/** Figma "UI / Milestone" (10979:18571…): 400 wide, 15 ticks 24 apart from x 24, ticks 56 at rest → 136 at the focus. */
const CARD = 400, TICKS = 15, TICK_X0 = 24, TICK_GAP = 25, LOW = 56, HIGH = 136;
/** Half-width of the tick wave (px); Figma's 60 px gutter, where 2025 starts (the content edge on wider screens). */
const SPREAD = 190, GUTTER = 60;
const N = M.items.length;

/** One milestone: the year, the tick rhythm, then (when it is the one in focus) its long line, description and photo. */
function Milestone({ i, active, onPick }: { i: number; active: boolean; onPick: (i: number) => void }) {
  const m = M.items[i];
  return (
    // a click on a faded milestone brings it into focus (a pointer shortcut; the year buttons above are the keyboard way)
    <div data-ms aria-hidden={!active} onClick={() => !active && onPick(i)}
      className={`relative flex w-[400px] flex-none flex-col gap-10 ${active ? "" : "cursor-pointer"}`}>
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
 * Milestones · phase one (Figma 10921:8293). Click-driven at every width, nothing pinned and nothing tied to the
 * scroll (28 Oct review): prev / next arrows step through the six milestones and each year in the row above the rail
 * jumps straight to its milestone (a faded milestone can also be clicked, and on touch screens the rail swipes).
 * The rail glides to the new focus (0.6–1.4 s by distance, ease in-out): the milestone in focus is fully shown with
 * its long line, description and photo, the others fade away, and the ticks form one wave centred on the focus.
 * From lg up it opens as in Figma, with 2025 at the left gutter, and travels left until 2030 sits in the centre;
 * below lg the rail is scaled to the screen's width and the milestone in focus stays centred.
 * Keyboard: Tab reaches the arrows and the years (44 px targets); ← / → (and Home / End) move between the years.
 */
export default function Milestones() {
  const root = useRef<HTMLElement>(null), rail = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  const years = useRef<(HTMLButtonElement | null)[]>([]);
  const [railZoom, setRailZoom] = useState(1), [focus, setFocus] = useState(0);
  const go = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    // below lg only the rail is scaled, to the screen's width (one 400 px milestone and a sliver of the next),
    // so its copy never drops under 12 px
    const fit = () => {
      const lg = window.innerWidth >= 1024, gut = Math.min(60, Math.max(20, window.innerWidth * 0.0397));
      setRailZoom(lg ? 1 : Math.min(1, (window.innerWidth - 2 * gut) / CARD));
    };
    fit(); window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const el = root.current!, r = rail.current!, t = track.current!;
    const cards = gsap.utils.toArray<HTMLElement>("[data-ms]", el);
    const ticks = cards.map((c) => gsap.utils.toArray<HTMLElement>("[data-ms-tick]", c));
    const state = { f: 0 };   // the milestone in focus, as a float 0 … n-1 while the rail glides
    const paint = () => {
      const f = state.f, fx = f * CARD + CARD / 2;
      // lg: 2025 at the 60 px gutter (wider than 1512, on the 1392 content edge like every section) → 2030 in the
      // centre; where only one milestone fits (phones, tablets) the one in focus stays centred the whole way
      const W = t.clientWidth, x0 = W < 2.5 * CARD ? W / 2 - CARD / 2 : Math.max(GUTTER, (W - 1392) / 2), x1 = W / 2 - ((N - 1) * CARD + CARD / 2);
      r.style.transform = `translate3d(${x0 + (x1 - x0) * (f / (N - 1))}px,0,0)`;
      cards.forEach((c, i) => {
        const near = Math.max(0, 1 - Math.abs(i - f));                 // 1 in focus → 0 one step away
        c.style.opacity = String(0.08 + 0.92 * near);
        const det = c.querySelector<HTMLElement>("[data-ms-detail]")!, line = c.querySelector<HTMLElement>("[data-ms-line]")!;
        const d = Math.max(0, 1 - Math.abs(i - f) * 2);                 // the detail only for the one in focus
        det.style.opacity = String(d); det.style.transform = `translateY(${(1 - d) * 24}px)`;
        line.style.transform = `scaleY(${(268 + (632 - 268) * d) / 632})`;
        ticks[i].forEach((tk, k) => {
          const x = i * CARD + TICK_X0 + k * TICK_GAP, q = (x - fx) / SPREAD;
          tk.style.transform = `scaleY(${(LOW + (HIGH - LOW) * Math.exp(-q * q)) / HIGH})`;
        });
      });
    };
    const rm = reducedMotion();
    let idx = 0;
    go.current = (i: number) => {
      const to = Math.min(N - 1, Math.max(0, i)); if (to === idx && Math.abs(state.f - to) < 1e-3) return;
      idx = to; setFocus(to);
      const dist = Math.abs(state.f - to);
      gsap.to(state, { f: to, duration: rm ? 0 : Math.min(1.4, 0.6 + 0.2 * dist), ease: "power2.inOut", onUpdate: paint, overwrite: true });
    };
    // touch: a sideways swipe on the rail steps the focus; a vertical drag stays the page's scroll (touch-action: pan-y)
    let sx = 0, sy = 0, on = false;
    const down = (e: PointerEvent) => { if (e.pointerType === "mouse") return; sx = e.clientX; sy = e.clientY; on = true; };
    const up = (e: PointerEvent) => {
      if (!on) return; on = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) go.current(idx + (dx < 0 ? 1 : -1));
    };
    const cancel = () => { on = false; };
    t.addEventListener("pointerdown", down); t.addEventListener("pointerup", up); t.addEventListener("pointercancel", cancel);
    const ro = new ResizeObserver(paint); ro.observe(t);
    paint();
    return () => {
      t.removeEventListener("pointerdown", down); t.removeEventListener("pointerup", up); t.removeEventListener("pointercancel", cancel);
      ro.disconnect(); gsap.killTweensOf(state); go.current = () => {};
    };
  }, []);

  // ← / → / Home / End inside the year row move the focus and the keyboard focus together
  const onKeys = (e: KeyboardEvent) => {
    const k = { ArrowLeft: focus - 1, ArrowRight: focus + 1, Home: 0, End: N - 1 }[e.key];
    if (k === undefined) return;
    e.preventDefault();
    const to = Math.min(N - 1, Math.max(0, k));
    go.current(to); years.current[to]?.focus();
  };

  const arrow = "grid h-11 w-11 flex-none place-items-center rounded-full border border-deepsea-500/30 text-deepsea-500 transition-[opacity,border-color] duration-300 hover:border-deepsea-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deepsea-500 disabled:pointer-events-none disabled:opacity-30";
  const prev = <button type="button" aria-label="Previous milestone" onClick={() => go.current(focus - 1)} disabled={focus === 0} className={arrow}><Icon name="arrow-left-01-sharp" /></button>;
  const next = <button type="button" aria-label="Next milestone" onClick={() => go.current(focus + 1)} disabled={focus === N - 1} className={arrow}><Icon name="arrow-right-01-sharp" /></button>;
  return (
    <section ref={root} aria-label="Phase one timeline" className="relative overflow-hidden bg-limestone-50">
      <div className="flex flex-col gap-8 py-20 lg:gap-12 lg:py-24">
        {/* 920 wide less the side padding (800 of copy at 1512); the padding stops at Figma's 60 px, so on wider screens
            the larger gutter does not squeeze the copy */}
        <SectionTitle tag={M.tag} title={M.title} body={M.body} className="mx-auto max-w-[920px] px-[min(var(--gutter),60px)]" />

        {/* the controls: lg up the arrows flank the years; below lg the years fill the row and the arrows sit under the rail */}
        <div className="flex items-center justify-center gap-2 container-x lg:gap-4">
          <div className="hidden lg:block">{prev}</div>
          <div role="group" aria-label="Choose a year" onKeyDown={onKeys} className="grid w-full grid-cols-6 lg:flex lg:w-auto lg:gap-2">
            {M.items.map((m, i) => (
              <button key={m.year} ref={(b) => { years.current[i] = b; }} type="button" onClick={() => go.current(i)}
                aria-current={i === focus ? "step" : undefined} aria-label={`${m.year}: ${m.title}`}
                className={`group relative h-11 rounded-md t-text x-16 tabular-nums transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deepsea-500 lg:px-4 ${i === focus ? "text-deepsea-500" : "text-limestone-800 hover:text-deepsea-500"}`}>
                {m.year}
                {/* the active year's underline */}
                <span aria-hidden className={`absolute inset-x-2 bottom-1 h-px origin-center bg-deepsea-500 transition-transform duration-500 [transition-timing-function:var(--ease-site)] lg:inset-x-4 ${i === focus ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}`} />
              </button>))}
          </div>
          <div className="hidden lg:block">{next}</div>
        </div>
        <p aria-live="polite" className="sr-only">{M.items[focus].year}: {M.items[focus].title}. {M.items[focus].body}</p>

        <div ref={track} className="touch-pan-y max-lg:select-none" style={{ zoom: railZoom }}>
          <div ref={rail} className="flex w-max items-start will-change-transform">
            {M.items.map((m, i) => <Milestone key={m.year} i={i} active={i === focus} onPick={(k) => go.current(k)} />)}
          </div>
        </div>

        <div className="-mt-2 flex items-center justify-center gap-[14px] lg:hidden">
          {prev}
          <span aria-hidden className="t-text x-14 w-[56px] text-center tabular-nums text-limestone-800">{focus + 1} / {N}</span>
          {next}
        </div>
      </div>
    </section>
  );
}
