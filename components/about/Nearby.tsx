"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import { nearby as N } from "@/lib/about/b-content";
import { COAST_EAST, COAST_WEST } from "@/lib/about/b-nearby-geo";

const W = 1512, H = 1024;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/** Type sized in container units so labels scale with the map like the SVG, never below a readable floor. */
const cq = (px: number, min: number): CSSProperties => ({ fontSize: `max(${min}px, ${(px / W) * 100}cqw)`, lineHeight: 1.45 });

/**
 * Nearby, after the Figma "UI / Coastline drawing (Nearby)" prototype (4 steps, Smart Animate 1.4 s
 * ease-in-out), turned into one scroll-scrubbed timeline. The coastline draws outward from Alam Al Roum
 * in both directions, each pin and label rises in (10 px, like Figma) as the line reaches it, then the
 * dashed desert road draws down to Cairo. Desktop pins the map full-screen (cover-cropped like the
 * frame); below lg the map keeps its true proportions inside a swipeable strip.
 */
export default function Nearby() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    const q = (s: string) => el.querySelectorAll<SVGGeometryElement & HTMLElement>(s);
    const west = el.querySelector<SVGPathElement>("[data-west]")!, east = el.querySelector<SVGPathElement>("[data-east]")!;
    const roadClip = el.querySelector("[data-road-clip]")!;
    const pins = N.places.map((_, k) => ({ dot: q(`[data-dot="${k}"]`), tick: q(`[data-tick="${k}"]`), label: q(`[data-label="${k}"]`) }));
    if (reducedMotion()) return;

    // pathLength="1" on both halves, so dashoffset 1 → 0 draws them from Alam Al Roum outward
    gsap.set([west, east], { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
    gsap.set(roadClip, { attr: { height: 0 } });
    pins.forEach((p) => { gsap.set(p.dot, { scale: 0, transformOrigin: "50% 50%" }); gsap.set(p.tick, { scaleY: 0, transformOrigin: "50% 100%" }); gsap.set(p.label, { autoAlpha: 0, y: 10 }); });
    gsap.set(q("[data-origin]"), { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(q("[data-badge]"), { autoAlpha: 0, y: 16 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    // Step 1 · Origin: the ring and the "You are here" badge
    tl.to(q("[data-origin]"), { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0)
      .to(q("[data-badge]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2);
    // the east half draws in three legs (Figma steps 2–4); `at` → timeline time on the leg it falls in
    const legs = [[0.8, 0, N.steps[0]], [2.2, N.steps[0], N.steps[1]], [3.6, N.steps[1], 1]] as const, LEG = 1.4;
    legs.forEach(([t0, , b]) => tl.to(east, { attr: { "stroke-dashoffset": 1 - b }, duration: LEG }, t0));
    tl.to(west, { attr: { "stroke-dashoffset": 0 }, duration: LEG }, 0.8);
    const timeOf = (side: string, at: number) => {
      if (side === "west") return 0.8 + at * LEG;
      if (side === "road") return 5.2 + LEG;
      const [t0, a, b] = legs.find(([, a, b]) => at >= a && at <= b) ?? legs[2];
      return t0 + ((at - a) / (b - a)) * LEG;
    };
    // Step 4 · the desert road to Cairo (Figma reveals it with a box that grows downward)
    tl.to(roadClip, { attr: { height: N.road.box.h }, duration: LEG }, 5.2);
    pins.forEach((p, k) => {
      const t = timeOf(N.places[k].side, N.places[k].at);
      tl.to(p.dot, { scale: 1, duration: 0.25, ease: "back.out(2)" }, t)
        .to(p.tick, { scaleY: 1, duration: 0.3, ease: "power2.out" }, t + 0.05)
        .to(p.label, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, t + 0.15);
    });
    const vh = withHold(tl, 2.6);   // a reading hold on the finished map before the pin releases

    const mm = gsap.matchMedia();
    mm.add({ desk: "(min-width: 1024px)", mob: "(max-width: 1023.98px)" }, (ctx) => {
      const st = ctx.conditions!.desk
        ? ScrollTrigger.create({ trigger: el, start: "top top", end: `+=${vh * 100}%`, pin: true, scrub: 1, animation: tl })
        : ScrollTrigger.create({ trigger: el.querySelector("[data-map]"), start: "top 75%", end: "bottom 35%", scrub: 1, animation: tl });
      return () => st.kill();
    });
    return () => { mm.revert(); tl.kill(); };
  }, []);

  const { x: ox, y: oy } = N.origin;
  return (
    <section ref={root} className="relative bg-limestone-500 lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col gap-5 pb-8 pt-20 container-x lg:pointer-events-none lg:absolute lg:bottom-20 lg:left-0 lg:z-10 lg:p-0 lg:pl-[var(--gutter)]">
        <RevealText text={N.tag} className="t-label l-16 text-deepsea-500" />
        <RevealText as="h2" text={N.title} className="t-heading hd-48 text-deepsea-500" delay={0.05} />
      </div>

      {/* below lg: a swipeable strip; lg: the map box covers the viewport like object-fit: cover */}
      <div className="overflow-x-auto [scrollbar-width:none] lg:absolute lg:inset-0 lg:overflow-hidden">
        <div data-map className="relative w-[220vw] max-w-[1512px] lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[max(100%,calc(100vh*1512/1024))] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2"
          style={{ aspectRatio: `${W} / ${H}`, containerType: "inline-size" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={N.map} alt="Satellite map of Egypt's North Coast from Marsa Matrouh to Alexandria and Cairo" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute -translate-x-1/2 t-body text-limestone-300" style={{ left: pct(628, W), top: pct(120, H), ...cq(16, 10) }}>{N.sea}</span>

          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <defs>
              <clipPath id="b-nearby-road"><rect data-road-clip x={N.road.box.x} y={N.road.box.y} width={N.road.box.w} height={N.road.box.h} /></clipPath>
            </defs>
            <g fill="none" className="stroke-limestone-50" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
              <path data-west d={COAST_WEST} pathLength={1} />
              <path data-east d={COAST_EAST} pathLength={1} />
            </g>
            <line clipPath="url(#b-nearby-road)" x1={N.road.x1} y1={N.road.y1} x2={N.road.x2} y2={N.road.y2} className="stroke-limestone-50" strokeWidth={2.5} strokeDasharray="6 6" />
            {N.places.map((p, k) => (
              <g key={p.name}>
                <line data-tick={k} x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y - 3 - p.tick} className="stroke-limestone-300" strokeWidth={1.5} />
                <circle data-dot={k} cx={p.x} cy={p.y} r={9} className="fill-limestone-50" />
              </g>))}
            {/* Alam Al Roum: ring, dot and the leader down to the badge */}
            <circle data-origin cx={ox} cy={oy} r={18.75} fill="none" className="stroke-limestone-50" strokeWidth={2.5} />
            <circle data-origin cx={ox} cy={oy} r={11} className="fill-limestone-50" />
            <line data-badge x1={ox} y1={oy + 14} x2={ox} y2={376} className="stroke-limestone-50" strokeWidth={1.5} />
          </svg>

          {N.places.map((p, k) => (
            <span key={p.name} data-label={k} className="absolute flex flex-col whitespace-nowrap"
              style={{ left: pct(p.x - 4, W), bottom: pct(H - (p.y - 16 - p.tick), H) }}>
              <span className="t-label text-limestone-50" style={cq(16, 10)}>{p.name}</span>
              <span className="t-text text-limestone-300" style={cq(14, 9)}>{p.km}</span>
            </span>))}

          <div data-badge className="absolute flex items-center gap-[0.8cqw] rounded-full bg-deepsea-500 py-[0.66cqw] pl-[0.66cqw] pr-[1.2cqw]" style={{ left: pct(101, W), top: pct(376, H) }}>
            <span aria-hidden className="block aspect-[591/271] w-[max(34px,4.5cqw)] bg-limestone-50"
              style={{ WebkitMask: `url(${N.coinPair}) center / contain no-repeat`, mask: `url(${N.coinPair}) center / contain no-repeat` }} />
            <span className="flex flex-col">
              <span className="t-heading text-limestone-50" style={cq(20, 11)}>{N.origin.name}</span>
              <span className="t-text text-limestone-300" style={cq(14, 9)}>{N.origin.note}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
