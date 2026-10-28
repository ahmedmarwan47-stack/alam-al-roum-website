"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import type { TrackEl } from "@/components/sections/PinnedTrack";

/**
 * The terracotta frame with a photo (Figma 11134:16060), on the history track. Two entrances,
 * one after the other, scrubbed with the track as the panel slides in (with the page scroll below lg):
 *  · the frame: the terracotta block opens from a thin vertical seam at its centre out to both edges;
 *  · the photo: once the frame is open it rises in from the bottom of its window, its blur clearing as it
 *    settles back from a slight zoom — the same family as the site's photo entrance;
 * The photo fills the frame inside an even 60 px terracotta mat on desktop (28 Oct review: larger than Figma's
 * 371 × 69% window, and no bougainvillea over the corner).
 */
export default function FramedPhoto({ photo }: { photo: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!, q = gsap.utils.selector(el);
    if (reducedMotion()) return;
    let tl: gsap.core.Timeline | undefined;
    const build = () => {
      if (tl) return;
      const track = el.closest<TrackEl>("[data-track]")?.track;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      if (desktop && !track) return;            // wait for the track (it dispatches track-ready)
      // the frame is the last panel, so its left edge never travels further than where the track stops (the right
      // content edge less its width): the entrance ends 40 px before that rest, or it would freeze half-way (28 Oct)
      const rest = () => window.innerWidth - parseFloat(getComputedStyle(el.closest("[data-track]")!).paddingRight) - el.offsetWidth;
      tl = gsap.timeline({ defaults: { ease: "none" },
        scrollTrigger: track
          ? { trigger: el, containerAnimation: track, start: "left 100%", end: () => `left ${rest() + 40}px`, scrub: 1, invalidateOnRefresh: true }
          : { trigger: el, start: "top 90%", end: "top 30%", scrub: 1 } })
        .fromTo(q("[data-block]"), { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-photo]"), { clipPath: "inset(100% 0% 0% 0%)", filter: "blur(14px)" },
          { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", duration: 0.45, ease: "power2.out" }, 0.4)
        .fromTo(q("[data-photo] img"), { scale: 1.18 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0.4);
    };
    const track = el.closest("[data-track]");
    build();
    track?.addEventListener("track-ready", build);
    return () => { track?.removeEventListener("track-ready", build); tl?.scrollTrigger?.kill(); tl?.kill(); };
  }, []);
  /* eslint-disable @next/next/no-img-element */
  return (
    <div ref={root} className="relative lg:h-[min(844px,calc(100svh-160px))] lg:w-[596px]">
      <div data-block className="relative flex h-full items-center justify-center bg-terracotta-500 p-10 lg:p-[60px]">
        <div data-photo className="h-[60vh] w-full overflow-hidden lg:h-full">
          <img src={photo} alt="Life on the coast" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
