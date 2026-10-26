"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";

export type SingleHeroData = { eyebrow: string; name: string; line: string; photo: string; alt?: string; video?: string; facts?: [string, string][] };

/**
 * UI / Hero / Single page (Figma 11053:7718): full-bleed photo, the place name huge, a one-line
 * descriptor and (optionally) a 3-fact card. The photo drifts slower than the page on scroll.
 */
export default function SingleHero({ data: H }: { data: SingleHeroData }) {
  const media = useRef<HTMLDivElement>(null), wrap = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const t = gsap.to(media.current, { yPercent: 12, scale: 1.06, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top 76px", end: "bottom top", scrub: true } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return (
    <section ref={wrap} className="relative mt-[76px] h-[min(calc(100svh-76px),900px)] min-h-[600px] overflow-hidden bg-deepsea-900 text-limestone-50">
      <div ref={media} className="absolute inset-0 origin-top">
        {H.video
          ? <video className="h-full w-full object-cover" src={H.video} poster={H.photo} autoPlay muted loop playsInline aria-hidden />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={H.photo} alt={H.alt ?? ""} className="h-full w-full object-cover" />}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 via-45% to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/35 to-transparent" />
      <div className="relative flex flex-col gap-3 pt-20 container-x">
        <RevealText text={H.eyebrow} onLoad delay={0.2} className="t-label l-16" />
        <RevealText as="h1" text={H.name} onLoad delay={0.3} className="t-heading hd-80" />
        <RevealText text={H.line} onLoad delay={0.55} className="t-body b-20 max-w-[520px]" />
      </div>
      {H.facts && (
        // Figma Fact card: frosted white glass, 300 px, three stacked facts with hairline dividers
        <div className="absolute bottom-20 right-[var(--gutter)] hidden w-[300px] flex-col gap-4 rounded-2xl border border-white/35 bg-white/14 p-6 text-black backdrop-blur-md md:flex">
          {H.facts.map(([v, l], k) => (
            <div key={l} className="flex flex-col gap-4">
              {k > 0 && <i className="block h-px w-full bg-black/25" />}
              <div className="flex flex-col gap-1"><span className="t-heading hd-32">{v}</span><span className="t-text x-14 text-black/78">{l}</span></div>
            </div>))}
        </div>)}
    </section>
  );
}
