"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import { nearby as N } from "@/lib/about/b-content";
import { COAST_EAST, COAST_WEST } from "@/lib/about/b-nearby-geo";

const W = 1512, H = 1024;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/**
 * Type sized in container units so labels scale with the map like the SVG, never below a readable floor
 * (`min` from lg up, `minSm` below lg, where the map is a narrow strip and Figma's floors fell to 9–10 px).
 * Use with the CQ class, which reads the two variables.
 */
const cq = (px: number, min: number, minSm = 12) =>
  ({ "--cq": `${(px / W) * 100}cqw`, "--cq-min": `${min}px`, "--cq-min-sm": `${minSm}px`, lineHeight: 1.45 }) as CSSProperties;
const CQ = "[font-size:max(var(--cq-min),var(--cq))] max-lg:[font-size:max(var(--cq-min-sm),var(--cq))]";
/** Below lg the strip follows the drawing's head and comes to rest centred here (frame x), with Alexandria and Cairo in view. */
const REST_X = 1190;

/**
 * Nearby, after the Figma "UI / Coastline drawing (Nearby)" prototype. Not pinned and not tied to the scroll
 * (28 Oct review): when the map comes into view the whole drawing plays by itself, once, in about five seconds —
 * the "You are here" ring and badge, then the coastline drawing outward from Alam Al Roum in both directions at one
 * even speed (each pin and label rising in, 10 px like Figma, as the line reaches it), then the dashed desert road
 * down to Cairo. From lg the map runs full width at its true proportions (never cropped, so the labels keep their
 * margin from every edge); below lg it is a swipeable strip that follows the drawing east until the visitor swipes it.
 */
