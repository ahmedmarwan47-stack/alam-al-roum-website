"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { gsap, reducedMotion } from "@/lib/gsap";
import { MQ, matches } from "@/lib/breakpoints";
import { idlePose, type CoinPose } from "@/components/ui/Coin3D";
import type { TrackEl } from "@/components/sections/PinnedTrack";
import { history as H } from "@/lib/destination";
import { srcSet } from "@/lib/img";

/* eslint-disable @next/next/no-img-element */
// each stop's wrapper fills the drawing (absolute inset-0): it is animated, and a transformed wrapper becomes the
// positioning box of its dot and label, so it must be the drawing's size for their percentages to land on the line
const Coin3D = dynamic(() => import("@/components/ui/Coin3D"), { ssr: false });
const W = 1218, Ht = 273;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/**
 * The coast that guided the Romans (Figma 11134:16023), animated like the ERA Residence route line: as the panel
 * slides in along the history track, the coastline draws itself from left to right and each stop — its dot, date
 * and line — rises in the moment the drawing reaches it, ending on "Today" at Alam Al Roum. Above it, the gold
 * coin is the landing page's 3D coin, idling and turning with the travel instead of a still photo.
 * Below lg (no sideways track, 9 Nov) the panel pins in the middle of the screen and plays the same drawing, the
 * whole coastline in view as on desktop: drawn at the screen's width (a little taller, so its curves read), each stop
 * keeps only its date on the line (alternately above and below), and the stop's line of history plays in a caption
 * under the drawing as the line reaches it. The coin turns with the scroll.
 */
