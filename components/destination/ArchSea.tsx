"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { archSea as A } from "@/lib/destination";

/** Arch keyframes as fractions of the film's width: [width, height, baseline from the film's top]. */
const RISE = [0.17, 0.3, 0.72], HOLD = [0.19, 0.36, 0.72], OPEN = [1.6, 2.2, 1.45];

/**
 * Lighthouse · the arch at sea (Figma 11134:15815, 1512 × 1524): the page melts into clouds, and below them the
 * mirror arch stands in the moving sea under an open sky ("arch-water-loop-with-sky", the video placed in Figma).
 * The film starts 80 px (5.3 % of the width) down so its top edge sits under the solid band of the clouds.
 * Entrance (the ERA Residence opening): as the section scrolls up, the film shows through a round-topped arch
 * that rises out of its baseline, holds for a beat, then opens past every edge to full bleed.
 */
export default function ArchSea() {
  const root = useRef<HTMLElement>(null), win = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!, w = win.current!;
    if (reducedMotion()) return;
    const P = { w: 0, h: 0, b: RISE[2] };
    const draw = () => {
      const W = w.offsetWidth, H = w.offsetHeight, aw = P.w * W, ah = P.h * W, base = P.b * W;
      const l = (W - aw) / 2, t = base - ah, r = aw / 2;
      w.style.clipPath = `inset(${t}px ${l}px ${H - base}px ${l}px round ${r}px ${r}px 0 0)`;
    };
    const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: draw,
      scrollTrigger: { trigger: el, start: "top 85%", end: "top top", scrub: 1, invalidateOnRefresh: true } })
      .fromTo(P, { w: RISE[0], h: 0 }, { w: RISE[0], h: RISE[1], duration: 0.35, ease: "power2.out" }, 0)
      .to(P, { w: HOLD[0], h: HOLD[1], duration: 0.2 }, 0.35)
      .to(P, { w: OPEN[0], h: OPEN[1], b: OPEN[2], duration: 0.45, ease: "power2.in" }, 0.55);
    draw();
    window.addEventListener("resize", draw);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); window.removeEventListener("resize", draw); };
  }, []);
  return (
    <section ref={root} className="relative overflow-hidden bg-limestone-50" style={{ aspectRatio: "1512 / 1524" }} aria-label="The arch at sea">
      <div ref={win} className="relative mt-[5.3vw]">
        <video className="block w-full" poster={A.poster} autoPlay muted loop playsInline aria-hidden>
          <source src={A.webm} type="video/webm" />
          <source src={A.video} type="video/mp4" />
        </video>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={A.clouds} alt="" className="pointer-events-none absolute inset-x-0 top-0 w-full" />
    </section>
  );
}
