"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { onceInView } from "@/components/reveal/letters";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import { nearby as N } from "@/lib/about/b-content";
import { COAST_EAST, COAST_WEST } from "@/lib/about/b-nearby-geo";
import { srcSet } from "@/lib/img";

const W = 1512, H = 1024;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/**
 * Type sized in container units so labels scale with the map like the SVG, never below a readable floor
 * (`min` from lg up, `minSm` below lg; never under 12 px, the site's floor for any text).
 * Use with the CQ class, which reads the two variables.
 */
const cq = (px: number, min: number, minSm = 12) =>
  ({ "--cq": `${(px / W) * 100}cqw`, "--cq-min": `${min}px`, "--cq-min-sm": `${minSm}px`, lineHeight: "round(nearest, 1.45em, 4px)" }) as CSSProperties;
// phones: the labels sit at their 12 px floor; a 16 px line keeps them on the 4 px grid (the inline 1.45 is for larger sizes)
const CQ = "[font-size:round(nearest,max(var(--cq-min),var(--cq)),2px)] max-lg:[font-size:round(nearest,max(var(--cq-min-sm),var(--cq)),2px)] max-md:leading-4!";
/**
 * Phones (below md, 9 Nov): the whole drawing fits the screen width, full bleed, with no swiping; each pin shows only
 * its distance (no place names, which could not clear each other at this size). Where two distances would still touch,
 * a pin gets a longer leader on phones (`tick`) or its distance sits to the left of the leader (`end`).
 */
const PHONE: Record<string, { tick?: number; end?: boolean }> = { Alamein: { tick: 230 }, Cairo: { end: true } };
/** Below lg the strip follows the drawing's head and comes to rest centred here (frame x, clamped to the strip's end): Cairo and its label in full (and Alexandria too on a tablet). */
const REST_X = 1260;
/**
 * Below lg the strip is a 4:3 window on the drawing (9 Nov), not its full height (mostly desert): the camera holds the
 * coast band (frame y), then glides down the road to Cairo. While the drawing plays it follows the road's progress;
 * once the visitor swipes, it follows the strip's position (the coast west of x0, Cairo east of x1).
 */
const CAM = { coast: 315, cairo: 690, x0: 1000, x1: 1200 };
const smooth = (f: number) => { const c = Math.min(1, Math.max(0, f)); return c * c * (3 - 2 * c); };

