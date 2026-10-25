"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import type { Seg } from "@/components/reveal/RevealText";

export type PageHeroData = { pre: string; title: Seg[]; body: string; photo: string; alt?: string };

/**
 * Inner-page hero (Figma "Hero · A coast built for every season", UI / Headline / Destination):
 * the headline rises on load; on scroll the section pins and the photo grows from its
 * 360 × 240 slot (bottom right) to full bleed. The box itself grows, so the photo is
 * re-framed at every size and its subject stays in view.
 */
export default function PageHero({ data: H }: { data: PageHeroData }) {
  const wrap = useRef<HTMLDivElement>(null), photo = useRef<HTMLDivElement>(null), dim = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = photo.current; if (!el || reducedMotion() || !window.matchMedia("(min-width: 1024px)").matches) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: wrap.current, start: "top top", end: "+=110%", scrub: 1, pin: true } });
    tl.to(el, { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0, ease: "none" }, 0)
      .to(dim.current, { opacity: 0.35, ease: "none" }, 0)
      .to(wrap.current!.querySelector("[data-hero-copy]"), { y: -60, opacity: 0, ease: "none", duration: 0.6 }, 0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);
  return (
    // the pinned node is the inner div, so GSAP's pin-spacer never wraps the element React owns
    <section className="mt-[76px]">
    <div ref={wrap} className="relative overflow-hidden bg-limestone-50 lg:h-[760px]">
      {/* slot from Figma (1512 × 760): left 1092, top 480, 360 × 240 */}
      <div ref={photo} className="relative h-[60vh] overflow-hidden lg:absolute lg:left-[72.2%] lg:top-[63.2%] lg:h-[31.6%] lg:w-[23.8%] lg:rounded-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={H.photo} alt={H.alt ?? ""} className="h-full w-full object-cover" />
        <div ref={dim} className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-0" />
      </div>
      <div data-hero-copy className="relative flex flex-col gap-4 py-16 container-x lg:absolute lg:left-0 lg:top-[230px] lg:py-0">
        <RevealText text={H.pre} onLoad delay={0.2} className="t-label l-16" />
        <RevealText as="h1" segs={H.title} onLoad delay={0.35} className="t-label hd-56 max-w-[1000px] capitalize" />
        <RevealText text={H.body} onLoad delay={0.65} className="t-body b-18 max-w-[300px] text-limestone-800" />
      </div>
      <div className="absolute inset-x-[var(--gutter)] top-[720px] hidden h-px bg-limestone-300 lg:block" />
    </div>
    </section>
  );
}
