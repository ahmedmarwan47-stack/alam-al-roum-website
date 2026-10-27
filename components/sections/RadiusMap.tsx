"use client";
import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { whenSectionEnters } from "@/components/reveal/letters";

const C = { x: 300, y: 420 };
/**
 * Pin centre (x, y), label anchor (lx, ly: the label's top-left, or its top-right with `end`), flight order.
 * Each label sits on the side of its pin that no route and no ring crosses, at every size from a phone to desktop.
 * London, Paris and Rome fan into the centre together, so Rome's label sits under its pin, below the fan.
 */
const CITIES = [
  { n: "Doha", t: "2.5 hrs", x: 515, y: 458, lx: 489, ly: 392 },               // above its pin, over the Dubai route
  { n: "Rome", t: "3.5 hrs", x: 184, y: 303, lx: 202, ly: 336, end: true },  // under its pin, below the three routes
  { n: "Dubai", t: "4 hrs", x: 549, y: 451, lx: 580, ly: 437 },                // right of its pin, outside the 3000 km ring
  { n: "Riyadh", t: "4 hrs", x: 472, y: 472, lx: 481, ly: 470 },               // right of its pin, between the rings
  { n: "London", t: "5 hrs", x: 123, y: 187, lx: 100, ly: 132 },               // above its pin, outside the 3000 km ring
  { n: "Paris", t: "5 hrs", x: 130, y: 218, lx: 86, ly: 196, end: true },      // left of its pin, outside the 3000 km ring
];
/** The distance rings, each labelled where it crosses the upper right (the ring breaks behind its label). */
const RINGS: [number, string, number, number][] = [[91, "1000 km", 345, 330], [182, "2000 km", 384, 248], [272.5, "3000 km", 422, 165]];
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/**
 * Type sized to the map (Figma px at its 696 width), with a floor. Below lg the floor is 12px (the site's minimum);
 * from lg it is the original 9–11px (a laptop-width map is only ~470px wide), set through the --rm-* variables.
 */
const fs = (px: number, min: number) => ({ fontSize: `max(${min >= 12 ? "12px" : `var(--rm-${min})`}, ${(px / 696) * 100}cqw)`, lineHeight: px === 16 ? 1.5 : px === 14 ? 1.43 : 1.33 });
/** Phones: the map is ~350px wide, too small for name and time at 12px, so the times are listed under it. */
const HIDE_ON_PHONE = "max-md:hidden";
const SHADOW = "text-shadow-[0_1px_3px_rgb(1_15_26/0.9),0_1px_10px_rgb(1_15_26/0.6)]";

