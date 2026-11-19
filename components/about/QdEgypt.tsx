"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { blurIn, BLOCK_FROM, photoIn, PHOTO_FROM, whenSectionEnters } from "@/components/reveal/letters";
import RevealText from "@/components/reveal/RevealText";
import { qdEgypt as E } from "@/lib/about/a-content";
import { srcSet } from "@/lib/img";

/**
 * Qatari Diar Egypt (Figma 11705:10609, 19 Nov; it replaces "A fully integrated coastal city"). On Limestone: on the
 * left the copper Qatari Diar mark (96), the tag and the heading; on the right, their feet aligned, the paragraph and
 * the three figures (48 / 56 with a 16 px label, 48 apart; three equal columns on a phone). Below, two photos side by
 * side (96 under the copy from lg, 19 Nov: Figma's 40 sat too close to the text; 64 on tablets, 48 on phones), each
 * half the content width less the 60 gap (666 × 756 at 1512): the lagoon villas and the town square, the right one
 * 56 lower (19 Nov: the stagger "A fully integrated coastal city" had).
 * Motion: the copy and the figures blur in; each photo opens with the site's photo sweep as the pair arrives, the right
 * one a beat later. 19 Nov: only the two photos are tied to the scroll, and they move towards each other: the pair
 * arrives with twice its stagger (the left photo half of it higher, the right one half of it lower) and closes in on
 * the resting stagger as it reaches the middle of the screen, never aligning. The copy and the pictures inside their
 * frames stay still.
 */
export default function QdEgypt() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const frames = el.querySelectorAll<HTMLElement>("[data-frame]"), blocks = el.querySelectorAll("[data-fig]");
    gsap.set(frames, { ...PHOTO_FROM }); gsap.set(blocks, { ...BLOCK_FROM });
    // the pair rests staggered (the right one 56 lower at 1512, set in the markup); it arrives with twice that stagger,
    // the extra shared out between the two (the left one higher, the right one lower), and the two close in on the
    // resting stagger as the pair reaches the middle of the screen, never aligning
    const off = () => Math.min(56, Math.max(16, innerWidth * 0.037));
    const meet = { trigger: el.querySelector("[data-pair]"), start: "top bottom", end: "center center", scrub: true, invalidateOnRefresh: true };
    const ctx = gsap.context(() => {
      frames.forEach((f, k) => gsap.fromTo(f.parentElement, { y: () => (k === 0 ? -0.5 : 0.5) * off() }, { y: 0, ease: "none", scrollTrigger: { ...meet } }));
    }, el);
    const stopCopy = whenSectionEnters(el, () => blurIn(blocks, { delay: 0.2, stagger: 0.1 }));
    const stopPhotos = whenSectionEnters(frames[0], () => frames.forEach((f, k) => photoIn(f, null, { delay: 0.2 + k * 0.2 })));
    return () => { stopCopy(); stopPhotos(); ctx.revert(); gsap.set(frames, { clearProps: "clipPath,filter" }); gsap.set(blocks, { clearProps: "all" }); };
  }, []);
  return (
    <section ref={root} aria-labelledby="qd-egypt-title" className="overflow-hidden bg-limestone-50 py-12 text-deepsea-500 container-x lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-20">
        <div className="flex flex-col items-start gap-4 lg:basis-1/2 lg:flex-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-fig src={E.logo} alt="Qatari Diar" width={96} height={96} className="size-16 md:size-20 lg:size-24" />
          <div className="flex flex-col gap-3">
            <RevealText text={E.tag} className="t-label l-tag" />
            <div id="qd-egypt-title"><RevealText as="h2" text={E.title} className="t-heading hd-48" delay={0.05} /></div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <RevealText text={E.body} className="t-body b-18 text-limestone-800" delay={0.1} />
          <ul className="grid grid-cols-3 gap-4 md:flex md:gap-12">
            {E.figures.map((f) => (
              <li key={f.label} data-fig className="flex flex-col gap-1">
                <span className="t-heading hd-48">{f.value}</span>
                <span className="t-body b-16 text-limestone-800">{f.label}</span>
              </li>))}
          </ul>
        </div>
      </div>
      <div data-pair className="mt-12 grid grid-cols-2 items-start gap-3 md:mt-16 md:gap-6 lg:mt-24 lg:gap-[60px]">
        {E.photos.map((p, k) => (
          <div key={p.src} className={`will-change-transform ${k === 1 ? "mt-[clamp(16px,3.7vw,56px)]" : ""}`}>
            <div data-frame className="relative aspect-[666/756] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-no-blur src={p.src} srcSet={srcSet(p.src)} alt={p.alt} loading="lazy"
                className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>))}
      </div>
    </section>
  );
}
