"use client";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import RevealText from "@/components/reveal/RevealText";
import { photoIn, PHOTO_FROM } from "@/components/reveal/letters";

export type SingleHeroData = { eyebrow: string; name: string; line: string; photo: string; alt?: string; video?: string; facts?: [string, string][] };

/**
 * UI / Hero / Single page (Figma 11053:7718): full-bleed photo, the place name huge, a descriptor and (optionally) a
 * 3-fact card. Two thirds of the viewport tall, running up under the glass bar, so the next section shows below it;
 * the copy sits at the foot of the photo on the left, level with the fact card on the right. The photo opens with the
 * site's photo entrance as the page loads, then drifts slower than the page on scroll.
 */
export default function SingleHero({ data: H }: { data: SingleHeroData }) {
  const media = useRef<HTMLDivElement>(null), wrap = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const m = media.current!;
    gsap.set(m, { ...PHOTO_FROM, visibility: "visible" });
    const intro = photoIn(m, m.firstElementChild, { delay: 0.1 });
    const t = gsap.to(m, { yPercent: 12, scale: 1.06, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom top", scrub: true } });
    return () => { intro.kill(); t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return (
    <section ref={wrap} data-hero className="relative flex h-[67svh] min-h-[540px] flex-col justify-end overflow-hidden bg-deepsea-900 pb-6 pt-[108px] text-limestone-50 md:pb-16">
      <div ref={media} data-reveal-img className="absolute inset-0 origin-top">
        {H.video
          ? <video className="h-full w-full object-cover" src={H.video} poster={H.photo} autoPlay muted loop playsInline aria-hidden />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={H.photo} alt={H.alt ?? ""} className="h-full w-full object-cover" />}
      </div>
      {/* the shade the copy sits on (measured for AA on the lightest photos), rising from the foot */}
      <div className="hero-foot-shade pointer-events-none absolute inset-0" />
      <div className="relative flex flex-col gap-5 container-x md:flex-row md:items-end md:justify-between md:gap-10">
        {/* wide enough for a two-word name on one line (Marina boulevard), so the eyebrow stays low in the shade */}
        <div className="flex max-w-[820px] flex-col gap-3">
          <RevealText text={H.eyebrow} onLoad delay={0.2} className="t-label l-16" />
          <RevealText as="h1" text={H.name} onLoad delay={0.3} className="t-heading hd-80" />
          <RevealText text={H.line} onLoad delay={0.55} className="t-body b-20 wrap-balance max-w-[640px]" />
        </div>
        {H.facts && (
          // Figma Fact card: frosted glass, 300 px, three stacked facts with hairline dividers; phones: one strip,
          // the facts side by side. The Limestone tint (`.glass-card`) is dense enough for Deep Sea text on any photo
          <div className="glass-card grid flex-none grid-cols-3 gap-3 rounded-2xl p-4 text-deepsea-500 md:flex md:w-[300px] md:flex-col md:gap-4 md:p-6">
            {H.facts.map(([v, l], k) => (
              <div key={l} className="flex flex-col gap-4">
                {k > 0 && <i className="hidden h-px w-full bg-deepsea-500/20 md:block" />}
                <div className="flex flex-col gap-1"><span className="t-heading hd-32">{v}</span><span className="t-text x-14 text-deepsea-500/85">{l}</span></div>
              </div>))}
          </div>)}
      </div>
    </section>
  );
}