/** Phones: the flight times, in flight order, under the map (the map itself keeps the city names). */
export function FlightTimes({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid grid-cols-3 gap-x-4 gap-y-4 ${className}`}>
      {CITIES.map((c) => (
        <li key={c.n} className="flex flex-col"><span className="t-label l-16">{c.n}</span><span className="t-label l-14 text-limestone-50/70">{c.t}</span></li>))}
    </ul>
  );
}

type Gap = { x: number; y: number; w: number; h: number };

/**
 * Within a 5-hour flight radius: routes draw city → Alam Al Roum in flight-time order, a traveller rides each leg.
 * No stroke runs through a word: labels sit clear of the routes, and the dashed rings break behind any text that
 * sits on them (the ring labels, the centre label), through a mask measured from the rendered labels, so the
 * breaks follow the type at every size.
 */
export default function RadiusMap() {
  const root = useRef<HTMLDivElement>(null);
  const mask = `rm-gaps-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [gaps, setGaps] = useState<Gap[]>([]);
  useEffect(() => {
    const el = root.current!; const lines = el.querySelectorAll<SVGLineElement>("[data-route]"), dots = el.querySelectorAll<SVGCircleElement>("[data-trav]"), labels = el.querySelectorAll<HTMLElement>("[data-label]");
    const tl = gsap.timeline({ paused: true });
    lines.forEach((l, k) => {
      const len = Math.hypot(CITIES[k].x - C.x, CITIES[k].y - C.y);
      gsap.set(l, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      tl.to(l, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, k * 0.45)
        .fromTo(dots[k], { attr: { cx: CITIES[k].x, cy: CITIES[k].y }, opacity: 1 }, { attr: { cx: C.x, cy: C.y }, duration: 0.6, ease: "power2.inOut" }, k * 0.45)
        .to(dots[k], { opacity: 0, duration: 0.2 }, k * 0.45 + 0.6)
        .to(labels[k], { opacity: 1, duration: 0.4 }, k * 0.45 + 0.1);
    });
    tl.to(el.querySelector("[data-halo]"), { attr: { r: 34 }, opacity: 0.35, duration: 0.6, ease: "power2.out" }, ">-0.2");
    const off = whenSectionEnters(el, () => tl.play(0));   // draws once, as its section arrives, and stays
    // the ring breaks: every visible line of text, in map units (the ratio holds through the entrance zoom), padded
    const measure = () => {
      const R = el.getBoundingClientRect(); if (!R.width) return; const u = 696 / R.width, pad = 4;
      setGaps([...el.querySelectorAll<HTMLElement>("[data-text]")].filter((t) => t.offsetParent).map((t) => {
        const r = t.getBoundingClientRect();
        return { x: (r.left - R.left) * u - pad, y: (r.top - R.top) * u - pad / 2, w: r.width * u + pad * 2, h: r.height * u + pad };
      }));
    };
    measure(); document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => { off(); tl.kill(); ro.disconnect(); };
  }, []);
  return (
    <div ref={root} data-flight-map className="relative overflow-hidden rounded-[20px] bg-deepsea-800 [--rm-10:12px] [--rm-11:12px] [--rm-9:12px] lg:[--rm-10:10px] lg:[--rm-11:11px] lg:[--rm-9:9px]" style={{ aspectRatio: "696 / 720", containerType: "inline-size" }}>
      {/* Semi-real basemap: Sentinel-2 cloudless 2016 by EOX (CC BY 4.0), azimuthal equidistant on 27.90E 31.20N, 300 px = 3,300 km */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/basemap-semireal-v2.jpg" alt="" className="absolute inset-0 h-full w-full" />
      <svg viewBox="0 0 696 720" className="absolute inset-0 h-full w-full">
        <defs>
          <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="696" height="720">
            <rect width="696" height="720" fill="white" />
            {gaps.map((g, k) => <rect key={k} x={g.x} y={g.y} width={g.w} height={g.h} rx={4} fill="black" />)}
          </mask>
        </defs>
        <g mask={`url(#${mask})`}>
          <g className="drop-shadow-[0_0_3px_rgb(1_15_26/0.5)]">
            {RINGS.map(([r]) => <circle key={r} cx={C.x} cy={C.y} r={r} fill="none" className="stroke-limestone-50" strokeOpacity={0.7} strokeWidth={1.5} strokeDasharray="5 6" />)}
          </g>
        </g>
        <g className="drop-shadow-[0_1px_4px_rgb(1_15_26/0.6)]">
          {CITIES.map((c) => <line key={c.n} data-route x1={c.x} y1={c.y} x2={C.x} y2={C.y} className="stroke-limestone-50" strokeWidth={2.5} strokeLinecap="round" opacity={0} />)}
          {CITIES.map((c) => <circle key={c.n} cx={c.x} cy={c.y} r={6} className="fill-limestone-50 stroke-deepsea-500" strokeWidth={2} />)}
          {CITIES.map((c) => <circle key={c.n} data-trav cx={c.x} cy={c.y} r={4.5} className="fill-teal-300 stroke-deepsea-500" strokeWidth={1.5} opacity={0} />)}
        </g>
        <circle data-halo cx={C.x} cy={C.y} r={24} className="fill-teal-300" opacity={0.3} />
      </svg>
      {/* Centre: the brand coin pair (always as a pair) on a deep-sea badge, centred on Alam Al Roum */}
      <span className="absolute flex items-center justify-center rounded-full border-[1.5px] border-limestone-50 bg-deepsea-500 shadow-[0_2px_8px_rgb(1_15_26/0.55)]"
        style={{ left: pct(C.x - 30, 696), top: pct(C.y - 15, 720), width: pct(60, 696), height: pct(30, 720) }}>
        <span aria-hidden className="block w-[76.7%] bg-limestone-50" style={{ aspectRatio: "591 / 271", mask: "url(/images/icon-pair.svg) center / contain no-repeat", WebkitMask: "url(/images/icon-pair.svg) center / contain no-repeat" }} />
      </span>
      <span data-text className="absolute t-heading text-limestone-50/90 text-shadow-[0_1px_8px_rgb(1_15_26/0.6)]" style={{ left: pct(32, 696), top: pct(32, 720), ...fs(16, 12) }}>Within a 5-hour flight radius</span>
      {RINGS.map(([r, t, x, y]) => (
        <span key={r} data-text className={`absolute t-label text-limestone-50/85 ${SHADOW}`} style={{ left: pct(x, 696), top: pct(y, 720), ...fs(12, 9) }}>{t}</span>))}
      {/* the eastern Mediterranean, just above the centre: inside the 1000 km ring, right of the routes from Europe; dropped on phones */}
      <span data-text className={`absolute whitespace-nowrap t-label text-limestone-300/60 text-shadow-[0_1px_4px_rgb(1_15_26/0.4)] ${HIDE_ON_PHONE}`} style={{ left: pct(294, 696), top: pct(368, 720), ...fs(12, 9) }}>Mediterranean<br />Sea</span>
      {CITIES.map((c) => (
        <span key={c.n} data-label className={`absolute flex flex-col text-limestone-50 opacity-35 ${c.end ? "-translate-x-full items-end" : ""} ${SHADOW}`} style={{ left: pct(c.lx, 696), top: pct(c.ly, 720) }}>
          <span data-text className="t-label" style={fs(16, 11)}>{c.n}</span><span data-text className={`t-label text-limestone-300/95 ${HIDE_ON_PHONE}`} style={fs(14, 10)}>{c.t}</span></span>))}
      {/* the centre label, centred under the badge (the 1000 km ring breaks behind it) */}
      <span className={`absolute flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-limestone-50 ${SHADOW}`} style={{ left: pct(C.x, 696), top: pct(458, 720) }}>
        <span data-text className="t-label" style={fs(16, 11)}>Alam Al Roum</span><span data-text className={`t-label text-limestone-300/95 ${HIDE_ON_PHONE}`} style={fs(12, 9)}>Egypt&apos;s North Coast</span></span>
    </div>
  );
}
