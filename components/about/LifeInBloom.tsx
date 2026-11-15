"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM, whenSectionEnters } from "@/components/reveal/letters";
import { bloom as B } from "@/lib/about/a-content";
import { srcSet } from "@/lib/img";

/** 15 Nov ("use different photos"): a city, lived in. The tall photo is a long shared table under an arch; the two
 *  smaller ones are the terraced homes above the sea and the promenade with its people. */
const TALL = { src: "/images/photo/ui-g-table.webp", alt: "A long shared table set under the olive trees and a limestone arch" };
const SMALL = [
  { src: "/images/photo/ui-g-terraces.webp", alt: "Terraced homes in white limestone and bougainvillea above the sea" },
  { src: "/images/photo/ui-g-boardwalk.webp", alt: "People walking the palm-lined promenade towards the sea" },
];

/**
 * "A city, not a resort" (was UI / Section / Botanical Frame). 15 Nov: an editorial split after the client's
 * reference — on the left the headline, the quote (no button, 15 Nov) and two smaller photos side by side; on the right one tall
 * photo, the full height of the section. From lg the copy sits at the top and the two photos at the foot, flush with
 * the tall photo's edges (15 Nov). Phones stack it all: copy, the two photos, then the tall one.
 * Motion (15 Nov, "it doesn't have animation at all"):
 *  - a light parallax on the tall photo only (15 Nov, motion list): it drifts down inside its fixed frame as the
 *    section crosses the screen (drawn 116 % tall, ±6 % of that, so ±7 % of the frame against 8 %: no edge shows);
 *  - the two small photos hold still;
 *  - as the section arrives the heading and the quote blur in one after another, then the photos (the tall
 *    one, then the two small ones) in the same way: the site's one entrance, no wipe.
 * The photos stay out of the site-wide photo sweep (data-no-blur); with reduced motion everything simply shows.
 */
export default function LifeInBloom() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const st = { trigger: el, start: "top bottom", end: "bottom top", scrub: true };
    const ins = el.querySelectorAll("[data-in]"), phs = el.querySelectorAll("[data-ph]");
    gsap.set([...ins, ...phs], { ...BLOCK_FROM });
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-tall]", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { ...st } });
    }, el);
    const stop = whenSectionEnters(el, () => {
      blurIn(ins, { delay: 0.1, stagger: 0.14 });
      blurIn(phs, { delay: 0.35, stagger: 0.16, duration: 1.3 });
    });
    return () => { stop(); ctx.revert(); gsap.set([...ins, ...phs], { clearProps: "all" }); };
  }, []);
  return (
    <section ref={root} className="bg-limestone-50 py-12 text-deepsea-500 container-x lg:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-10 lg:justify-between lg:gap-12">
          <div className="flex flex-col items-start gap-6">
            <h2 data-in data-reveal className="t-heading hd-56 max-w-[560px] text-balance">{B.title}</h2>
            <p data-in data-reveal className="t-body b-18 max-w-[520px] text-limestone-800">{B.body}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {SMALL.map((p) => (
              <div key={p.src} data-ph className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-no-blur src={p.src} srcSet={srcSet(p.src)} alt={p.alt} loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover" />
              </div>))}
          </div>
        </div>
        <div data-ph className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[min(820px,90svh)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-tall data-no-blur src={TALL.src} srcSet={srcSet(TALL.src)} alt={TALL.alt}
            className="absolute inset-x-0 top-[-8%] h-[116%] w-full object-cover will-change-transform" />
        </div>
      </div>
    </section>
  );
}
