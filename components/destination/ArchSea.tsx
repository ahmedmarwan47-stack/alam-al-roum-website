"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { archSea as A } from "@/lib/destination";

/**
 * Lighthouse · the arch at sea (Figma 11134:15815): the mirror arch stands in the sea under an open sky
 * ("arch-water-loop-with-sky", the video placed in Figma), its sky melting up into the page's Limestone. Without the
 * clouds the film's empty upper sky read as white space, so the section starts a quarter of the way down the film,
 * a little above the arch (1512 × 1125, 29 Oct review). The film
 * plays on its own loop and settles from a slight push-in as you scroll through. The clouds that covered its top
 * edge are off for now (29 Oct review; `archSea.clouds` keeps the image).
 */
export default function ArchSea() {
  const root = useRef<HTMLElement>(null), film = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (reducedMotion()) return;
    const fall = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } })
      .fromTo(film.current, { scale: 1.18, yPercent: -6 }, { scale: 1, yPercent: 0 }, 0);
    return () => { fall.scrollTrigger?.kill(); fall.kill(); };
  }, []);
  return (
    <section ref={root} className="relative overflow-hidden bg-limestone-50" style={{ aspectRatio: "1512 / 1125" }} aria-label="The arch at sea">
      <div ref={film} className="relative -mt-[24.8%] origin-top will-change-transform">
        <video className="block w-full" poster={A.poster} autoPlay muted loop playsInline aria-hidden>
          <source src={A.webm} type="video/webm" />
          <source src={A.video} type="video/mp4" />
        </video>
      </div>
      {/* the sky fades up into the Limestone, so the film's top edge never shows */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-limestone-50 via-limestone-50/60 to-limestone-50/0" />
    </section>
  );
}
