"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import type { Seg } from "@/components/reveal/RevealText";

export type PageHeroData = { pre: string; title: Seg[]; body: string; photo: string; alt?: string };

/**
 * Inner-page hero (Figma "UI / Headline / Destination", 11053:7571), its four states in order:
 * Hidden → Line 1 (on load, after 0.4 s: the pre-headline and the first line rise, 0.9 s) →
 * Shown (the second line and the paragraph, the photo fades in rising 60 px into its 360 × 240 slot, and the rule
 * draws across, 1.1 s) → Full (on scroll, pinned: the photo grows to full bleed under a 75% dim, the rule fades
 * and the headline stays, turning Limestone over the photo). The box itself grows, so the photo is re-framed at
 * every size and its subject stays in view.
 */
export default function PageHero({ data: H }: { data: PageHeroData }) {
  const wrap = useRef<HTMLDivElement>(null), photo = useRef<HTMLDivElement>(null), dim = useRef<HTMLDivElement>(null),
    rule = useRef<HTMLDivElement>(null), copy = useRef<HTMLDivElement>(null), body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = photo.current; if (!el || reducedMotion()) return;
    // Line 1 → Shown: the photo and the rule arrive with the second line
    const intro = gsap.timeline({ delay: 0.95 })
      .fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, 0)
      .fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.out" }, 0);
    if (!window.matchMedia("(min-width: 1024px)").matches) return () => { intro.kill(); };
    // Shown → Full, scrubbed
    const tl = gsap.timeline({ defaults: { ease: "none" },   // linear: it visibly moves from the very first pixel of scroll
      scrollTrigger: { trigger: wrap.current, start: "top 76px", end: "+=110%", scrub: 1, pin: true } });   // 76 = under the bar: grows from the first pixel of scroll
    tl.to(el, { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0 }, 0)
      .to(dim.current, { opacity: 0.75 }, 0)
      .to(rule.current, { opacity: 0 }, 0)
      .to(copy.current, { color: "#FBFAF8" }, 0)
      .to(body.current, { color: "rgba(251, 250, 248, 0.85)" }, 0);
    return () => { intro.kill(); tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);
  return (
    // the pinned node is the inner div, so GSAP's pin-spacer never wraps the element React owns
    <section className="mt-[76px]">
    <div ref={wrap} className="relative overflow-hidden bg-limestone-50 lg:h-[calc(100svh-76px)] lg:min-h-[640px]">
      {/* slot from Figma (1512 × 760): left 1092, top 480, 360 × 240 */}
      <div ref={photo} className="relative h-[60vh] overflow-hidden lg:absolute lg:left-[72.2%] lg:top-[63.2%] lg:h-[31.6%] lg:w-[23.8%] lg:rounded-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={H.photo} alt={H.alt ?? ""} className="h-full w-full object-cover" />
        <div ref={dim} className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-0" />
      </div>
      <div ref={copy} className="relative flex flex-col gap-4 py-16 text-deepsea-500 container-x lg:absolute lg:left-0 lg:top-[30.3%] lg:py-0">
        <RevealText text={H.pre} onLoad delay={0.4} className="t-label l-16" />
        <RevealText as="h1" segs={H.title} onLoad delay={0.45} stagger={0.5} className="t-label hd-56 max-w-[1000px] capitalize" />
        <div ref={body} className="text-limestone-800"><RevealText text={H.body} onLoad delay={1.0} className="t-body b-18 max-w-[300px]" /></div>
      </div>
      <div ref={rule} className="absolute inset-x-[var(--gutter)] top-[94.7%] hidden h-px origin-left bg-limestone-300 lg:block" />
    </div>
    </section>
  );
}
