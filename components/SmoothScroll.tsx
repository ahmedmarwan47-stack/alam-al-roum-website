"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

/** Lenis drives the page; ScrollTrigger reads it on the same gsap.ticker clock. */
export default function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    // ScrollTrigger measures its starts once (and on window resize); when the page's height changes without a resize
    // (a list or accordion opening, an image or a pinned scene settling, in-site navigation) every trigger below the
    // change went stale, and an entrance could wait at opacity 0 on screen (9 Nov: the About Milestones title on a
    // phone). Re-measure, at most once per 200 ms, whenever the page's height changes.
    let h = document.documentElement.scrollHeight, t: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      const nh = document.documentElement.scrollHeight;
      if (Math.abs(nh - h) < 2) return;
      h = nh; clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); ro.disconnect(); clearTimeout(t); };
  }, []);
  return null;
}
