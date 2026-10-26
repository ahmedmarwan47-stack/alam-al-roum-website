"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import type { TrackEl } from "@/components/sections/PinnedTrack";

/**
 * The terracotta frame with a photo and bougainvillea (Figma 11134:16060), entering like the ERA Residence frame as
 * it slides in along the history track: the coloured block rises into place with the flowers on its top-right
 * edge, then the photo swings open inside it like a door hinged on its right side — a thin wedge under the flowers
 * that widens in perspective until it lies flat in the frame. The flowers grow in, then keep a slow breeze sway.
 */
export default function FramedPhoto({ photo, flower }: { photo: string; flower: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!, q = gsap.utils.selector(el);
    if (reducedMotion()) return;
    let tl: gsap.core.Timeline | undefined;
    const build = () => {
      const track = el.closest<TrackEl>("[data-track]");
      if (tl || !track?.track) return;
      tl = gsap.timeline({ defaults: { ease: "none" },
        scrollTrigger: { trigger: el, containerAnimation: track.track, start: "left 100%", end: "left 35%", scrub: 1 } })
        .fromTo(q("[data-block]"), { yPercent: 28 }, { yPercent: 0, duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(q("[data-flower]"), { scale: 0.55, rotation: 168, opacity: 0 }, { scale: 1, rotation: 180, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1)
        .fromTo(q("[data-photo]"), { rotationY: -88, rotationX: 8, opacity: 0.4 },
          { rotationY: 0, rotationX: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.38)
        .fromTo(q("[data-photo] img"), { scale: 1.2 }, { scale: 1, duration: 0.6 }, 0.38);
    };
    const track = el.closest("[data-track]");
    build();
    track?.addEventListener("track-ready", build);
    return () => { track?.removeEventListener("track-ready", build); tl?.scrollTrigger?.kill(); tl?.kill(); };
  }, []);
  /* eslint-disable @next/next/no-img-element */
  return (
    <div ref={root} className="relative lg:h-[min(844px,calc(100svh-160px))] lg:w-[596px]">
      <div data-block className="relative flex h-full items-center justify-center bg-terracotta-500 p-10 [perspective:1400px] lg:p-20">
        <div data-photo className="h-[60vh] w-full max-w-[371px] origin-right overflow-hidden lg:h-[69%]">
          <img src={photo} alt="Life on the coast" className="h-full w-full object-cover" />
        </div>
        {/* turned 180° by transform: the sway animates the separate `rotate` property */}
        <img data-flower src={flower} alt="" style={{ transform: "rotate(180deg)" }}
          className="pointer-events-none absolute -top-4 right-0 w-[344px] max-w-[60%] animate-[sway_7s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
