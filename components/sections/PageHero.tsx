"use client";
import { Fragment, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, withHold } from "@/lib/gsap";
import "@/lib/about/a-motion";
import { blurIn } from "@/components/reveal/letters";
import type { Seg } from "@/components/reveal/RevealText";

export type PageHeroData = { pre: string; title: Seg[]; body: string; photo: string; alt?: string };

/**
 * Inner-page hero (Figma "UI / Headline / Destination", 11053:7571) — the same motion as the About hero
 * (Manifesto, "UI / Headline / Accent"), since both are one concept:
 * on load, after 0.3 s, the pre-headline, the headline and the paragraph blur in, block by block; the photo rises 60 px into its 360 × 240 slot and the rule draws across (0.22/1/0.36/1 settle).
 * On scroll (pinned, linear from the first pixel, one viewport long) the photo grows to full bleed easing back from
 * a 1.15 zoom and the rule fades. The pin then rests on the full-bleed state (a reading hold) before the page moves
 * on. The box itself grows, so the photo is re-framed at every size and its subject stays in view.
 * Legible at every point of the growth: the Deep Sea copy sits under the photo, and a Limestone copy of it rides on a
 * layer clipped to the photo's box, over the photo's shade, so wherever the photo has reached a line of copy, that
 * line is light on shade, and everywhere else it is dark on Limestone (never dark copy on the photo).
 * The hero runs up under the glass bar and pins at the very top, so the photo opens to the full viewport, bar included
 * (no strip above it); the bar stays in place until the hero has gone (Navbar). The resting layout keeps the Figma
 * positions measured from under the bar (the 76 px offsets in the calc()s).
 */
export default function PageHero({ data: H }: { data: PageHeroData }) {
  const wrap = useRef<HTMLDivElement>(null), photo = useRef<HTMLDivElement>(null), lit = useRef<HTMLDivElement>(null),
    shade = useRef<HTMLDivElement>(null), rule = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = photo.current!, w = wrap.current!, q = gsap.utils.selector(w);
    if (reducedMotion()) return;
    const intro = gsap.timeline({ delay: 0.3, defaults: { ease: "aSettle" } })
      .add(blurIn(q("[data-pre], h1, [data-body]")))
      .addLabel("shown", 0.5)
      .fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "shown")
      .fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, "shown");
    if (!window.matchMedia("(min-width: 1024px)").matches) return () => { intro.kill(); };
    // the light layer's clip follows the photo's box exactly (both linear, from the same rect to the full wrap)
    const box = () => `inset(${el.offsetTop}px ${w.offsetWidth - el.offsetLeft - el.offsetWidth}px ${w.offsetHeight - el.offsetTop - el.offsetHeight}px ${el.offsetLeft}px)`;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
      .to(el, { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0, duration: 1 }, 0)
      .fromTo(lit.current, { clipPath: box() }, { clipPath: "inset(0px 0px 0px 0px)", duration: 1 }, 0)
      .fromTo(el.querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 1 }, 0)
      .to(rule.current, { opacity: 0, duration: 0.3 }, 0)
      // the shade is up before the photo's edge reaches the copy (about 0.25 in at 1024 px, 0.4 at 1440)
      .fromTo(shade.current, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.05);
    const vh = withHold(tl, 1);
    const st = ScrollTrigger.create({ trigger: w, start: "top top", end: `+=${vh * 100}%`, scrub: 1, pin: true, animation: tl });
    return () => { intro.kill(); st.kill(); tl.kill(); };
  }, []);
  const copy = (light: boolean) => (
    <div aria-hidden={light || undefined} className={`relative flex flex-col gap-4 py-16 container-x lg:absolute lg:left-0 lg:top-[calc(30.3%+53px)] lg:py-0 ${light ? "text-limestone-50" : "text-deepsea-500"}`}>
      <span data-pre={light ? undefined : ""} data-reveal={light ? undefined : ""} className="t-label l-16">{H.pre}</span>
      {(() => {
        const Tag = light ? "div" : "h1";
        return (
          <Tag data-reveal={light ? undefined : ""} className="t-label hd-56 max-w-[1000px] capitalize">
            {H.title.map((s, k) => (
              <Fragment key={k}>{s.br && <br />}{k > 0 && !s.br && " "}{s.i ? <span className="t-accent">{s.t}</span> : s.t}</Fragment>))}
          </Tag>);
      })()}
      <div data-body={light ? undefined : ""} data-reveal={light ? undefined : ""} className={light ? "text-limestone-50/90" : "text-limestone-800"}>
        <p className="t-body b-18 wrap-balance max-w-[520px]">{H.body}</p></div>
    </div>
  );
  return (
    // the pinned node is the inner div, so GSAP's pin-spacer never wraps the element React owns
    <section data-hero>
    <div ref={wrap} className="relative overflow-hidden bg-limestone-50 lg:h-[100svh] lg:min-h-[716px]">
      {/* slot from Figma (1512 × 760 under the bar): left 1092, top 480, 360 × 240, sitting on the rule. Phones: the photo
          runs up under the bar, the copy below it. From lg the photo lies over the dark copy (z-1), the light layer over
          both (z-2). Wider than 1512 it stays 360 wide on the right content edge, and on a tall screen at most 300 tall */}
      <div ref={photo} data-reveal className="relative h-[calc(60vh+76px)] overflow-hidden lg:absolute lg:z-[1] lg:left-[calc(100%-max(4%,var(--gutter))-min(23.8%,360px))] lg:top-[calc(94.8%+4px-min(31.6%-24px,300px))] lg:h-[min(calc(31.6%-24px),300px)] lg:w-[min(23.8%,360px)] lg:rounded-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={H.photo} alt={H.alt ?? ""} className="h-full w-full object-cover" />
      </div>
      {copy(false)}
      <div ref={lit} aria-hidden className="pointer-events-none absolute inset-0 z-[2] hidden [clip-path:inset(calc(94.8%_+_4px_-_min(31.6%_-_24px,300px))_max(4%,var(--gutter))_calc(5.2%_-_4px)_calc(100%_-_max(4%,var(--gutter))_-_min(23.8%,360px)))] lg:block">
        {/* the shade under the light copy (`.hero-side-shade`, held dark across the copy column) */}
        <div ref={shade} className="hero-side-shade absolute inset-0 opacity-0" />
        {copy(true)}
      </div>
      <div ref={rule} className="absolute inset-x-[var(--gutter)] top-[calc(94.7%+4px)] hidden h-px origin-left bg-limestone-300 lg:block" />
    </div>
    </section>
  );
}
