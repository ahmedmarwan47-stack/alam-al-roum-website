"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import { blurIn } from "@/components/reveal/letters";
import type { TrackEl } from "@/components/sections/PinnedTrack";
import { history as H } from "@/lib/destination";

/* eslint-disable @next/next/no-img-element */

/**
 * Since the Romans (Figma 11134:16014), the first panel of the history track. As the section scrolls up into view
 * the mosaic behind the title rises into place — opening from the bottom while it eases back from a 1.25 zoom —
 * and "Since the Romans" blurs in as one block. The bougainvillea grows in from its corner, then keeps a slow breeze
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
    const title = blurIn(q("[data-title]"), { duration: 1.2 }).pause();
    const titleST = ScrollTrigger.create({ trigger: sec, start: "top 85%", once: true, onEnter: () => title.play() });
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
  // below lg the title stands above the mosaic (no overlap at phone size) and the flower sits on the mosaic's lower corner
  return (
    <div ref={root} className="relative flex flex-col gap-8 lg:h-[min(844px,calc(100svh-160px))] lg:w-[1392px] lg:flex-row lg:items-end lg:gap-[30px]">
      {/* Figma columns: 1041 for the title over the mosaic (the mosaic at 419–1041), 30 gap, 321 for the statement */}
      <div className="relative flex flex-col gap-6 lg:block lg:h-full lg:w-[1041px] lg:flex-none">
        <h2 data-title data-reveal className="relative z-10 flex w-[4.6em] flex-col gap-[7px] t-body text-right uppercase leading-none d-120 lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2">
          <span>{R.title[0]}</span><span>{R.title[1]}</span><span className="text-center">{R.title[2]}</span>
        </h2>
        <div className="relative ml-auto h-[58svh] max-h-[560px] w-[84%] lg:absolute lg:left-[419px] lg:top-0 lg:ml-0 lg:h-full lg:max-h-none lg:w-[622px]">
          <div data-mosaic className="h-full w-full overflow-hidden">
            <img src={R.photo} alt="A Roman mosaic of a ship" className="h-full w-full object-cover" />
          </div>
          <div data-flower-drift className="pointer-events-none absolute -bottom-6 left-[calc(-19.05%-var(--gutter))] w-[200px] origin-bottom-left lg:-bottom-20 lg:left-[calc(-419px-var(--gutter))] lg:w-[344px] lg:max-w-[60vw]">
            <img data-flower src={R.flower} alt="" className="w-full origin-bottom-left animate-[sway_6s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
      <div className="flex max-w-[360px] flex-col gap-3 t-body lg:w-[321px] lg:flex-none">
        <RevealText text={R.side.title} className="d-36 leading-none" />
        <RevealText text={R.side.body} className="b-20" delay={0.08} />
      </div>
    </div>
  );
}
