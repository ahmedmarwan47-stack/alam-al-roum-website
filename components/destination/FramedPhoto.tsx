"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import type { TrackEl } from "@/components/sections/PinnedTrack";

/**
 * The terracotta frame with a photo and bougainvillea (Figma 11134:16060), with the ERA Residence entrance as it
 * slides in along the history track: the coloured block rises in from the lower left, the photo opens inside it
 * from a narrow centre strip to its full width, and the flowers settle onto the corner from above.
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
        scrollTrigger: { trigger: el, containerAnimation: track.track, start: "left 95%", end: "left 35%", scrub: 1 } })
        .fromTo(q("[data-block]"), { xPercent: -14, yPercent: 22, opacity: 0 }, { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.45 }, 0)
        .fromTo(q("[data-photo]"), { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.out" }, 0.3)
        .fromTo(q("[data-photo] img"), { scale: 1.2 }, { scale: 1, duration: 0.7 }, 0.3)
        .fromTo(q("[data-flower]"), { yPercent: -45, rotation: 160, opacity: 0 }, { yPercent: 0, rotation: 180, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.45);
    };
    const track = el.closest("[data-track]");
    build();
    track?.addEventListener("track-ready", build);
    return () => { track?.removeEventListener("track-ready", build); tl?.scrollTrigger?.kill(); tl?.kill(); };
  }, []);
  /* eslint-disable @next/next/no-img-element */
  return (
    <div ref={root} className="relative lg:h-[min(844px,calc(100svh-160px))] lg:w-[596px]">
      <div data-block className="relative flex h-full items-center justify-center overflow-hidden bg-terracotta-500 p-10 lg:p-20">
        <div data-photo className="h-[60vh] w-full max-w-[371px] overflow-hidden lg:h-[69%]">
          <img src={photo} alt="Life on the coast" className="h-full w-full object-cover" />
        </div>
        <img data-flower src={flower} alt="" className="pointer-events-none absolute -top-4 right-0 w-[344px] max-w-[60%] rotate-180" />
      </div>
    </div>
  );
}