export default function CoastHistory({ path }: { path: string }) {
  const root = useRef<HTMLDivElement>(null), line = useRef<SVGPathElement>(null);
  const pose = useRef<CoinPose>({ ...idlePose(), spin: 0.12 });
  useEffect(() => {
    const el = root.current!, p = line.current!, q = gsap.utils.selector(el);
    const len = p.getTotalLength();
    // how far along the drawn length each stop sits (the coastline runs left to right)
    const at = (x: number) => {
      const sx = (x / W) * 1219.5;
      let lo = 0, hi = len;
      for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (p.getPointAtLength(m).x < sx) lo = m; else hi = m; }
      return lo / len;
    };
    const stops = q("[data-stop]");
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(stops, { opacity: 0, y: 12 });
    if (reducedMotion()) {
      gsap.set(p, { strokeDashoffset: 0 }); gsap.set(stops, { opacity: 1, y: 0 });
      // phones: the captions share one cell, so without the scene only the last one ("Today") shows
      gsap.set(q("[data-cap]"), { opacity: (k: number, _: unknown, all: unknown[]) => (k === all.length - 1 ? 1 : 0) });
      return;
    }
    // below lg: pin the panel (its inner node, so the pin spacer sits inside the element React owns) and play the
    // drawing with the scroll; the strip slides left with the line, so the line's head crosses the screen with it
    if (!matches(MQ.lg)) {
      const pin = q("[data-pin]")[0], caps = q("[data-cap]");
      // the stroke's dashes are measured on screen (non-scaling-stroke), and here the drawing is squeezed far more
      // across than down, so measure the line as drawn: sample it, scale each step to the screen, sum the lengths;
      // the stops are then placed by their share of that drawn length, so the line and the dates stay in step
      const svg = p.ownerSVGElement!, kx = svg.clientWidth / 1219.5, ky = svg.clientHeight / 115.166, N = 400;
      const xs: number[] = [], cum: number[] = [0];
      let prev = p.getPointAtLength(0);
      xs.push(prev.x);
      for (let k = 1; k <= N; k++) {
        const pt = p.getPointAtLength((k / N) * len);
        cum.push(cum[k - 1] + Math.hypot((pt.x - prev.x) * kx, (pt.y - prev.y) * ky));
        xs.push(pt.x); prev = pt;
      }
      const drawn = cum[N];
      const atDrawn = (x: number) => { const sx = (x / W) * 1219.5, k = xs.findIndex((v) => v >= sx); return (k < 0 ? drawn : cum[k]) / drawn; };
      gsap.set(p, { strokeDasharray: drawn, strokeDashoffset: drawn });
      const ph = gsap.timeline({ defaults: { ease: "none" },
        scrollTrigger: { trigger: pin, start: "center center", end: "+=160%", pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (s) => { pose.current.rotY = s.progress * Math.PI * 2; } } })
        .to(p, { strokeDashoffset: 0, duration: 1 }, 0);
      gsap.set(caps, { opacity: 0, y: 8 });
      const times = stops.map((s) => Math.max(0, atDrawn(+s.dataset.x!) - 0.04));
      stops.forEach((s, k) => {
        ph.to(s, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, times[k])
          .to(caps[k], { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, times[k] + 0.02);
        if (k > 0) ph.to(caps[k - 1], { opacity: 0, y: -8, duration: 0.05, ease: "power2.in" }, times[k] - 0.03);
      });
      ph.to({}, { duration: 0.15 });   // rest on "Today" before the pin lets go
      return () => { ph.scrollTrigger?.kill(); ph.kill(); };
    }
    let tl: gsap.core.Timeline | undefined;
    const build = () => {
      const track = el.closest<TrackEl>("[data-track]");
      if (tl || !track?.track) return;
      tl = gsap.timeline({ defaults: { ease: "none" },
        scrollTrigger: { trigger: el, containerAnimation: track.track, start: "left 80%", end: "left 5%", scrub: 1,
          onUpdate: (s) => { pose.current.rotY = s.progress * Math.PI * 2; } } })
        .to(p, { strokeDashoffset: 0, duration: 1 }, 0);
      stops.forEach((s) => tl!.to(s, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, Math.max(0, at(+s.dataset.x!) - 0.04)));
    };
    const track = el.closest("[data-track]");
    build();
    track?.addEventListener("track-ready", build);
    return () => { track?.removeEventListener("track-ready", build); tl?.scrollTrigger?.kill(); tl?.kill(); };
  }, []);

  const L = H.line;
  return (
    <div ref={root} className="lg:h-[min(844px,calc(100svh-160px))] lg:w-[1392px]">
    <div data-pin className="flex flex-col items-center gap-8 lg:h-full lg:gap-10">
      <h2 className="max-w-[842px] text-center t-serif uppercase leading-none d-60">{H.coast.title}</h2>
      {/* the 3D coin sits where Figma's coin photo is (371 square) */}
      <div className="aspect-square w-[min(56vw,32svh)] lg:h-[clamp(100px,calc(100svh-635px),371px)] lg:w-auto lg:flex-none">
        <Coin3D pose={pose} className="h-full w-full" />
      </div>
      {/* phones: the whole drawing at the screen's width, a little taller than desktop so its curves read */}
      <div className="relative w-full max-w-[1218px] max-lg:aspect-[335/150]!" style={{ aspectRatio: `${W} / ${Ht}` }}>
        <svg viewBox="0 0 1219.5 115.166" preserveAspectRatio="none" className="absolute left-0 w-full overflow-visible" style={{ top: pct(77.5, Ht), height: pct(113.7, Ht) }} aria-hidden>
          <path ref={line} d={path} stroke="#07293C" strokeWidth={1.5} strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        {L.stops.map((s, k) => (
          <div key={s.date} data-stop data-x={s.x} className="absolute inset-0">
            <img src={L.stop} srcSet={srcSet(L.stop)} alt="" className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2" style={{ left: pct(s.x, W), top: pct(s.y, Ht) }} />
            <div className="absolute flex w-[170px] -translate-x-1/2 flex-col items-center gap-1 text-center max-lg:hidden" style={{ left: pct(s.x, W), top: pct(s.ly, Ht) }}>
              <span className="t-label l-12 uppercase">{s.date}</span>
              <span className="t-text x-12 text-limestone-800">{s.text}</span>
            </div>
            {/* phones: the date alone, alternately above and below the line */}
            <span className={`absolute -translate-x-1/2 whitespace-nowrap t-label l-12 uppercase lg:hidden ${k % 2 ? "translate-y-3" : "-translate-y-[calc(100%+12px)]"}`} style={{ left: pct(s.x, W), top: pct(s.y, Ht) }}>{s.date}</span>
          </div>))}
        <div data-stop data-x={L.today.x} className="absolute inset-0">
          {/* desktop: Figma's spot above the line; phones: sat just above the Today dot (the stretched drawing put it far off) */}
          <img src={L.mark} srcSet={srcSet(L.mark)} alt="" className="absolute h-14 w-14 -translate-x-1/2 max-lg:h-8 max-lg:w-8 max-lg:-translate-y-[calc(100%+8px)] max-lg:[top:var(--mark-sm)]!" style={{ left: pct(L.today.x, W), top: pct(64, Ht), "--mark-sm": pct(L.today.y, Ht) } as CSSProperties} />
          <img src={L.todayDot} srcSet={srcSet(L.todayDot)} alt="" className="absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2" style={{ left: pct(L.today.x, W), top: pct(L.today.y, Ht) }} />
          <div className="absolute flex -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap text-center max-lg:hidden" style={{ left: pct(L.today.x, W), top: pct(168, Ht) }}>
            <span className="t-label l-12 uppercase">{L.today.date}</span><span className="t-text x-12 text-limestone-800">{L.today.text}</span>
          </div>
          <span className="absolute -translate-x-1/2 translate-y-3 whitespace-nowrap t-label l-12 uppercase lg:hidden" style={{ left: pct(L.today.x, W), top: pct(L.today.y, Ht) }}>{L.today.date}</span>
        </div>
      </div>
      {/* phones: each stop's line of history, in one place under the drawing, as the line reaches it */}
      <div className="grid w-full max-w-[420px] text-center lg:hidden" aria-live="polite">
        {[...L.stops, L.today].map((s) => (
          <p key={s.date} data-cap className="flex flex-col gap-1 [grid-area:1/1]">
            <span className="t-label l-14 uppercase">{s.date}</span><span className="t-text b-14 text-limestone-800">{s.text}</span>
          </p>))}
      </div>
    </div>
    </div>
  );
}
