"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, reducedMotion } from "@/lib/gsap";
import { idlePose, type CoinPose } from "@/components/ui/Coin3D";
import type { TrackEl } from "@/components/sections/PinnedTrack";
import { history as H } from "@/lib/destination";

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
    if (reducedMotion()) { gsap.set(p, { strokeDashoffset: 0 }); gsap.set(stops, { opacity: 1, y: 0 }); return; }
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
    <div ref={root} className="flex flex-col items-center gap-10 lg:h-[min(844px,calc(100svh-160px))] lg:w-[1392px]">
      <h2 className="max-w-[842px] text-center t-body uppercase leading-none d-60">{H.coast.title}</h2>
      {/* the 3D coin sits where Figma's coin photo is (371 square) */}
      <div className="aspect-square w-full max-w-[420px] lg:h-[clamp(160px,calc(100svh-620px),371px)] lg:w-auto lg:flex-none">
        <Coin3D pose={pose} className="h-full w-full" />
      </div>
      <div className="relative hidden w-full max-w-[1218px] lg:block" style={{ aspectRatio: `${W} / ${Ht}` }}>
        <svg viewBox="0 0 1219.5 115.166" preserveAspectRatio="none" className="absolute left-0 w-full overflow-visible" style={{ top: pct(77.5, Ht), height: pct(113.7, Ht) }} aria-hidden>
          <path ref={line} d={path} stroke="#07293C" strokeWidth={1.5} strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        {L.stops.map((s) => (
          <div key={s.date} data-stop data-x={s.x} className="absolute inset-0">
            <img src={L.stop} alt="" className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2" style={{ left: pct(s.x, W), top: pct(s.y, Ht) }} />
            <div className="absolute flex w-[170px] -translate-x-1/2 flex-col items-center gap-1 text-center" style={{ left: pct(s.x, W), top: pct(s.ly, Ht) }}>
              <span className="t-label l-12 uppercase">{s.date}</span>
              <span className="t-text x-12 text-limestone-800">{s.text}</span>
            </div>
          </div>))}
        <div data-stop data-x={L.today.x} className="absolute inset-0">
          <img src={L.mark} alt="" className="absolute h-14 w-14 -translate-x-1/2" style={{ left: pct(L.today.x, W), top: pct(64, Ht) }} />
          <img src={L.todayDot} alt="" className="absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2" style={{ left: pct(L.today.x, W), top: pct(L.today.y, Ht) }} />
          <div className="absolute flex -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap text-center" style={{ left: pct(L.today.x, W), top: pct(168, Ht) }}>
            <span className="t-label l-12 uppercase">{L.today.date}</span><span className="t-text x-12 text-limestone-800">{L.today.text}</span>
          </div>
        </div>
      </div>
      <ol className="flex w-full flex-col border-l border-deepsea-500 pl-5 lg:hidden">
        {[...L.stops, L.today].map((s) => (
          <li key={s.date} className="relative flex flex-col gap-1 py-3">
            <i className="absolute -left-[24px] top-[18px] h-[7px] w-[7px] rounded-full bg-deepsea-500" />
            <span className="t-label l-12 uppercase">{s.date}</span><span className="t-text x-12 text-limestone-800">{s.text}</span>
          </li>))}
      </ol>
      <p className="t-text x-12 text-limestone-800">{L.caption}</p>
    </div>
  );
}