export default function Nearby() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    const q = (s: string) => el.querySelectorAll<SVGGeometryElement & HTMLElement>(s);
    const west = el.querySelector<SVGPathElement>("[data-west]")!, east = el.querySelector<SVGPathElement>("[data-east]")!;
    const roadClip = el.querySelector("[data-road-clip]")!;
    const strip = el.querySelector<HTMLElement>("[data-strip]")!, map = el.querySelector<HTMLElement>("[data-map]")!;
    const pins = N.places.map((_, k) => ({ dot: q(`[data-dot="${k}"]`), tick: q(`[data-tick="${k}"]`), label: q(`[data-label="${k}"]`) }));
    if (reducedMotion()) return;

    // pathLength="1" on both halves, so dashoffset 1 → 0 draws them from Alam Al Roum outward
    gsap.set([west, east], { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
    gsap.set(roadClip, { attr: { height: 0 } });
    pins.forEach((p) => { gsap.set(p.dot, { scale: 0, transformOrigin: "50% 50%" }); gsap.set(p.tick, { scaleY: 0, transformOrigin: "50% 100%" }); gsap.set(p.label, { autoAlpha: 0, y: 10 }); });
    gsap.set(q("[data-origin]"), { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(q("[data-badge]"), { autoAlpha: 0, y: 16 });

    // timeline seconds: the east coast (the long half) draws over EAST at one even speed, the west half at the same speed
    const T0 = 0.5, EAST = 3.0, ROAD = 1.1;
    const WEST = EAST * (west.getTotalLength() / east.getTotalLength()), ROAD_AT = T0 + EAST - 0.2;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    // the origin: the ring and the "You are here" badge
    tl.to(q("[data-origin]"), { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0)
      .to(q("[data-badge]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2)
      .to(east, { attr: { "stroke-dashoffset": 0 }, duration: EAST }, T0)
      .to(west, { attr: { "stroke-dashoffset": 0 }, duration: WEST }, T0)
      // the desert road to Cairo (Figma reveals it with a box that grows downward)
      .to(roadClip, { attr: { height: N.road.box.h }, duration: ROAD, ease: "power1.inOut" }, ROAD_AT);
    // each pin as the line reaches it (`at` is the fraction of its half, from Alam Al Roum)
    const timeOf = (side: string, at: number) => (side === "road" ? ROAD_AT + ROAD : T0 + at * (side === "west" ? WEST : EAST));
    pins.forEach((p, k) => {
      const t = timeOf(N.places[k].side, N.places[k].at);
      tl.to(p.dot, { scale: 1, duration: 0.25, ease: "back.out(2)" }, t)
        .to(p.tick, { scaleY: 1, duration: 0.3, ease: "power2.out" }, t + 0.05)
        .to(p.label, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, t + 0.15);
    });

    // below lg: the strip keeps the line's head at ~60 % of its width, then rests centred on REST_X, until it is touched
    let own = false;
    const mine = () => { own = true; };
    const pan = () => {
      if (own || strip.scrollWidth <= strip.clientWidth + 1) return;
      const t = tl.time(), mw = map.offsetWidth, sw = strip.clientWidth;
      const head = t < T0 ? N.origin.x : east.getPointAtLength(Math.min(1, (t - T0) / EAST) * east.getTotalLength()).x;
      const rest = (REST_X / W) * mw - sw / 2;
      strip.scrollLeft = Math.min(strip.scrollWidth - sw, Math.max(0, Math.min(rest, (head / W) * mw - 0.6 * sw)));
    };
    tl.eventCallback("onUpdate", pan);
    strip.addEventListener("pointerdown", mine); strip.addEventListener("wheel", mine, { passive: true });
    // plays once, when most of the map is on screen (and the satellite photo has loaded, so it never draws on a blank frame)
    const pic = map.querySelector("img")!;
    let wait = 0, dead = false;
    const play = () => { clearTimeout(wait); if (!dead && !tl.isActive() && tl.progress() === 0) tl.play(); };
    const st = ScrollTrigger.create({ trigger: strip, start: "top 65%", once: true, onEnter: () => {
      wait = window.setTimeout(play, 1500);          // never wait long on a slow photo
      pic.decode().then(play, play);
    } });
    return () => {
      dead = true; st.kill(); tl.kill(); clearTimeout(wait);
      strip.removeEventListener("pointerdown", mine); strip.removeEventListener("wheel", mine);
    };
  }, []);

  const { x: ox, y: oy } = N.origin;
  return (
    // lg: full width, edge to edge; the section takes the map's own 1512 × 1024 proportions, so nothing is cropped at
    // any screen shape and the drawing keeps its margins from every edge (the title sits on the desert, bottom left)
    <section ref={root} className="relative bg-limestone-500 py-20 lg:py-0">
      <div className="relative mx-[var(--gutter)] lg:mx-0">
        {/* below lg above the map; lg over the map at the bottom left (Figma), on the desert */}
        <div className="flex flex-col gap-5 pb-8 lg:pointer-events-none lg:absolute lg:bottom-[7%] lg:left-[var(--gutter)] lg:z-10 lg:gap-3 lg:pb-0">
          <RevealText text={N.tag} className="t-label l-16 text-deepsea-500" />
          <RevealText as="h2" text={N.title} className="t-heading hd-48 text-deepsea-500" delay={0.05} />
        </div>

        {/* below lg: a swipeable strip (wide enough on a phone that the 12 px labels clear each other's leaders) */}
        <div data-strip className="overflow-x-auto rounded-lg [scrollbar-width:none] lg:overflow-hidden lg:rounded-none">
          <div data-map className="relative w-[max(260vw,1000px)] max-w-[1512px] md:w-[170vw] lg:w-full lg:max-w-none"
            style={{ aspectRatio: `${W} / ${H}`, containerType: "inline-size" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={N.map} alt="Satellite map of Egypt's North Coast from Marsa Matrouh to Alexandria and Cairo" className="absolute inset-0 h-full w-full object-cover" />
            <span className={`absolute -translate-x-1/2 t-body text-limestone-300 ${CQ}`} style={{ left: pct(628, W), top: pct(120, H), ...cq(16, 10) }}>{N.sea}</span>

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
                <span className={`t-label text-limestone-50 ${CQ}`} style={cq(16, 10)}>{p.name}</span>
                <span className={`t-text text-limestone-300 ${CQ}`} style={cq(14, 9)}>{p.km}</span>
              </span>))}

            <div data-badge className="absolute flex items-center gap-[0.8cqw] rounded-full bg-deepsea-500 py-[0.66cqw] pl-[0.66cqw] pr-[1.2cqw]" style={{ left: pct(101, W), top: pct(376, H) }}>
              <span aria-hidden className="block aspect-[591/271] w-[max(34px,4.5cqw)] bg-limestone-50"
                style={{ WebkitMask: `url(${N.coinPair}) center / contain no-repeat`, mask: `url(${N.coinPair}) center / contain no-repeat` }} />
              <span className="flex flex-col">
                <span className={`t-heading text-limestone-50 ${CQ}`} style={cq(20, 11, 13)}>{N.origin.name}</span>
                <span className={`t-text text-limestone-300 ${CQ}`} style={cq(14, 9)}>{N.origin.note}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
