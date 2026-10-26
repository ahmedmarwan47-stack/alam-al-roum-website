"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import type { TrackEl } from "@/components/sections/PinnedTrack";

/**
 * The terracotta frame with a photo and bougainvillea (Figma 11134:16060), entering like the ERA Residence frame
 * (reference video, 0:21–0:24) as it slides in along the history track: the coloured block rises from below and
 * grows a little into place, the bougainvillea overhanging its top-right corner; then the photo unfolds downward
 * from under the flowers — hinged at its top edge and turned a little, so it shows as a pointed sliver, then a
 * slanted quadrilateral, then lies flat — while the picture inside keeps drifting up a touch faster than the frame.
 * The flowers grow in, then keep a slow breeze sway.
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
        .fromTo(q("[data-block]"), { yPercent: 32, scale: 0.86 }, { yPercent: 0, scale: 1, duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(q("[data-flower]"), { scale: 0.55, rotation: 168, opacity: 0 }, { scale: 1, rotation: 180, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1)
        .fromTo(q("[data-photo]"), { rotationX: -84, rotationY: 28, skewY: -6, opacity: 0.3 },
          { rotationX: 0, rotationY: 0, skewY: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.34)
        .fromTo(q("[data-photo] img"), { scale: 1.25, yPercent: 12 }, { scale: 1.05, yPercent: -4, duration: 0.66 }, 0.34);
    };
    const track = el.closest("[data-track]");
    build();
    track?.addEventListener("track-ready", build);
    return () => { track?.removeEventListener("track-ready", build); tl?.scrollTrigger?.kill(); tl?.kill(); };
  }, []);
  /* eslint-disable @next/next/no-img-element */
  return (
    <div ref={root} className="relative lg:h-[min(844px,calc(100svh-160px))] lg:w-[596px]">
      <div data-block className="relative flex h-full origin-bottom-left items-center justify-center bg-terracotta-500 p-10 [perspective:1200px] lg:p-20">
        <div data-photo className="h-[60vh] w-full max-w-[371px] origin-top-right overflow-hidden lg:h-[69%]">
          <img src={photo} alt="Life on the coast" className="h-full w-full object-cover" />
        </div>
        {/* turned 180° by transform: the sway animates the separate `rotate` property */}
        <img data-flower src={flower} alt="" style={{ transform: "rotate(180deg)" }}
          className="pointer-events-none absolute -top-4 right-0 w-[344px] max-w-[60%] animate-[sway_7s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
