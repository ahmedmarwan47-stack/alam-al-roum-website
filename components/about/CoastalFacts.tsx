"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { photoIn, PHOTO_FROM, whenSectionEnters } from "@/components/reveal/letters";
import RevealText from "@/components/reveal/RevealText";
import { facts as F } from "@/lib/about/a-content";
import { srcSet } from "@/lib/img";

/** The two photos: the Experience Center's courtyard and its lobby. */
const PHOTOS = [
  { src: F.image, alt: "The Experience Center courtyard" },
  { src: "/images/photo/ui-expcenter-lobby.webp", alt: "The Experience Center lobby and lounge" },
];

/**
 * "A Fully Integrated Coastal City" (UI / Section / Split Merge). 15 Nov: after the client's reference (Brand Intro,
 * 1512 frame): the title and the paragraph centred at the top (no rule and no button, 15 Nov), then two tall photos
 * side by side, 564 × 630 in an 1188 column with a 60 gap, the right one 117 lower.
 * Motion: the copy blurs in (the site's entrance); each photo opens with the site's photo sweep (a wipe up out of a
 * blur) as the section arrives, the right one a beat later. The pair arrives with twice the stagger and, as it
 * scrolls up to the middle of the screen, the two move vertically towards each other until they settle on the Figma
 * stagger (never aligned); each picture also drifts inside its frame (120 % tall, ±8 %: no edge shows).
 * Phones: the copy, then the photos side by side, smaller, with the same motion.
 */
export default function CoastalFacts() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const frames = el.querySelectorAll<HTMLElement>("[data-frame]");
    gsap.set(frames, { ...PHOTO_FROM });
    const st = { trigger: el, start: "top bottom", end: "bottom top", scrub: true };
    // the pair rests staggered as in Figma (the right one 117 lower at 1512, set in the markup); it arrives with twice
    // that stagger (the extra shared out between the two) and closes in on the Figma stagger as it rises, never aligning
    const off = () => Math.min(117, Math.max(32, innerWidth * 0.077));
    const meet = { trigger: el.querySelector("[data-pair]"), start: "top bottom", end: "center center", scrub: true, invalidateOnRefresh: true };
    const ctx = gsap.context(() => {
      frames.forEach((f, k) => {
        gsap.fromTo(f.parentElement, { y: () => (k === 0 ? -0.5 : 0.5) * off() }, { y: 0, ease: "none", scrollTrigger: { ...meet } });
        gsap.fromTo(f.querySelector("img"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { ...st } });
      });
    }, el);
    const stop = whenSectionEnters(frames[0], () => frames.forEach((f, k) => photoIn(f, null, { delay: 0.2 + k * 0.2 })));
    return () => { stop(); ctx.revert(); gsap.set(frames, { clearProps: "clipPath,filter" }); };
  }, []);
  return (
    <section ref={root} className="overflow-hidden bg-limestone-50 py-12 text-deepsea-500 container-x lg:py-20">
      <div className="mx-auto flex max-w-[600px] flex-col items-center text-center">
        <RevealText as="h2" segs={[{ t: "A fully integrated" }, { t: "coastal city", br: true }]} className="t-heading hd-56" />
        <RevealText text={F.body} className="mt-6 t-body b-18 text-limestone-800" delay={0.1} />
      </div>
      <div data-pair className="mx-auto mt-14 grid max-w-[1188px] grid-cols-2 items-start gap-3 md:gap-6 lg:mt-[60px] lg:gap-[60px]">
        {PHOTOS.map((p, k) => (
          <div key={p.src} className={k === 1 ? "mt-[clamp(32px,7.7vw,117px)]" : ""}>
            <div data-frame className="relative aspect-[564/630] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-no-blur src={p.src} srcSet={srcSet(p.src)} alt={p.alt} loading="lazy"
                className="absolute inset-x-0 top-[-10%] h-[120%] w-full object-cover will-change-transform" />
            </div>
          </div>))}
      </div>
    </section>
  );
}
