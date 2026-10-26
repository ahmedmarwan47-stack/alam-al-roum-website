"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import type { TrackEl } from "@/components/sections/PinnedTrack";

/**
 * The part of the box (in %) on the top-right side of a diagonal that has swept `a` of the way (0 → 200) from the
 * top-right corner to the bottom-left one, as a clip-path polygon.
 */
const sweep = (a: number) => {
  const c = 100 - a, pts: [number, number][] = [];                 // region x − y ≥ c inside the 100 × 100 box
  pts.push([Math.max(c, 0), 0], [100, 0]);
  pts.push(c >= 0 ? [100, 100 - c] : [100, 100]);
  if (c < 0) pts.push([100 + c, 100], [0, 100], [0, -c]);          // the diagonal has passed both far corners
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
};

/**
 * The terracotta frame with a photo and bougainvillea (Figma 11134:16060), entering like the ERA Residence frame as
 * it slides in along the history track: the coloured block rises into place with the flowers already resting on
 * its top-right edge, then the photo inside is wiped open on a diagonal — a sliver under the flowers at the
 * top-right corner that sweeps down and across to the bottom-left until it fills the frame.
 */
export default function FramedPhoto({ photo, flower }: { photo: string; flower: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!, q = gsap.utils.selector(el), ph = q("[data-photo]")[0] as HTMLElement;
    const W = { a: 0 };
    const draw = () => { ph.style.clipPath = sweep(W.a); };
    if (reducedMotion()) return;
    draw();
    let tl: gsap.core.Timeline | undefined;
    const build = () => {
      const track = el.closest<TrackEl>("[data-track]");
      if (tl || !track?.track) return;
      tl = gsap.timeline({ defaults: { ease: "none" },
        scrollTrigger: { trigger: el, containerAnimation: track.track, start: "left 100%", end: "left 40%", scrub: 1 } })
        .fromTo(q("[data-block]"), { yPercent: 28 }, { yPercent: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(W, { a: 200, duration: 0.45, ease: "power1.inOut", onUpdate: draw }, 0.4)
        .fromTo(q("[data-photo] img"), { scale: 1.15 }, { scale: 1, duration: 0.6 }, 0.4);
    };
    const track = el.closest("[data-track]");
    build();
    track?.addEventListener("track-ready", build);
    return () => { track?.removeEventListener("track-ready", build); tl?.scrollTrigger?.kill(); tl?.kill(); };
  }, []);
  /* eslint-disable @next/next/no-img-element */
  return (
    <div ref={root} className="relative lg:h-[min(844px,calc(100svh-160px))] lg:w-[596px]">
      <div data-block className="relative flex h-full items-center justify-center bg-terracotta-500 p-10 lg:p-20">
        <div data-photo className="h-[60vh] w-full max-w-[371px] overflow-hidden lg:h-[69%]">
          <img src={photo} alt="Life on the coast" className="h-full w-full object-cover" />
        </div>
        <img src={flower} alt="" className="pointer-events-none absolute -top-4 right-0 w-[344px] max-w-[60%] rotate-180" />
      </div>
    </div>
  );
}
