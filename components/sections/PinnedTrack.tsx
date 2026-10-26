"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, HOLD_VH } from "@/lib/gsap";

export type TrackEl = HTMLElement & { track?: gsap.core.Tween };

/**
 * A row of panels that scrolls sideways: on desktop the section pins and the row slides left as you
 * scroll down (one viewport of scroll per viewport of track), then rests on the last panel for a reading hold.
 * Phones and reduced motion get a plain stack.
 */
export default function PinnedTrack({ children, className = "", trackClassName = "" }:
  { children: React.ReactNode; className?: string; trackClassName?: string }) {
  const wrap = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia("(min-width: 1024px)").matches) return;
    const el = track.current!;
    const dist = () => el.scrollWidth - window.innerWidth;
    // the pin runs a reading hold longer than the slide, so the last panel rests in view before the page moves on;
    // the slide itself stays one linear tween (it is the containerAnimation the panels time their entrances to)
    const pin = ScrollTrigger.create({ trigger: wrap.current, start: "top top", end: () => `+=${dist() + window.innerHeight * HOLD_VH}`, pin: true, invalidateOnRefresh: true });
    const tween = gsap.to(el, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: wrap.current, start: "top top", end: () => `+=${dist()}`, scrub: 1, invalidateOnRefresh: true },
    });
    // panels can time their own entrances to the sideways travel (ScrollTrigger containerAnimation)
    (el as TrackEl).track = tween;
    el.dispatchEvent(new Event("track-ready"));
    return () => { delete (el as TrackEl).track; tween.scrollTrigger?.kill(); tween.kill(); pin.kill(); };
  }, []);
  return (
    // GSAP wraps the pinned node in a spacer; pinning the inner div keeps the node React removes (the section) where React expects it
    <section className={`relative overflow-hidden ${className}`}>
      <div ref={wrap}>
        <div ref={track} data-track className={`flex flex-col container-x lg:w-max lg:flex-row lg:items-center ${trackClassName}`}>{children}</div>
      </div>
    </section>
  );
}
