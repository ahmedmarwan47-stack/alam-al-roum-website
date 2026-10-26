"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { archSea as A } from "@/lib/destination";

/**
 * Lighthouse · the arch at sea (Figma 11134:15815, 1512 × 1524): the page melts into the clouds, and below them the
 * mirror arch stands in the sea under an open sky ("arch-water-loop-with-sky", the video placed in Figma). The film
 * starts 80 px (5.3 % of the width) down so its top edge always sits under the solid band of the clouds.
 * The film plays on its own loop. As you scroll through, you drop out of the clouds:
 * they lift away faster than the page while the film settles from a slight push-in, so it reads as a fall from
 * the sky down to the arch.
 */
export default function ArchSea() {
  const root = useRef<HTMLElement>(null), film = useRef<HTMLDivElement>(null), clouds = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (reducedMotion()) return;
    const fall = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } })
      .fromTo(clouds.current, { yPercent: 0 }, { yPercent: -35 }, 0)
      .fromTo(film.current, { scale: 1.18, yPercent: -6 }, { scale: 1, yPercent: 0 }, 0);
    return () => { fall.scrollTrigger?.kill(); fall.kill(); };
  }, []);
  return (
    <section ref={root} className="relative overflow-hidden bg-limestone-50" style={{ aspectRatio: "1512 / 1524" }} aria-label="The arch at sea">
      <div ref={film} className="relative mt-[5.3vw] origin-top will-change-transform">
        <video className="block w-full" poster={A.poster} autoPlay muted loop playsInline aria-hidden>
          <source src={A.webm} type="video/webm" />
          <source src={A.video} type="video/mp4" />
        </video>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={clouds} src={A.clouds} alt="" className="pointer-events-none absolute inset-x-0 top-0 w-full will-change-transform" />
    </section>
  );
}