/**
 * Nearby, after the Figma "UI / Coastline drawing (Nearby)" prototype. Not pinned and not tied to the scroll
 * (28 Oct review): when the map comes into view the whole drawing plays by itself, once, in about four and a half seconds —
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

    // the camera (below lg): a vertical offset on the map inside the 4:3 strip; none from lg, where the map is whole
    const camY = gsap.quickTo(map, "y", { duration: 0.6, ease: "power3.out" });
    const camAt = (cy: number) => {
      const mh = map.offsetHeight, sh = strip.clientHeight, sc = map.offsetWidth / W;
      return mh <= sh + 1 ? 0 : -Math.min(mh - sh, Math.max(0, cy * sc - sh / 2));
    };
    const byX = () => {
      const cx = (strip.scrollLeft + strip.clientWidth / 2) / (map.offsetWidth / W);
      return CAM.coast + smooth((cx - CAM.x0) / (CAM.x1 - CAM.x0)) * (CAM.cairo - CAM.coast);
    };
    // `road`: how far down the road the drawing's camera has gone (0 coast … 1 Cairo), set while it plays
    let own = false, road = 0;
    const roadY = () => CAM.coast + smooth(road) * (CAM.cairo - CAM.coast);
    // where the camera should be now: the strip's position once swiped (or with reduced motion), else the drawing's
    const target = () => (own || reducedMotion() ? byX() : roadY());
    const onScroll = () => { if (own || reducedMotion()) camY(camAt(byX())); };
    // re-placed whenever the strip or the map changes size (a rotation, a resize across lg, late CSS), not just on load
    // (through camY, with the start set to the end: a jump; a gsap.set would be undone by camY's running tween)
    const ro = new ResizeObserver(() => { const y = camAt(target()); camY(y, y); });
    ro.observe(strip); ro.observe(map);
    strip.addEventListener("scroll", onScroll, { passive: true });
    // camY's tween is killed too, or a leftover one (a remount) would pull the map back to its own end value
    const off = () => { strip.removeEventListener("scroll", onScroll); ro.disconnect(); camY.tween.kill(); };
    if (reducedMotion()) return off;

    // pathLength="1" on both halves, so dashoffset 1 → 0 draws them from Alam Al Roum outward
    gsap.set([west, east], { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
    gsap.set(roadClip, { attr: { height: 0 } });
    pins.forEach((p) => { gsap.set(p.dot, { scale: 0, transformOrigin: "50% 50%" }); gsap.set(p.tick, { scaleY: 0, transformOrigin: "50% 100%" }); gsap.set(p.label, { autoAlpha: 0, y: 10 }); });
    gsap.set(q("[data-origin]"), { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(q("[data-badge]"), { autoAlpha: 0, y: 16 });

    // timeline seconds: the east coast (the long half) draws over EAST at one even speed, the west half at the same speed
    const T0 = 0.5, EAST = 2.5, ROAD = 1.1;
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
    const mine = () => { own = true; };
    const pan = () => {
      if (own || strip.scrollWidth <= strip.clientWidth + 1) return;
      const t = tl.time(), mw = map.offsetWidth, sw = strip.clientWidth;
      road = (t - ROAD_AT) / ROAD;
      camY(camAt(roadY()));
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
    const stIn = onceInView(strip, "top 65%", () => {
      wait = window.setTimeout(play, 1500);          // never wait long on a slow photo
      pic.decode().then(play, play);
    });
    return () => {
      dead = true; stIn(); tl.kill(); clearTimeout(wait); off();
      strip.removeEventListener("pointerdown", mine); strip.removeEventListener("wheel", mine);
    };
  }, []);

  const { x: ox, y: oy } = N.origin;
  return (
    // lg: full width, edge to edge; the section takes the map's own 1512 × 1024 proportions, so nothing is cropped at
    // any screen shape and the drawing keeps its margins from every edge (the title sits on the desert, bottom left)
    // no vertical padding of its own: on the page colour the neighbours' 80 px already give the site's 80 px gap
    <section ref={root} className="relative lg:bg-limestone-500">
      {/* the map runs edge to edge at every size (9 Nov); below lg only the title keeps the gutter */}
      <div className="relative">
        {/* below lg above the map; lg over the map at the bottom left (Figma), on the desert */}
        <div className="flex flex-col gap-5 px-[var(--gutter)] pb-8 lg:px-0 lg:pointer-events-none lg:absolute lg:bottom-[7%] lg:left-[var(--gutter)] lg:z-10 lg:gap-3 lg:pb-0">
          <RevealText text={N.tag} className="t-label l-tag text-deepsea-500" />
          <RevealText as="h2" text={N.title} className="t-heading hd-48 text-deepsea-500" delay={0.05} />
        </div>

        {/* phones: the whole map at the screen's width (PHONE). Tablets: a swipeable 4:3 window, its camera on the
            coast and then the road to Cairo (CAM). lg: the whole map, labels in full */}
        <div data-strip className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] md:max-lg:aspect-[4/3] lg:overflow-hidden">
          <div data-map className="relative w-full md:w-[170vw] md:max-w-[1512px] lg:w-full lg:max-w-none"
            style={{ aspectRatio: `${W} / ${H}`, containerType: "inline-size" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={N.map} srcSet={srcSet(N.map)} alt="Satellite map of Egypt's North Coast from Marsa Matrouh to Alexandria and Cairo" className="absolute inset-0 h-full w-full object-cover" />
            {/* not on phones (9 Nov) */}
            <span className={`absolute -translate-x-1/2 whitespace-nowrap t-body text-limestone-300 max-md:hidden ${CQ}`} style={{ left: pct(628, W), top: pct(120, H), ...cq(16, 12) }}>{N.sea}</span>

            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <clipPath id="b-nearby-road"><rect data-road-clip x={N.road.box.x} y={N.road.box.y} width={N.road.box.w} height={N.road.box.h} /></clipPath>
              </defs>
              <g fill="none" className="stroke-limestone-50" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round">
                <path data-west d={COAST_WEST} pathLength={1} />
                <path data-east d={COAST_EAST} pathLength={1} />
              </g>
              <line clipPath="url(#b-nearby-road)" x1={N.road.x1} y1={N.road.y1} x2={N.road.x2} y2={N.road.y2} className="stroke-limestone-50" strokeWidth={2.5} strokeDasharray="6 6" />
              {N.places.map((p, k) => {
                const t = PHONE[p.name]?.tick;
                return (
                <g key={p.name}>
                  <line data-tick={k} x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y - 3 - p.tick} className={`stroke-limestone-300 ${t ? "max-md:hidden" : ""}`} strokeWidth={1.5} />
                  {t && <line data-tick={k} x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y - 3 - t} className="stroke-limestone-300 md:hidden" strokeWidth={1.5} />}
                  <circle data-dot={k} cx={p.x} cy={p.y} r={9} className="fill-limestone-50" />
                </g>);
              })}
              {/* Alam Al Roum: ring, dot and the leader down to the badge */}
              <circle data-origin cx={ox} cy={oy} r={18.75} fill="none" className="stroke-limestone-50" strokeWidth={2.5} />
              <circle data-origin cx={ox} cy={oy} r={11} className="fill-limestone-50" />
              <line data-badge x1={ox} y1={oy + 14} x2={ox} y2={376} className="stroke-limestone-50" strokeWidth={1.5} />
            </svg>

            {N.places.map((p, k) => {
              const ph = PHONE[p.name] ?? {};
              return (
              <span key={p.name} data-label={k} className={`absolute flex flex-col whitespace-nowrap bottom-[var(--b)] max-md:bottom-[var(--b-sm)] ${ph.end ? "max-md:-translate-x-full max-md:items-end max-md:pr-1" : ""}`}
                style={{ left: pct(p.x - 4, W), "--b": pct(H - (p.y - 16 - p.tick), H), "--b-sm": pct(H - (p.y - 16 - (ph.tick ?? p.tick)), H) } as CSSProperties}>
                <span className={`t-label text-limestone-50 max-md:hidden ${CQ}`} style={cq(16, 12)}>{p.name}</span>
                <span className={`t-text text-limestone-300 max-md:font-medium max-md:text-limestone-50 ${CQ}`} style={cq(14, 12)}>{p.km}</span>
              </span>);
            })}

            {/* phones: logo on top, the name under it (no "You are here"), left-aligned so the leader comes down onto the logo */}
            <div data-badge className="absolute flex items-center gap-[0.8cqw] rounded-full bg-deepsea-500 py-[0.66cqw] pl-[0.66cqw] pr-[1.2cqw] max-md:flex-col max-md:items-start max-md:gap-1 max-md:rounded-lg max-md:p-2" style={{ left: pct(88.7, W), top: pct(376, H) }}>
              <span aria-hidden className="block aspect-[591/271] w-[max(34px,4.5cqw)] bg-limestone-50 max-md:w-6"
                style={{ WebkitMask: `url(${N.coinPair}) center / contain no-repeat`, mask: `url(${N.coinPair}) center / contain no-repeat` }} />
              <span className="flex flex-col">
                <span className={`t-heading text-limestone-50 ${CQ}`} style={{ ...cq(16, 12, 12), lineHeight: "round(nearest, 1.5em, 4px)" }}>{N.origin.name}</span>
                <span className={`t-text text-limestone-300 max-md:hidden ${CQ}`} style={{ ...cq(14, 12), lineHeight: "round(nearest, 1.5em, 4px)" }}>{N.origin.note}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
