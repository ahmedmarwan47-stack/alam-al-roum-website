"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import { splitChars, writeIn } from "@/components/reveal/letters";
import type { TrackEl } from "@/components/sections/PinnedTrack";
import { history as H } from "@/lib/destination";

/* eslint-disable @next/next/no-img-element */

/**
 * Since the Romans (Figma 11134:16014), the first panel of the history track. As the section scrolls up into view
 * the mosaic behind the title rises into place — opening from the bottom while it eases back from a 1.25 zoom —
 * and "Since the Romans" writes itself in. The bougainvillea grows in from its corner, then keeps a slow breeze
 * sway and turns a little further as the track carries it away.
 */
export default function RomansIntro() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!, q = gsap.utils.selector(el), sec = el.closest("section")!;
    if (reducedMotion()) return;
    const photo = q("[data-mosaic]")[0] as HTMLElement, img = photo.querySelector("img")!;
    const rise = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: sec, start: "top 90%", end: "top top", scrub: 1 } })
      .fromTo(photo, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" }, 0)
      .fromTo(img, { scale: 1.25, yPercent: 8 }, { scale: 1, yPercent: 0 }, 0)
      .fromTo(q("[data-flower]"), { scale: 0.6, rotation: -24, yPercent: 30, opacity: 0 }, { scale: 1, rotation: 0, yPercent: 0, opacity: 1, ease: "power2.out" }, 0.15);
    const title = writeIn(splitChars(q("[data-title]")[0] as HTMLElement), 0.05, 0.8).pause();
    const titleST = ScrollTrigger.create({ trigger: sec, start: "top 45%", onEnter: () => title.play(), onLeaveBack: () => title.reverse() });
    // while the track slides, the flower turns and lifts a little more (on the outer layer; the sway is CSS)
    let drift: gsap.core.Tween | undefined;
    const build = () => {
      const track = el.closest<TrackEl>("[data-track]");
      if (drift || !track?.track) return;
      drift = gsap.to(q("[data-flower-drift]"), { rotation: 10, yPercent: -12, ease: "none",
        scrollTrigger: { trigger: el, containerAnimation: track.track, start: "left left", end: "right left", scrub: 1 } });
    };
    const track = el.closest("[data-track]");
    build();
    track?.addEventListener("track-ready", build);
    return () => { track?.removeEventListener("track-ready", build); rise.scrollTrigger?.kill(); rise.kill(); titleST.kill(); title.kill(); drift?.scrollTrigger?.kill(); drift?.kill(); };
  }, []);
  const R = H.romans;
  return (
    <div ref={root} className="relative flex flex-col gap-8 lg:h-[min(844px,calc(100svh-160px))] lg:w-[1392px] lg:flex-row lg:items-end lg:gap-[30px]">
      <div className="relative h-[70vh] flex-1 lg:h-full">
        <div data-mosaic className="absolute left-[16%] top-0 h-full w-[68%] overflow-hidden lg:left-[419px] lg:w-[622px]">
          <img src={R.photo} alt="A Roman mosaic of a ship" className="h-full w-full object-cover" />
        </div>
        <h2 data-title data-no-blur className="absolute left-0 top-1/2 flex w-[60%] -translate-y-1/2 flex-col gap-[7px] t-body text-right uppercase leading-none [font-size:clamp(56px,7.9vw,120px)] lg:w-[552px]">
          <span>{R.title[0]}</span><span>{R.title[1]}</span><span className="text-center">{R.title[2]}</span>
        </h2>
      </div>
      <div className="flex max-w-[360px] flex-col gap-3 t-body">
        <RevealText text={R.side.title} className="text-[36px] leading-none" />
        <RevealText text={R.side.body} className="text-[20px] leading-[1.5]" delay={0.08} />
      </div>
      <div data-flower-drift className="pointer-events-none absolute -bottom-20 left-[calc(var(--gutter)*-1)] w-[344px] max-w-[60vw] origin-bottom-left">
        <img data-flower src={R.flower} alt="" className="w-full origin-bottom-left animate-[sway_6s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
