"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const C = { x: 300, y: 420 };
const CITIES = [ // pin centre, label top-left, flight order
  { n: "Doha", t: "2.5 hrs", x: 515, y: 458, lx: 489, ly: 408 },
  { n: "Rome", t: "3.5 hrs", x: 184, y: 303, lx: 198, ly: 281 },
  { n: "Dubai", t: "4 hrs", x: 549, y: 451, lx: 563, ly: 439 },
  { n: "Riyadh", t: "4 hrs", x: 472, y: 472, lx: 438, ly: 486 },
  { n: "London", t: "5 hrs", x: 123, y: 187, lx: 137, ly: 145 },
  { n: "Paris", t: "5 hrs", x: 130, y: 218, lx: 72, ly: 212 },
];
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** Within a 5-hour flight radius: routes draw city → Alam Al Roum in flight-time order, a traveller rides each leg. */
export default function RadiusMap() {
  const root = useRef<HTMLDivElement>(null);
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
    const st = ScrollTrigger.create({ trigger: el, start: "top 70%", onEnter: () => tl.restart(), onLeaveBack: () => tl.pause(0) });
    return () => { st.kill(); tl.kill(); };
  }, []);
  return (
    <div ref={root} className="relative overflow-hidden rounded-[20px] bg-deepsea-800" style={{ aspectRatio: "696 / 720" }}>
      {/* Semi-real basemap: Sentinel-2 cloudless 2016 by EOX (CC BY 4.0), azimuthal equidistant on 27.90E 31.20N, 300 px = 3,300 km */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/basemap-semireal-v2.jpg" alt="" className="absolute inset-0 h-full w-full" />
      <svg viewBox="0 0 696 720" className="absolute inset-0 h-full w-full">
        <g className="drop-shadow-[0_0_3px_rgb(1_15_26/0.5)]">
          {[91, 182, 272.5].map((r) => <circle key={r} cx={C.x} cy={C.y} r={r} fill="none" className="stroke-limestone-50" strokeOpacity={0.7} strokeWidth={1.5} strokeDasharray="5 6" />)}
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
      <span className="absolute t-heading hd-16 text-limestone-50/90 text-shadow-[0_1px_8px_rgb(1_15_26/0.6)]" style={{ left: pct(32, 696), top: pct(32, 720) }}>Within a 5-hour flight radius</span>
      {[["1000 km", 345, 330], ["2000 km", 384, 248], ["3000 km", 422, 165]].map(([t, x, y]) => (
        <span key={t as string} className="absolute t-label l-12 text-limestone-50/85 text-shadow-[0_1px_3px_rgb(1_15_26/0.9),0_1px_10px_rgb(1_15_26/0.6)]" style={{ left: pct(x as number, 696), top: pct(y as number, 720) }}>{t}</span>))}
      <span className="absolute t-label l-12 text-limestone-300/60 text-shadow-[0_1px_4px_rgb(1_15_26/0.4)]" style={{ left: pct(312, 696), top: pct(366, 720) }}>Mediterranean Sea</span>
      {CITIES.map((c) => (
        <span key={c.n} data-label className="absolute flex flex-col text-limestone-50 opacity-35 text-shadow-[0_1px_3px_rgb(1_15_26/0.9),0_1px_10px_rgb(1_15_26/0.6)]" style={{ left: pct(c.lx, 696), top: pct(c.ly, 720) }}>
          <span className="t-label l-16">{c.n}</span><span className="t-label l-14 text-limestone-300/95">{c.t}</span></span>))}
      <span className="absolute flex flex-col text-limestone-50 text-shadow-[0_1px_3px_rgb(1_15_26/0.9),0_1px_10px_rgb(1_15_26/0.6)]" style={{ left: pct(250, 696), top: pct(454, 720) }}>
        <span className="t-label l-16">Alam Al Roum</span><span className="t-label l-12 text-limestone-300/95">Egypt&apos;s North Coast</span></span>
    </div>
  );
}
